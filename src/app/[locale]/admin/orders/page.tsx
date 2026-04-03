"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, updateDoc, doc, orderBy } from "firebase/firestore";
import { useTranslations } from "next-intl";
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
  createdAt: any; // Firestore Timestamp
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live orders
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    // Fallback static orders if firestore is empty
    const mockOrders: Order[] = [
      { id: "o1", customerName: "Amine K.", customerPhone: "0555-00-11-22", items: [{ name: "Spicy Tuna Roll", quantity: 2, price: 1800 }, { name: "Miso Soup", quantity: 1, price: 400 }], totalPrice: 4000, status: "pending", createdAt: new Date() },
      { id: "o2", customerName: "Sarah M.", customerPhone: "0770-99-88-77", items: [{ name: "Chicken Kati Kati", quantity: 1, price: 2100 }], totalPrice: 2100, status: "preparing", createdAt: new Date() },
      { id: "o3", customerName: "Yanis R.", customerPhone: "0666-44-33-22", items: [{ name: "Beef Teriyaki", quantity: 1, price: 2400 }, { name: "Matcha Mochi", quantity: 2, price: 800 }], totalPrice: 4000, status: "ready", createdAt: new Date() }
    ];

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // If the database is empty right now, use the mock ones so the dashboard isn't blank
        setOrders(mockOrders);
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
      setOrders(mockOrders); // Fallback on auth/permission denied error
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    try {
      // Don't update mock orders in firestore
      if (!orderId.startsWith("o")) {
         const orderRef = doc(db, "orders", orderId);
         await updateDoc(orderRef, { status: newStatus });
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending": return "bg-white border-zinc-200 shadow-sm";
      case "preparing": return "bg-orange-50 border-orange-200 shadow-sm";
      case "ready": return "bg-green-50 border-green-200 shadow-sm";
      default: return "bg-white border-zinc-200";
    }
  };

  const pending = orders.filter(o => o.status === "pending");
  const preparing = orders.filter(o => o.status === "preparing");
  const ready = orders.filter(o => o.status === "ready");

  const OrderCard = ({ order }: { order: Order }) => (
    <motion.div 
      layoutId={order.id}
      className={`p-4 rounded-xl border ${getStatusColor(order.status)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-black">{order.customerName}</h3>
          <p className="text-sm text-zinc-500 font-medium">{order.customerPhone}</p>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-bold">#{order.id.slice(-4)}</span>
      </div>
      
      <div className="space-y-1 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-black font-medium">{item.quantity}x {item.name}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-zinc-200">
        <span className="font-bold text-black">{order.totalPrice} DZD</span>
        
        <div className="flex gap-2">
          {order.status === "pending" && (
            <button onClick={() => handleStatusChange(order.id, "preparing")} className="px-3 py-1 bg-white text-black text-xs font-bold rounded hover:bg-zinc-200 transition">
              Accept
            </button>
          )}
          {order.status === "preparing" && (
            <button onClick={() => handleStatusChange(order.id, "ready")} className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded hover:bg-orange-600 transition">
              Mark Ready
            </button>
          )}
          {order.status === "ready" && (
            <button onClick={() => handleStatusChange(order.id, "completed")} className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition">
              Complete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Live Orders (Kitchen View)</h1>
          <p className="text-zinc-500 mt-1 font-medium">Manage kitchen queue in real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="bg-zinc-100/50 rounded-2xl p-4 border border-zinc-200 min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-black flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse"></span>
              New Orders
            </h2>
            <span className="bg-white border border-zinc-200 text-xs px-2 py-1 rounded-sm shadow-sm font-bold text-black">{pending.length}</span>
          </div>
          <div className="space-y-3">
            {pending.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        </div>

        {/* Preparing Column */}
        <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-200 min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-orange-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Kitchen Preparing
            </h2>
            <span className="bg-orange-100 text-xs px-2 py-1 rounded-sm font-bold text-orange-600">{preparing.length}</span>
          </div>
          <div className="space-y-3">
            {preparing.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        </div>

        {/* Ready Column */}
        <div className="bg-green-50/50 rounded-2xl p-4 border border-green-200 min-h-[500px]">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-bold text-green-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Ready for Pickup
            </h2>
            <span className="bg-green-100 text-xs px-2 py-1 rounded-sm font-bold text-green-600">{ready.length}</span>
          </div>
          <div className="space-y-3">
            {ready.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
