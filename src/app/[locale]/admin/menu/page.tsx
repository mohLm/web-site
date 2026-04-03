"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: string;
  name: string;
  nameJp: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

const DUMMY_MENU: MenuItem[] = [
  { id: 'm1', name: "Dragon Roll", nameJp: "ドラゴンロール", description: "Shrimp tempura, eel, avocado, topped with spicy mayo and unagi sauce.", price: 1800, category: 'Sushi & Roll', available: true },
  { id: 'm2', name: "Spicy Tuna Crunch", nameJp: "スパイシーツナ", description: "Fresh tuna, spicy mayo, cucumber, tempura flakes.", price: 1500, category: 'Sushi & Roll', available: true },
  { id: 'm3', name: "Tonkotsu Ramen", nameJp: "豚骨ラーメン", description: "Rich 12-hour pork broth, chashu, soft boiled egg, nori, scallions.", price: 2400, category: 'Ramen Bowls', available: true },
  { id: 'm4', name: "Matcha Mochi", nameJp: "抹茶もっち", description: "Traditional sweet pounded rice cake filled with premium green tea ice cream.", price: 800, category: 'Japanese Sweets', available: false },
];

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>(DUMMY_MENU);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: "", nameJp: "", description: "", price: 0, category: "Sushi & Roll", available: true
  });

  const handleOpenNew = () => {
    setEditingItem(null);
    setFormData({ name: "", nameJp: "", description: "", price: 0, category: "Sushi & Roll", available: true });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsFormOpen(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this exquisite dish?")) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleToggleAvailability = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...formData } as MenuItem : i));
    } else {
      const newItem: MenuItem = {
        id: 'm' + Date.now(),
        ...(formData as Omit<MenuItem, 'id'>)
      };
      setItems([newItem, ...items]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="font-sans flex flex-col items-center">
      
      {/* Zen Header Section */}
      <div className="text-center mb-16 relative mt-12">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[10rem] font-serif text-[#ce1226]/5 select-none z-0 whitespace-nowrap">
          献立
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-black relative z-10">Menu Management</h1>
        <p className="mt-6 text-sm tracking-[0.2em] text-zinc-400 uppercase relative z-10">
          Curate your elegant offerings
        </p>
      </div>



      {/* Elegant Menu List */}
      <div className="w-full max-w-4xl space-y-6">
        {items.map(item => (
          <motion.div 
            layoutId={`card-${item.id}`} 
            key={item.id}
            className={`p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white border border-zinc-100 transition-all duration-500 relative group ${!item.available ? 'opacity-60 grayscale' : 'hover:shadow-xl hover:shadow-[#ce1226]/5'}`}
          >
            {/* Red structural accent line on hover */}
            <div className="absolute top-0 left-0 h-full w-[2px] bg-[#ce1226] transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500"></div>

            <div className="flex-1">
              <p className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">{item.category}</p>
              <div className="flex items-baseline gap-4 mb-2">
                <h3 className="text-2xl font-serif text-black">{item.name}</h3>
                <span className="text-xl font-serif text-zinc-300">{item.nameJp}</span>
                {!item.available && (
                  <span className="text-[10px] tracking-[0.2em] font-bold text-red-600 border border-red-600 px-2 py-0.5 ml-4">SOLD OUT</span>
                )}
              </div>
              <p className="text-sm text-zinc-500 italic font-serif leading-relaxed max-w-2xl">
                {item.description}
              </p>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-6 md:gap-4">
              <span className="text-2xl font-serif text-[#ce1226]">
                {item.price} <span className="text-[10px] uppercase tracking-widest text-zinc-400 ml-1">DZD</span>
              </span>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleToggleAvailability(item.id)}
                  className="text-xs tracking-wider uppercase font-bold text-zinc-400 hover:text-black transition-colors"
                >
                  {item.available ? 'SET SOLD OUT' : 'RESTORE'}
                </button>
                <div className="w-px h-3 bg-zinc-300"></div>
                <button 
                  onClick={() => handleOpenEdit(item)}
                  className="text-xs tracking-wider uppercase font-bold text-zinc-400 hover:text-black transition-colors"
                >
                  EDIT
                </button>
                <div className="w-px h-3 bg-zinc-300"></div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-xs tracking-wider uppercase font-bold text-red-300 hover:text-red-600 transition-colors"
                >
                  DEL
                </button>
              </div>
            </div>

          </motion.div>
        ))}
      </div>

      {/* Elegant Inline Form (Now at bottom) */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20, overflow: 'hidden' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl mt-8 mb-16"
          >
            <div className="bg-white/80 backdrop-blur border border-zinc-200 p-8 md:p-12 shadow-2xl relative">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="absolute top-8 right-8 text-zinc-400 hover:text-black transition-colors"
                title="Close"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-serif text-black mb-8">
                {editingItem ? "Refine Dish" : "Introduce New Dish"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">English Name</label>
                    <input 
                      required 
                      autoFocus
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="bg-transparent border-b border-zinc-300 py-2 text-xl font-serif text-black placeholder:text-zinc-200 focus:outline-none focus:border-[#ce1226] transition-colors rounded-none"
                      placeholder="e.g. Kyoto Roll"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Japanese Name</label>
                    <input 
                      type="text" 
                      value={formData.nameJp}
                      onChange={e => setFormData({...formData, nameJp: e.target.value})}
                      className="bg-transparent border-b border-zinc-300 py-2 text-xl font-serif text-black placeholder:text-zinc-200 focus:outline-none focus:border-[#ce1226] transition-colors rounded-none"
                      placeholder="e.g. 京都ロール"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Description</label>
                  <textarea 
                    required 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={2}
                    className="bg-transparent border-b border-zinc-300 py-2 text-sm text-zinc-600 focus:outline-none focus:border-[#ce1226] transition-colors resize-none rounded-none"
                    placeholder="List the fresh ingredients and beautiful preparation..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Price (DZD)</label>
                    <input 
                      required 
                      type="number" 
                      min="0"
                      value={formData.price || ''}
                      onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      className="bg-transparent border-b border-zinc-300 py-2 text-xl font-serif text-[#ce1226] focus:outline-none focus:border-[#ce1226] transition-colors rounded-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="bg-transparent border-b border-zinc-300 py-2 text-sm text-black focus:outline-none focus:border-[#ce1226] transition-colors rounded-none appearance-none cursor-pointer"
                    >
                      <option>Sushi & Roll</option>
                      <option>Ramen Bowls</option>
                      <option>Tempura Dishes</option>
                      <option>Japanese Sweets</option>
                      <option>Beverages</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors duration-300"
                  >
                    {editingItem ? "SAVE CHANGES" : "PUBLISH DISH"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl mt-12 mb-12 flex justify-center">
        {!isFormOpen && (
          <button 
            onClick={() => {
              handleOpenNew();
              setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }, 100);
            }}
            className="px-8 py-4 border border-zinc-300 text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase hover:border-[#ce1226] hover:text-[#ce1226] transition-colors duration-500 w-full border-dashed"
          >
            + ADD NEW DISH
          </button>
        )}
      </div>

    </div>
  );
}
