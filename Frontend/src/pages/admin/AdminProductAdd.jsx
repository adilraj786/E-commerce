import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/context/FirebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const categoryData = {
  Clothes: {
    Men: ["Topwear", "Bottomwear", "Winterwear"],
    Women: ["Topwear", "Bottomwear", "Winterwear"],
    Kids: ["Topwear", "Bottomwear", "Winterwear"],
  },
  Accessories: {
    Men: [],
    Women: [],
    Kids: [],
  },
  Footwear: {
    Men: ["Formal", "Casual", "Sports"],
    Women: ["Heels", "Flats", "Sneakers"],
    Kids: ["School", "Casual"],
  },
};

// ✅ Updated size options with Kids included
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

const AdminProductAdd = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("Clothes");
  const [subCategory, setSubCategory] = useState("Men");
  const [type, setType] = useState("Topwear");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [size, setSize] = useState([]);
  const [reviews, setReviews] = useState("");
  const [rating, setRating] = useState("");
  const [newArrivals, setNewArrivals] = useState(false);
  const [featureProduct, setFeatureProduct] = useState(false);
  const [topselling, setTopSelling] = useState(false);
  const [show] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Stores-Images");

    try {
      const response = await axios.post(
        "use_your_cloudinary_upload_location_to_upload_the_images",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error", error);
      return null;
    }
  };

  const handleSizeToggle = (sz) => {
    setSize((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrls = await Promise.all(
        images.map((img) => (img ? handleImageUpload(img) : null))
      );

      await addDoc(collection(db, "products"), {
        name,
        description,
        category: mainCategory,
        subCategory,
        type: type || null,
        price: parseFloat(price),
        brand,
        stock: parseInt(stock),
        size,
        reviews: parseInt(reviews),
        rating: parseFloat(rating),
        newArrivals,
        featureProduct,
        topselling,
        images: imageUrls.filter(Boolean),
        show,
        createdAt: serverTimestamp(),
      });

      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to add product.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-start gap-4 p-5 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate("/admin/products")}
        className="flex items-center gap-2 cursor-pointer font-semibold"
      >
        <ArrowLeft size={20} /> Back to Products
      </button>

      <h2 className="text-2xl font-semibold mt-2">Add Product</h2>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-4"
      >
        {/* Image Upload */}
        <div>
          <p className="mb-2 font-semibold">Upload Images</p>
          <div className="flex gap-3">
            {images.map((image, index) => (
              <label
                key={index}
                className="cursor-pointer border border-gray-300 p-2 rounded-lg hover:border-gray-500 transition"
              >
                <img
                  className="w-24 h-24 object-cover rounded-lg"
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : "https://placehold.co/150"
                  }
                  alt="Product"
                />
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = e.target.files[0];
                    setImages(newImages);
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Name & Description */}
        <div className="w-full">
          <label className="font-semibold">Product Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="w-full">
          <label className="block mb-2 text-sm font-semibold">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 resize-none px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Category Selection */}
        <div className="flex flex-wrap gap-4 w-full">
          {/* Main Category */}
          <div className="w-full sm:w-1/4">
            <label className="font-semibold">Main Category</label>
            <select
              value={mainCategory}
              onChange={(e) => {
                const selectedMain = e.target.value;
                setMainCategory(selectedMain);
                const firstSub = Object.keys(categoryData[selectedMain])[0];
                setSubCategory(firstSub);
                const types = categoryData[selectedMain][firstSub];
                setType(types.length ? types[0] : "");
                setSize([]);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {Object.keys(categoryData).map((mainCat) => (
                <option key={mainCat} value={mainCat}>
                  {mainCat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="w-full sm:w-1/4">
            <label className="font-semibold">Subcategory</label>
            <select
              value={subCategory}
              onChange={(e) => {
                const selectedSub = e.target.value;
                setSubCategory(selectedSub);
                const types = categoryData[mainCategory][selectedSub];
                setType(types.length ? types[0] : "");
                setSize([]);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {Object.keys(categoryData[mainCategory]).map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>

          {/* Type (conditionally visible) */}
          {categoryData[mainCategory][subCategory]?.length > 0 && (
            <div className="w-full sm:w-1/4">
              <label className="font-semibold">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {categoryData[mainCategory][subCategory].map((typeItem) => (
                  <option key={typeItem} value={typeItem}>
                    {typeItem}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ✅ Sizes (Dynamic for Men/Women/Kids) */}
        {sizeOptions[mainCategory]?.[subCategory]?.length > 0 && (
          <div className="w-full">
            <label className="font-semibold block mb-2">Available Sizes</label>
            <div className="flex gap-3 flex-wrap">
              {sizeOptions[mainCategory][subCategory].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleSizeToggle(sz)}
                  className={`px-4 py-1 border rounded-full ${
                    size.includes(sz)
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Brand */}
        <div className="w-full gap-3 flex">
          <div>
            <label className="font-semibold">Price</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              type="number"
              required
            />
          </div>
          <div>
            <label className="font-semibold">Brand</label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Stock, Reviews, Rating */}
        <div className="flex w-full gap-4">
          <div className="w-1/3">
            <label className="font-semibold">Stock</label>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="w-1/3">
            <label className="font-semibold">Reviews</label>
            <input
              value={reviews}
              onChange={(e) => setReviews(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="w-1/3">
            <label className="font-semibold">Rating</label>
            <input
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Flags */}
        <div className="flex items-center gap-4 mt-2">
          {[
            { label: "New Arrivals", value: newArrivals, setter: setNewArrivals },
            { label: "Feature Product", value: featureProduct, setter: setFeatureProduct },
            { label: "Top Selling", value: topselling, setter: setTopSelling },
          ].map(({ label, value, setter }, i) => (
            <div key={i} className="border border-gray-300 p-3 rounded-lg">
              <label className="cursor-pointer font-semibold">{label}</label>
              <input
                type="checkbox"
                checked={value}
                onChange={() => setter((prev) => !prev)}
                className="ml-3 w-3 h-3 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin bg-primary"></div>
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminProductAdd;
