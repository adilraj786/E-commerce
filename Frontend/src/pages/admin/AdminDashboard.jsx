import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "@/context/FirebaseContext";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnapshot = await getDocs(collection(db, "users"));
        const productSnapshot = await getDocs(collection(db, "products"));
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const bannerSnapshot = await getDocs(collection(db, "banners"));

        setTotalUsers(userSnapshot.size);
        setTotalProducts(productSnapshot.size);
        setTotalOrders(ordersSnapshot.size);
        setBanners(bannerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        let total = 0;
        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          const isOnlinePaid = data.paymentMethod !== "cod" && data.paymentStatus === "paid";
          const isCodDelivered = data.paymentMethod === "cod" && data.status?.toLowerCase() === "delivered";

          if (isOnlinePaid || isCodDelivered) {
            total += Number(data.total) || 0;
          }
        });
        setTotalSales(total);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [firebase]);

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-lg border border-gray-200 max-w-sm w-full">
        <p className="text-sm text-gray-800 mb-2">Are you sure you want to delete this banner?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                await deleteDoc(doc(db, "banners", id));
                setBanners(prev => prev.filter(b => b.id !== id));
                toast.dismiss(t.id);
                toast.success("Banner deleted successfully!");
              } catch (error) {
                toast.dismiss(t.id);
                toast.error("Failed to delete banner.");
              }
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="p-4 font-bold text-gray-700 text-lg">Dashboard Overview</h2>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <h2 className="font-semibold text-gray-700 text-lg">Total Users</h2>
              <p className="mt-2 text-2xl font-bold text-green-600">{totalUsers}</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <h2 className="font-semibold text-gray-700 text-lg">Total Products</h2>
              <p className="mt-2 text-2xl font-bold text-blue-600">{totalProducts}</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <h2 className="font-semibold text-gray-700 text-lg">Total Orders</h2>
              <p className="mt-2 text-2xl font-bold text-orange-600">{totalOrders}</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <h2 className="font-semibold text-gray-700 text-lg">Total Sales</h2>
              <p className="mt-2 text-2xl font-bold text-purple-600">
                ₹{totalSales.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mt-12 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Hero Section Banners</h1>
          <button
            onClick={() => navigate("/admin/hero-section/upload")}
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            + Add Banner
          </button>
        </div>

        {banners.length === 0 ? (
          <p className="text-gray-500">No banners uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="border rounded-lg overflow-hidden shadow-sm relative group"
              >
                <img
                  src={banner.bannerImage}
                  alt="Banner"
                  className="w-full h-52 object-cover"
                />
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
