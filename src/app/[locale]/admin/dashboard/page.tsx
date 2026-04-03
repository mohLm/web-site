'use client'

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from '@/navigation';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboardPage() {
  const t = useTranslations('Admin');
  const [user, setUser] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('sushi');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        setUser(currentUser);
        fetchMenu();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "menu_items"));
    setMenuItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    let imageUrl = "";
    if (image) {
      const storageRef = ref(storage, `menu/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "menu_items"), {
      name,
      price,
      description,
      category,
      imageUrl,
      createdAt: new Date().toISOString()
    });

    // Reset Form
    setName('');
    setPrice('');
    setDescription('');
    setImage(null);
    setUploading(false);
    fetchMenu();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteDoc(doc(db, "menu_items", id));
      fetchMenu();
    }
  };

  if (!user) return null;

  return (
    <div className="admin-dashboard-page bg-secondary min-h-screen py-24">
      <div className="container">
        <header className="flex justify-between items-center mb-16 border-b border-border pb-8">
          <div>
            <h1 className="text-4xl serif italic">Dashboard</h1>
            <p className="text-muted text-xs uppercase tracking-widest mt-2">{t('menu')}</p>
          </div>
          <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-all">
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Add Item Form */}
          <section className="bg-white p-12 zen-border h-fit shadow-xl shadow-secondary">
            <h2 className="text-xl font-bold mb-8 uppercase tracking-widest tracking-tighter">Add New Item</h2>
            <form onSubmit={handleUpload} className="space-y-6">
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

          {/* List Section */}
          <section className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-bold mb-8 uppercase tracking-widest tracking-tighter">Current Menu</h2>
            {loading ? (
              <p className="text-muted tracking-widest text-xs uppercase">Loading items...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {menuItems.map(item => (
                  <motion.div 
                    layout
                    key={item.id}
                    className="bg-white p-6 zen-border flex gap-4 items-center group shadow-md shadow-secondary/20"
                  >
                    {item.imageUrl && (
                      <div className="relative w-24 h-24 bg-secondary flex-shrink-0">
                         <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted mb-2">{item.price}</p>
                      <button onClick={() => handleDelete(item.id)} className="text-[10px] uppercase tracking-widest font-bold text-primary opacity-0 group-hover:opacity-100 transition-all">
                         Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
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
