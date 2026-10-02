import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@/context/FirebaseContext";

const statusColors = {
  "Order Placed": "text-blue-600",
  "Out for Delivery": "text-yellow-600",
  Delivered: "text-green-600",
  Cancelled: "text-red-600",
};

const OrdersPage = () => {
  const { db, currentUser } = useFirebase();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!currentUser?.email) return;

      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userEmail", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        const userOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [currentUser, db]);

  const handleTrackOrder = async (orderId) => {
    try {
      // Fetch the current status of the order from Firestore
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);

      if (orderDoc.exists()) {
        const updatedStatus = orderDoc.data().status;

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: updatedStatus } : order
          )
        );
      } else {
        console.error("Order not found!");
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  if (loading) return <div className="p-6 text-gray-700">Loading your orders...</div>;

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-gray-900 border-b pb-4">MY ORDERS</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm"
            >
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">
                        ₹{item.price} | Quantity: {item.quantity}{" "}
                        {item.category !== "Accessories" && item.size && `| Size: ${item.size}`}
                      </p>
                      <p className="text-gray-600 text-sm">Date: {new Date(order.createdAt).toDateString()}</p>
                      <p className="text-gray-600 text-sm">Payment: {order.paymentMethod?.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`${
                        statusColors[order.status] || "text-gray-600"
                      } text-sm font-medium`}
                    >
                      ● {order.status || "Pending"}
                    </span>
                    <button
                      onClick={() => handleTrackOrder(order.id)}
                      className="mt-2 text-sm border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-100 transition"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
