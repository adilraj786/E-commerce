import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Star } from "lucide-react";
import { useFirebase } from "@/context/FirebaseContext";
import SingleProductCard from "@/pages/ProductPage/components/SingleProductCard";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";
import ReviewSection from "./ReviewSection";

const ProductDetails = () => {
  const { docId } = useParams();
  const { getProductById, getProducts, user } = useFirebase();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Could not load products.");
      }
    };
    fetchProducts();
  }, [getProducts]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(docId);
        setProduct(data);
        setMainImage(data?.images?.[0] || "/placeholder.jpg");
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Could not load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [docId, getProductById]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart.");
      return;
    }

    if (!product) return;

    const hasSizes = product.size?.length > 0;
    const category = product.category?.toLowerCase();
    const sizeRequired = hasSizes && category !== "accessories";

    if (sizeRequired && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const item = {
      id: product.docId || product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: mainImage,
      size: sizeRequired ? selectedSize : null,
      quantity: 1,
    };

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let existingCart = [];
      if (userSnap.exists()) {
        existingCart = userSnap.data().cart || [];
      }

      const existingItemIndex = existingCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          (cartItem.size || null) === (item.size || null)
      );

      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push(item);
      }

      await setDoc(userRef, { cart: existingCart }, { merge: true });
      toast.success("Added to cart successfully!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!product)
    return <p className="text-center text-red-500">Product not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Images */}
        <div className="w-full md:w-1/2 flex gap-4">
          <div className="flex flex-col gap-4">
            {product.images?.slice(0, 4).map((img) => (
              <img
                key={img}
                src={img}
                alt={`thumb-${img}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                  mainImage === img ? "border-black" : "border-gray-300"
                } hover:border-black`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="flex-1">
            <img
              src={mainImage}
              alt={product.name}
              className="w-[330px] h-[360px] mx-auto object-cover rounded-md"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-xl font-bold text-gray-700">{product.brand}</h1>
          <h2 className="text-3xl font-bold">{product.name}</h2>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill="currentColor"
                  stroke="none"
                  className={i < (product.rating || 0) ? "" : "opacity-50"}
                />
              ))}
            </div>
            <span className="text-gray-500">
              ({product.reviews || 0} reviews)
            </span>
          </div>

          <p className="text-3xl font-semibold mt-2">₹{product.price}</p>

          {/* Size Selector */}
          {product.size?.length > 0 &&
            product.category?.toLowerCase() !== "accessories" && (
              <div className="mt-4">
                <p className="font-medium">Select Size</p>
                <div className="flex gap-2 mt-2">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

          <button
            className="w-full bg-black text-white py-3 mt-4 rounded-md"
            onClick={handleAddToCart}
          >
            Add To Bag
          </button>
        </div>
      </div>

      <div className="mt-12 mb-4">
        <h1 className="text-2xl font-bold">Description</h1>
        <p>{product.description || "No description available."}</p>
      </div>
      <div className="mt-12">
        <ReviewSection productId={docId} />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 flex justify-center items-center">
          You may also like
        </h2>
        <Swiper spaceBetween={20} slidesPerView={4}>
          {products.map((item) => (
            <SwiperSlide key={item.id || item.docId}>
              <SingleProductCard product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductDetails;
