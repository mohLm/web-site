'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen Orders Live
  useEffect(() => {
    if (!db) {
       setLoading(false);
       return;
    }
    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubOrders();
  }, []);

  const toggleOrderStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateDoc(doc(db, "orders", id), { status: newStatus });
  };

  const activeOrders = orders.filter(o => o.status !== 'completed');

  return (
    <div className="flex flex-col items-center animate-in fade-in duration-500">
      
      {/* Zen Header Section */}
      <div className="text-center mb-16 relative mt-6 w-full">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] md:text-[12rem] font-serif text-[#ce1226]/5 select-none z-0 whitespace-nowrap pointer-events-none">
          注文
        </span>
        <h1 className="text-3xl md:text-5xl font-serif text-black relative z-10">Live Kitchen Orders</h1>
        <p className="mt-4 text-xs tracking-[0.3em] text-zinc-400 uppercase relative z-10">
          Tracking {activeOrders.length} active orders
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6 relative z-10">
         {orders.length === 0 && !loading && (
            <div className="text-center py-20 border-t border-b border-zinc-100">
              <p className="text-xl font-serif text-zinc-400">No active orders right now.</p>
            </div>
         )}
         {loading && (
            <div className="text-center py-10">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 animate-pulse">Loading Live Data...</p>
            </div>
         )}
         <AnimatePresence>
           {orders.map(order => (
             <motion.div 
               layout
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               key={order.id} 
               className={`bg-white p-8 border hover:shadow-2xl hover:shadow-[#ce1226]/5 transition-all duration-500 ${order.status === 'completed' ? 'border-l-4 border-l-green-500 opacity-50 grayscale' : 'border-l-4 border-l-[#ce1226]'}`}
             >
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                  <div>
                     <h3 className="text-2xl font-bold font-serif mb-1">{order.customerName}</h3>
                     <p className="text-sm font-bold text-zinc-400">{order.customerPhone}</p>
                     <p className="text-xs text-zinc-400 mt-2 tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right mt-4 md:mt-0">
                     <div className="text-2xl font-bold font-serif text-[#ce1226]">{order.totalPrice} <span className="text-[10px] text-zinc-400 tracking-[0.2em] font-sans">DZD</span></div>
                     <button 
                       onClick={() => toggleOrderStatus(order.id, order.status)}
                       className={`mt-4 text-[10px] uppercase tracking-widest font-bold px-6 py-2 border transition-colors ${order.status === 'completed' ? 'border-zinc-300 text-zinc-400' : 'border-black text-black hover:bg-black hover:text-white'}`}
                     >
                       {order.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                     </button>
                  </div>
                </div>
                
                <div className="border-t border-zinc-100 pt-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Order Items ({order.items?.length})</p>
                  <div className="space-y-3">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm md:text-base border-b border-zinc-50 border-dashed pb-2">
                         <span><span className="font-bold mr-3 font-serif">x{item.quantity}</span>{item.name}</span>
                         <span className="font-medium text-zinc-400">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>
    </div>
  );
}
