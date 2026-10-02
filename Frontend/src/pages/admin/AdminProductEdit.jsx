import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Size options for each category & subcategory
  const sizeOptions = {
    Clothes: {
      Men: ["XS", "S", "M", "L", "XL", "XXL"],
      Women: ["XS", "S", "M", "L", "XL"],
      Kids: ["1Y", "2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "9Y", "10Y"],
    },
    Footwear: {
      Men: ["6", "7", "8", "9", "10", "11", "12"],
      Women: ["4", "5", "6", "7", "8", "9"],
      Kids: ["1", "2", "3", "4", "5"],
    },
    Accessories: {
      Men: [],
      Women: [],
      Kids: [],
    },
  };

  // ✅ Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({ ...data, sizes: data.sizes || [] });
          setImages(data.images || []);
        } else {
          toast.error("Product not found");
          navigate("/admin/products");
        }
      } catch (error) {
        toast.error("Error fetching product");
        console.error(error);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  // ✅ Handle Cloudinary upload
  const handleImageUpload = async (file) => {
    if (!file) return null;
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "Stores-Images");

    try {
      const res = await axios.post(
        "use_your_cloudinary_upload_location_to_upload_the_images",
        uploadData
      );
      return res.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };

  // ✅ Handle input field change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  // ✅ Toggle size selection
  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const sizes = prev.sizes || [];
      return sizes.includes(size)
        ? { ...prev, sizes: sizes.filter((s) => s !== size) }
        : { ...prev, sizes: [...sizes, size] };
    });
  };

  // ✅ Handle image change
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const handleAddImageSlot = () => setImages((prev) => [...prev, null]);

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (typeof img === "string") return img;
          if (img instanceof File) return await handleImageUpload(img);
          return null;
        })
      );

      const updatedDoc = {
        ...formData,
        images: uploadedImages.filter(Boolean),
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(db, "products", productId);
      await updateDoc(docRef, updatedDoc);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Error updating product");
      console.error(err);
    }

    setLoading(false);
  };

  if (!formData)
    return <p className="p-5 text-center text-gray-600">Loading...</p>;

  // ✅ Determine available sizes dynamically
  const availableSizes =
    sizeOptions[formData.subCategory?.includes("Footwear") ? "Footwear" : "Clothes"]?.[
      formData.category
    ] || [];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-primary border-b pb-2">
        Edit Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <div className="flex flex-wrap gap-4">
            {images.map((img, idx) => (
              <label key={idx} className="relative cursor-pointer">
                <img
                  src={
                    typeof img === "string"
                      ? img
                      : img
                      ? URL.createObjectURL(img)
                      : "https://placehold.co/150"
                  }
                  alt={`product-${idx}`}
                  className="w-24 h-24 object-cover rounded-md border shadow-sm"
                />
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleImageChange(e, idx)}
                />
              </label>
            ))}
            <button
              type="button"
              onClick={handleAddImageSlot}
              className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-md text-sm text-gray-500 hover:border-primary hover:text-primary transition"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Main Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "name", placeholder: "Product Name", required: true },
            { name: "brand", placeholder: "Brand" },
            { name: "price", placeholder: "Price", type: "number" },
            { name: "stock", placeholder: "Stock" },
            { name: "reviews", placeholder: "Reviews" },
            { name: "rating", placeholder: "Rating" },
          ].map(({ name, placeholder, type, required }) => (
            <input
              key={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              type={type || "text"}
              placeholder={placeholder}
              required={required}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
            />
          ))}

          {/* Category + Subcategory + Type */}
          <div className="flex flex-wrap gap-4 w-full col-span-1 md:col-span-2">
            <div className="w-full sm:w-1/4">
              <label className="font-semibold">Category</label>
              <select
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div className="w-full sm:w-1/4">
              <label className="font-semibold">Sub Category</label>
              <select
                name="subCategory"
                value={formData.subCategory || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Sub Category</option>
                <option value="Clothes">Clothes</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* ✅ Added Type (same as AdminProductAdd) */}
            <div className="w-full sm:w-1/4">
              <label className="font-semibold">Type</label>
              <select
                name="type"
                value={formData.type || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Type</option>
                <option value="T-Shirt">T-Shirt</option>
                <option value="Shirt">Shirt</option>
                <option value="Jeans">Jeans</option>
                <option value="Shorts">Shorts</option>
                <option value="Sweater">Sweater</option>
                <option value="Jacket">Jacket</option>
                <option value="Dress">Dress</option>
                <option value="Skirt">Skirt</option>
                <option value="Kidswear">Kidswear</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Sizes */}
        {availableSizes.length > 0 && (
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Available Sizes
            </label>
            <div className="flex gap-2 flex-wrap">
              {availableSizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-1 border rounded-full transition ${
                    formData?.sizes?.includes(size)
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Product Description"
          rows={4}
          className="w-full px-4 py-2 border rounded-md resize-none focus:outline-primary"
        />

        {/* Checkboxes */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          {["New Arrivals", "Feature Product", "Top selling"].map((field) => (
            <label
              key={field}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <input
                type="checkbox"
                name={field}
                checked={formData[field] || false}
                onChange={handleInputChange}
                className="accent-primary"
              />
              {field}
            </label>
          ))}
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEdit;
