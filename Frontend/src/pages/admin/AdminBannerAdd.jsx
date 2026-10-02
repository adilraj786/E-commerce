import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/context/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const AdminBannerAdd = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Stores-Images");

    try {
      const response = await axios.post(
        `use_your_cloudinary_upload_location_to_upload_the_images`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error", error);
      return null;
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload(image);
      if (!imageUrl) throw new Error("Image upload failed");

      await addDoc(collection(db, "banners"), {
        bannerImage: imageUrl,
        createdAt: new Date(),
      });

      toast.success("Banner uploaded successfully!");
      navigate("/admin/hero-section");
    } catch (error) {
      toast.error("Upload failed.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate("/admin/hero-section")}
          className="flex items-center text-sm font-medium text-gray-700 hover:underline"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Banners
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Upload New Banner
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden w-full h-52 bg-gray-100 flex justify-center items-center">
              <label className="cursor-pointer w-full h-full flex justify-center items-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-500 text-lg font-medium">
                    Click to upload or drop image
                  </span>
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-lg transition duration-150 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Upload Banner"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBannerAdd;
