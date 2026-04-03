"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";

type OrderStatus = "pending" | "preparing" | "ready" | "completed";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: any; 
  address?: string;
  timeElapsed?: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    const mockOrders: Order[] = [
      { id: "YM-8821", customerName: "Amine Bensaid", customerPhone: "+213 550 12 34 56", address: "Hydra, Algiers", timeElapsed: "12 mins ago", items: [{ name: "Dragon Roll", quantity: 2, price: 1800 }, { name: "Miso Soup", quantity: 1, price: 400 }], totalPrice: 4000, status: "preparing", createdAt: new Date() },
      { id: "YM-8819", customerName: "Sarah Mansouri", customerPhone: "+213 661 88 99 00", address: "Ben Aknoun", timeElapsed: "24 mins ago", items: [{ name: "Chicken Kati Kati", quantity: 1, price: 2100 }], totalPrice: 2100, status: "ready", createdAt: new Date() }
    ];

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
         // Keep mocks for visual testing until we add real data
         if (orders.length === 0) setOrders(mockOrders);
      } else {
        const liveOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(liveOrders);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      if (orders.length === 0) setOrders(mockOrders); 
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      if (!orderId.startsWith("YM-")) {
         const orderRef = doc(db, "orders", orderId);
         await updateDoc(orderRef, { status: newStatus });
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const activeOrders = orders.filter(o => o.status !== "completed");

  return (
    <div className="font-sans flex flex-col items-center">
      
      {/* Zen Header Section */}
      <div className="text-center mb-24 relative mt-12">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[10rem] font-serif text-[#ce1226]/5 select-none z-0 whitespace-nowrap">
          注文
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-black relative z-10">Live Kitchen Orders</h1>
        <p className="mt-6 text-sm tracking-[0.2em] text-zinc-400 uppercase relative z-10">
          Real-time tracking for {activeOrders.length} active orders
        </p>
      </div>

      {/* Orders List */}
      <div className="w-full max-w-4xl space-y-8">
        {activeOrders.length === 0 ? (
          <div className="text-center py-20 border-t border-b border-zinc-100">
            <p className="text-xl font-serif text-zinc-400">No active orders right now.</p>
          </div>
        ) : (
          activeOrders.map(order => (
            <motion.div 
              layoutId={order.id} 
              key={order.id}
              className="bg-white/90 backdrop-blur p-8 lg:p-12 border border-zinc-100 flex flex-col md:flex-row gap-8 lg:gap-12 hover:shadow-2xl hover:shadow-[#ce1226]/5 transition-all duration-500 relative overflow-hidden group"
            >
              {/* Decorative side accent */}
              <div className="absolute top-0 left-0 h-full w-1 bg-[#ce1226] transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>

              {/* Order Meta Data */}
              <div className="md:w-1/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif text-black mb-1">{order.customerName}</h3>
                  <p className="font-mono text-xs text-zinc-400 mb-6">#{order.id.startsWith("YM") ? order.id : order.id.slice(-6).toUpperCase()}</p>
                  
                  <div className="space-y-2 text-sm text-zinc-600">
                    <p>{order.customerPhone}</p>
                    <p className="italic">{order.address || "Collection"}</p>
                    <p className="text-zinc-400">{order.timeElapsed || "Just now"}</p>
                  </div>
                </div>
              </div>

              {/* Order Items & Actions */}
              <div className="md:w-2/3 flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-100 pt-6 md:pt-0 md:pl-12">
                <div className="mb-8">
                   <p className="text-xs tracking-[0.2em] text-zinc-400 uppercase mb-4">Order Items</p>
                   <div className="space-y-3 font-serif md:text-lg">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-end border-b border-dashed border-zinc-200 pb-2">
                          <span className="text-black">{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                  <span className="text-2xl font-serif text-[#ce1226]">{order.totalPrice} <span className="text-sm text-zinc-400 uppercase tracking-widest">DZD</span></span>
                  
                  {/* Status Buttons - Minimalist style */}
                  <div className="flex gap-4">
                    {order.status === "pending" && (
                      <button 
                        onClick={() => handleStatusChange(order.id, "preparing")}
                        className="px-8 py-3 border border-black text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300"
                      >
                        ACCEPT
                      </button>
                    )}
                    {order.status === "preparing" && (
                      <button 
                        onClick={() => handleStatusChange(order.id, "ready")}
                        className="px-8 py-3 border border-[#ce1226] text-[#ce1226] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#ce1226] hover:text-white transition-colors duration-300 relative overflow-hidden group"
                      >
                        <span className="relative z-10">MARK READY</span>
                        <div className="absolute inset-0 bg-[#ce1226] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0"></div>
                      </button>
                    )}
                    {order.status === "ready" && (
                      <button 
                        onClick={() => handleStatusChange(order.id, "completed")}
                        className="px-8 py-3 bg-black text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors duration-300"
                      >
                        COMPLETE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
