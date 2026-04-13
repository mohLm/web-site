'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameJp, setNameJp] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Sushi & Roll');
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Fetch Menu Live
  useEffect(() => {
    if (!db) return;
    const unsubMenu = onSnapshot(collection(db, "menu_items"), (snapshot) => {
      setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubMenu();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setName(''); setNameJp(''); setPrice(''); setDescription(''); setCategory('Sushi & Roll'); setImageUrlInput('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name || '');
    setNameJp(item.nameJp || '');
    setPrice(item.price || '');
    setDescription(item.description || '');
    setCategory(item.category || 'Sushi & Roll');
    setImageUrlInput(item.imageUrl || '');
    setIsFormOpen(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this menu item?")) {
      await deleteDoc(doc(db, "menu_items", id));
    }
  };

  const toggleAvailability = async (id: string, currentAvailable: boolean) => {
    // If field doesn't exist, assume it was true originally
    const isCurrentlyAvail = currentAvailable === undefined ? true : currentAvailable;
    await updateDoc(doc(db, "menu_items", id), { available: !isCurrentlyAvail });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const payload = {
        name, nameJp, price, description, category, imageUrl: imageUrlInput, available: true
      };

      if (editingId) {
        await updateDoc(doc(db, "menu_items", editingId), payload);
      } else {
        await addDoc(collection(db, "menu_items"), { ...payload, createdAt: new Date().toISOString() });
      }

      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving dish:", error);
      alert("Error saving dish. Please check your connection or image size.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-500">
      
      {/* Zen Header Section */}
      <div className="text-center mb-16 relative mt-6 w-full">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] md:text-[12rem] font-serif text-[#ce1226]/5 select-none z-0 whitespace-nowrap pointer-events-none">
          献立
        </span>
        <h1 className="text-3xl md:text-5xl font-serif text-black relative z-10">Menu Management</h1>
        <p className="mt-4 text-xs tracking-[0.3em] text-zinc-400 uppercase relative z-10">
          Curate {menuItems.length} active dishes
        </p>
      </div>

      <div className="w-full max-w-4xl mt-4 mb-8 flex justify-end z-10">
        <button 
          onClick={handleOpenNew}
          className="px-6 py-3 bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#ce1226] transition-colors duration-300"
        >
          + ADD NEW DISH
        </button>
      </div>

      <div className="w-full max-w-4xl space-y-6 relative z-10 block">
        {menuItems.map(item => {
           const isAvail = item.available === undefined ? true : item.available;
           return (
          <motion.div 
            layout 
            key={item.id}
            className={`p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white border border-zinc-100 transition-all duration-500 relative group ${!isAvail ? 'opacity-50 grayscale' : 'hover:shadow-2xl hover:shadow-[#ce1226]/5'}`}
          >
            <div className="absolute top-0 left-0 h-full w-[2px] bg-[#ce1226] transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500"></div>

            <div className="flex-1 flex gap-6 w-full">
              {item.imageUrl && (
                 <div className="w-20 h-20 bg-zinc-100 flex-shrink-0 relative overflow-hidden border border-zinc-200">
                    <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                 </div>
              )}
              <div className="flex-1">
                <p className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">{item.category}</p>
                <div className="flex items-baseline gap-4 mb-2">
                  <h3 className="text-2xl font-serif text-black">{item.name}</h3>
                  <span className="text-xl font-serif text-zinc-300">{item.nameJp}</span>
                  {!isAvail && (
                    <span className="text-[10px] tracking-[0.2em] font-bold text-red-600 border border-red-600 px-2 py-0.5 ml-4">SOLD OUT</span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 italic font-serif leading-relaxed max-w-2xl line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-6 md:gap-4 flex-shrink-0">
              <span className="text-2xl font-serif text-[#ce1226]">
                {item.price} <span className="text-[10px] uppercase tracking-widest text-zinc-400 ml-1 font-sans">DZD</span>
              </span>

              <div className="flex items-center gap-3">
                <button onClick={() => toggleAvailability(item.id, isAvail)} className="text-[10px] tracking-wider uppercase font-bold text-black border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors">
                  {isAvail ? 'MARK OUT' : 'RESTORE'}
                </button>
                <button onClick={() => handleOpenEdit(item)} className="text-[10px] tracking-wider uppercase font-bold text-zinc-500 hover:text-black transition-colors">
                  EDIT
                </button>
                <div className="w-px h-3 bg-zinc-300"></div>
                <button onClick={() => handleDelete(item.id)} className="text-[10px] tracking-wider uppercase font-bold text-red-300 hover:text-[#ce1226] transition-colors">
                  DEL
                </button>
              </div>
            </div>
          </motion.div>
        )})}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-zinc-200 p-8 md:p-12 shadow-2xl relative w-full max-w-3xl my-auto"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-black transition-colors">
                ✕
              </button>
              
              <h2 className="text-2xl font-serif text-black mb-8">
                {editingId ? "Refine Dish" : "Introduce New Dish"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">English Name</label>
                    <input required autoFocus type="text" value={name} onChange={e => setName(e.target.value)} className="bg-transparent border-b border-zinc-300 py-2 text-xl font-serif text-black placeholder:text-zinc-200 focus:outline-none focus:border-[#ce1226] transition-colors rounded-none" placeholder="e.g. Kyoto Roll" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Japanese Name</label>
                    <input type="text" value={nameJp} onChange={e => setNameJp(e.target.value)} className="bg-transparent border-b border-zinc-300 py-2 text-xl font-serif text-black placeholder:text-zinc-200 focus:outline-none focus:border-[#ce1226] transition-colors rounded-none" placeholder="e.g. 京都ロール" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Description</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={2} className="bg-transparent border-b border-zinc-300 py-2 text-sm text-zinc-600 focus:outline-none focus:border-[#ce1226] transition-colors resize-none rounded-none" placeholder="List the fresh ingredients..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Price (DZD)</label>
                    <input required type="text" value={price} onChange={e => setPrice(e.target.value)} className="bg-transparent border-b border-zinc-300 py-2 text-xl font-serif text-[#ce1226] focus:outline-none focus:border-[#ce1226] transition-colors rounded-none" placeholder="1500" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="bg-transparent border-b border-zinc-300 py-2 text-sm text-black focus:outline-none focus:border-[#ce1226] transition-colors rounded-none appearance-none cursor-pointer">
                      <option>Sushi & Roll</option>
                      <option>Ramen Bowls</option>
                      <option>Tempura Dishes</option>
                      <option>Japanese Sweets</option>
                      <option>Beverages</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Photo URL (Optional)</label>
                    <input type="text" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} className="bg-transparent border-b border-zinc-300 py-2 text-xs text-black placeholder:text-zinc-200 focus:outline-none focus:border-[#ce1226] transition-colors rounded-none" placeholder="e.g. https://imgur.com/your-image.jpg" />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={uploading} className="px-8 py-3 bg-[#ce1226] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-800 disabled:opacity-50 transition-colors duration-300">
                    {uploading ? "UPLOADING..." : (editingId ? "SAVE CHANGES" : "PUBLISH DISH")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
