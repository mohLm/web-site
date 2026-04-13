'use client'

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from '@/navigation';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboardPage() {
  const t = useTranslations('Admin');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'menu'>('orders');

  // Multi-state
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form State (Menu)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('sushi');
  const [image, setImage] = useState<File | null>(null);

  // Auth Guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Data Fetchers
  useEffect(() => {
    if (!user) return;

    // Fetch Menu Static
    const fetchMenu = async () => {
      const querySnapshot = await getDocs(collection(db, "menu_items"));
      setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMenu();

    // Listen Orders Live
    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen Reservations Live
    const qRes = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
    const unsubRes = onSnapshot(qRes, (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubRes();
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  // --- Menu Handlers ---
  const handleUploadMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = "";
    if (image) {
      const storageRef = ref(storage, `menu/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }
    await addDoc(collection(db, "menu_items"), {
      name, price, description, category, imageUrl, createdAt: new Date().toISOString()
    });
    setName(''); setPrice(''); setDescription(''); setImage(null); setUploading(false);
    
    // Refresh local
    const querySnapshot = await getDocs(collection(db, "menu_items"));
    setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDeleteMenu = async (id: string) => {
    if (confirm("Delete this menu item?")) {
      await deleteDoc(doc(db, "menu_items", id));
      const querySnapshot = await getDocs(collection(db, "menu_items"));
      setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  // --- Order/Res Handlers ---
  const toggleOrderStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateDoc(doc(db, "orders", id), { status: newStatus });
  };
  const toggleResStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateDoc(doc(db, "reservations", id), { status: newStatus });
  };

  if (!user) return null;

  return (
    <div className="bg-secondary min-h-screen py-24">
      <div className="container">
        
        {/* Header & Tabs */}
        <header className="mb-12 border-b border-border pb-8">
          <div className="flex justify-between items-center mb-12">
             <div>
               <h1 className="text-4xl serif italic">Dashboard</h1>
               <p className="text-muted text-xs uppercase tracking-widest mt-2">Yamato Management</p>
             </div>
             <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-all">
               Logout
             </button>
          </div>

          <div className="flex space-x-12">
             {[
               { id: 'orders', label: 'Live Orders', count: orders.filter(o => o.status !== 'completed').length },
               { id: 'reservations', label: 'Reservations', count: reservations.filter(r => r.status !== 'completed').length },
               { id: 'menu', label: 'Menu Editor', count: null }
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`relative pb-4 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id ? 'text-foreground' : 'text-muted hover:text-foreground/70'}`}
               >
                 {tab.label}
                 {tab.count !== null && tab.count > 0 && (
                   <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded-full">{tab.count}</span>
                 )}
                 {activeTab === tab.id && (
                   <motion.div layoutId="activetab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                 )}
               </button>
             ))}
          </div>
        </header>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                 {orders.length === 0 && !loading && <p className="text-muted tracking-widest text-xs uppercase">No orders yet.</p>}
                 {orders.map(order => (
                   <div key={order.id} className={`bg-white p-8 zen-border border-l-4 transition-colors ${order.status === 'completed' ? 'border-l-green-500 opacity-60' : 'border-l-primary'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                           <h3 className="text-xl font-bold font-serif italic mb-1">{order.customerName}</h3>
                           <p className="text-sm font-bold text-muted">{order.customerPhone}</p>
                           <p className="text-xs text-muted mt-2">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                           <div className="text-2xl font-bold font-serif italic text-primary">{order.totalPrice} DZ</div>
                           <button 
                             onClick={() => toggleOrderStatus(order.id, order.status)}
                             className={`mt-4 text-[10px] uppercase tracking-widest font-bold px-4 py-2 border ${order.status === 'completed' ? 'border-muted text-muted' : 'border-primary text-primary bg-primary/5 hover:bg-primary hover:text-white transition-colors'}`}
                           >
                             {order.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                           </button>
                        </div>
                      </div>
                      
                      <div className="border-t border-border pt-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Order Items</p>
                        <div className="space-y-2">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                               <span><span className="font-bold mr-2">x{item.quantity}</span> {item.name}</span>
                               <span className="font-medium text-muted">{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div className="space-y-6">
                 {reservations.length === 0 && !loading && <p className="text-muted tracking-widest text-xs uppercase">No reservations yet.</p>}
                 {reservations.map(res => (
                   <div key={res.id} className={`bg-white p-8 zen-border border-l-4 transition-colors ${res.status === 'completed' ? 'border-l-green-500 opacity-60' : 'border-l-black'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-xl font-bold font-serif italic mb-1">{res.name}</h3>
                           <p className="text-sm font-bold text-muted mb-6">{res.phone}</p>
                           
                           <div className="grid grid-cols-2 gap-8 mb-4">
                             <div>
                               <p className="text-[10px] uppercase font-bold text-muted tracking-widest">Date & Time</p>
                               <p className="text-base font-medium mt-1">{res.date} at {res.time}</p>
                             </div>
                             <div>
                               <p className="text-[10px] uppercase font-bold text-muted tracking-widest">Guests</p>
                               <p className="text-base font-medium mt-1">{res.guests}</p>
                             </div>
                           </div>

                           {res.notes && (
                             <div className="mt-4 pt-4 border-t border-border">
                               <p className="text-[10px] uppercase font-bold text-muted tracking-widest">Notes</p>
                               <p className="text-sm mt-2 italic text-foreground/80">{res.notes}</p>
                             </div>
                           )}
                           <p className="text-xs text-muted mt-6 opacity-50">Booked: {new Date(res.createdAt).toLocaleString()}</p>
                        </div>
                        
                        <button 
                             onClick={() => toggleResStatus(res.id, res.status)}
                             className={`mt-2 text-[10px] uppercase tracking-widest font-bold px-4 py-2 border ${res.status === 'completed' ? 'border-muted text-muted' : 'border-black text-black hover:bg-black hover:text-white transition-colors'}`}
                           >
                             {res.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                           </button>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {/* Menu Editor Tab */}
            {activeTab === 'menu' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <section className="bg-white p-12 zen-border h-fit shadow-xl shadow-secondary">
                  <h2 className="text-xl font-bold mb-8 uppercase tracking-widest tracking-tighter">Add New Item</h2>
                  <form onSubmit={handleUploadMenu} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">Item Name</label>
                      <input required value={name} onChange={e => setName(e.target.value)} type="text" className="admin-input" placeholder="Ex. Spicy Tuna Roll" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">Price</label>
                      <input required value={price} onChange={e => setPrice(e.target.value)} type="text" className="admin-input" placeholder="Ex. 1500 DZ" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)} className="admin-input bg-transparent font-bold">
                        <option value="sushi">Sushi</option>
                        <option value="ramen">Ramen</option>
                        <option value="appetizers">Appetizers</option>
                        <option value="desserts">Desserts</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">Description</label>
                      <textarea value={description} onChange={e => setDescription(e.target.value)} className="admin-input resize-none h-24" placeholder="Brief description..."></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted">Photo</label>
                      <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} className="text-xs font-bold w-full" />
                    </div>
                    <button disabled={uploading} className="btn-primary w-full mt-8 disabled:bg-muted">
                      {uploading ? "Uploading..." : "Save Item"}
                    </button>
                  </form>
                </section>

                <section className="lg:col-span-2 space-y-8">
                  <h2 className="text-xl font-bold mb-8 uppercase tracking-widest tracking-tighter">Current Menu</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {menuItems.map(item => (
                      <motion.div layout key={item.id} className="bg-white p-6 zen-border flex gap-4 items-center group shadow-md shadow-secondary/20">
                        {item.imageUrl && (
                          <div className="relative w-24 h-24 bg-secondary flex-shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted mb-2">{item.price}</p>
                          <button onClick={() => handleDeleteMenu(item.id)} className="text-[10px] uppercase tracking-widest font-bold text-primary opacity-0 group-hover:opacity-100 transition-all">
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        .admin-input {
          width: 100%;
          border-bottom: 2px solid var(--border);
          padding: 1rem 0;
          outline: none;
          transition: all 0.3s;
        }
        .admin-input:focus {
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
