import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";
import { toast } from "react-hot-toast";

const AdminBannerList = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "banners"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
    setLoading(false);
  };

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

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Hero Section Banners</h1>
          <button
            onClick={() => navigate("/admin/hero-section/upload")}
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            + Add Banner
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading banners...</p>
        ) : banners.length === 0 ? (
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

export default AdminBannerList;
