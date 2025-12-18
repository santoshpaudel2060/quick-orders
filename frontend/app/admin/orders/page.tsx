"use client";

import { useEffect, useState } from "react";
import { api } from "../../libs/api";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  tableNumber: number;
  customerId: string;
  items: OrderItem[];
  status: "pending" | "cooking" | "ready" | "served" | "paid";
  totalAmount: number;
  createdAt: string;
}

const statusColors: Record<Order["status"], string> = {
  pending: "bg-red-100 text-red-800 border border-red-300",
  cooking: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  ready: "bg-blue-100 text-blue-800 border border-blue-300",
  served: "bg-green-100 text-green-800 border border-green-300",
  paid: "bg-gray-100 text-gray-800 border border-gray-300",
};

const statusEmoji: Record<Order["status"], string> = {
  pending: "⏱️",
  cooking: "🍳",
  ready: "✓",
  served: "🍽️",
  paid: "💳",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/orders/all");
        setOrders(res.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await api.post("/orders/update-status", { orderId, status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const pending = orders.filter((o) => o.status === "pending");
  const cooking = orders.filter((o) => o.status === "cooking");
  const ready = orders.filter((o) => o.status === "ready");
  const served = orders.filter((o) => o.status === "served");

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-8">
          📋 Active Orders
        </h1>

        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
            <p className="text-3xl font-black text-red-600">{pending.length}</p>
            <p className="text-sm font-bold text-red-700">Pending</p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
            <p className="text-3xl font-black text-yellow-600">
              {cooking.length}
            </p>
            <p className="text-sm font-bold text-yellow-700">Cooking</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
            <p className="text-3xl font-black text-blue-600">{ready.length}</p>
            <p className="text-sm font-bold text-blue-700">Ready</p>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
            <p className="text-3xl font-black text-green-600">
              {served.length}
            </p>
            <p className="text-sm font-bold text-green-700">Served</p>
          </div>
          {/* <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-center">
            <p className="text-3xl font-black text-gray-600">
              {orders.filter((o) => o.status === "paid").length}
            </p>
            <p className="text-sm font-bold text-gray-700">Paid</p>
          </div> */}
        </div>

        {orders.length === 0 ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center">
            <p className="text-2xl font-black text-slate-600 mb-2">
              🎉 No Active Orders
            </p>
            <p className="text-slate-500 font-semibold">
              All orders are completed
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`border-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${
                  order.status === "pending"
                    ? "border-red-300 bg-red-50"
                    : order.status === "cooking"
                    ? "border-yellow-300 bg-yellow-50"
                    : order.status === "ready"
                    ? "border-blue-300 bg-blue-50"
                    : order.status === "served"
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                {/* Header */}
                <div
                  className={`px-6 py-4 text-white ${
                    order.status === "pending"
                      ? "bg-red-500"
                      : order.status === "cooking"
                      ? "bg-yellow-500"
                      : order.status === "ready"
                      ? "bg-blue-500"
                      : order.status === "served"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold opacity-80">
                        Table {order.tableNumber}
                      </p>
                      <p className="text-2xl font-black">
                        {statusEmoji[order.status]} {order.status.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-80">
                        Customer: {order.customerId}
                      </p>
                      <p className="text-sm opacity-80">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <h3 className="font-black text-gray-900 mb-3">
                    Order Items:
                  </h3>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.qty}x {item.name}
                        </span>
                        <span className="font-bold text-gray-900">
                          ${(item.qty * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 mb-4">
                    <div className="flex justify-between font-black text-lg">
                      <span>Total:</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <button
                        onClick={() => updateStatus(order._id, "cooking")}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded font-bold text-sm"
                      >
                        Send to Kitchen
                      </button>
                    )}
                    {order.status === "cooking" && (
                      <button
                        onClick={() => updateStatus(order._id, "ready")}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-bold text-sm"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === "ready" && (
                      <button
                        onClick={() => updateStatus(order._id, "served")}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-bold text-sm"
                      >
                        Served
                      </button>
                    )}
                    {order.status === "served" && (
                      <button
                        onClick={() => updateStatus(order._id, "paid")}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold text-sm"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
