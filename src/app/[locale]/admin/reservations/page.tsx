'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen Reservations Live
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const qRes = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
    const unsubRes = onSnapshot(qRes, (snapshot) => {
      setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubRes();
  }, []);

  const toggleResStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateDoc(doc(db, "reservations", id), { status: newStatus });
  };

  const activeRes = reservations.filter(r => r.status !== 'completed');

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-500">
      
      {/* Zen Header Section */}
      <div className="text-center mb-16 relative mt-6 w-full">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] md:text-[12rem] font-serif text-black/5 select-none z-0 whitespace-nowrap pointer-events-none">
          予約
        </span>
        <h1 className="text-3xl md:text-5xl font-serif text-black relative z-10">Live Reservations</h1>
        <p className="mt-4 text-xs tracking-[0.3em] text-zinc-400 uppercase relative z-10">
          Tracking {activeRes.length} active tables
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6 relative z-10">
         {reservations.length === 0 && !loading && (
            <div className="text-center py-20 border-t border-b border-zinc-100">
              <p className="text-xl font-serif text-zinc-400">No active reservations right now.</p>
            </div>
         )}
         {loading && (
            <div className="text-center py-10">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 animate-pulse">Loading Live Data...</p>
            </div>
         )}
         <AnimatePresence>
           {reservations.map(res => (
             <motion.div 
               layout
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               key={res.id} 
               className={`bg-white p-8 border hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 ${res.status === 'completed' ? 'border-l-4 border-l-green-500 opacity-50 grayscale' : 'border-l-4 border-l-black'}`}
             >
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div className="w-full md:w-3/4">
                     <h3 className="text-2xl font-bold font-serif mb-1">{res.name}</h3>
                     <p className="text-sm font-bold text-zinc-400 mb-8">{res.phone}</p>
                     
                     <div className="grid grid-cols-2 gap-8 mb-4">
                       <div>
                         <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.2em]">Date & Time</p>
                         <p className="text-base font-serif mt-1 text-black">{res.date} at {res.time}</p>
                       </div>
                       <div>
                         <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.2em]">Guests</p>
                         <p className="text-base font-serif mt-1 text-black">{res.guests}</p>
                       </div>
                     </div>

                     {res.notes && (
                       <div className="mt-4 pt-4 border-t border-zinc-100">
                         <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.2em]">Customer Notes</p>
                         <p className="text-sm mt-2 italic text-zinc-600 font-serif border-l-2 border-zinc-200 pl-4">{res.notes}</p>
                       </div>
                     )}
                     <p className="text-[10px] text-zinc-300 mt-6 tracking-widest uppercase">Request placed: {new Date(res.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="mt-6 md:mt-0 text-right">
                     <button 
                       onClick={() => toggleResStatus(res.id, res.status)}
                       className={`text-[10px] uppercase tracking-widest font-bold px-6 py-2 border transition-colors ${res.status === 'completed' ? 'border-zinc-300 text-zinc-400' : 'border-black text-black hover:bg-black hover:text-white'}`}
                     >
                       {res.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                     </button>
                  </div>
                </div>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>
    </div>
  );
}
