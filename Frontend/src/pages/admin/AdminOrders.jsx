import { useEffect, useState } from "react";
import { db } from "@/context/FirebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const orderList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Update failed");
    }
  };

  const statusOptions = [
    "Order Placed",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      "Order Placed": "bg-blue-100 text-blue-700",
      "Out for Delivery": "bg-yellow-100 text-yellow-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          statusStyles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Customer Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card
            key={order.id}
            className="mb-6 p-6 rounded-2xl shadow-md border border-gray-200"
          >
            <div className="mb-4 border-b pb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Order ID: <span className="text-gray-500">{order.id}</span>
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Name:</strong>{" "}
                  {order.deliveryInfo?.firstName} {order.deliveryInfo?.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {order.deliveryInfo?.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.deliveryInfo?.phone}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {order.deliveryInfo?.street}, {order.deliveryInfo?.city},{" "}
                  {order.deliveryInfo?.state} - {order.deliveryInfo?.zipcode},{" "}
                  {order.deliveryInfo?.country}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Price: ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2">
                <strong>Status:</strong> {getStatusBadge(order.status)}
              </div>
              <select
                className="border px-3 py-2 rounded-md text-sm text-gray-700 bg-white focus:outline-none"
                value={order.status || "Order Placed"}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
