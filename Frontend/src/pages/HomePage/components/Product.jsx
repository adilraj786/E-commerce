import { useFirebase } from "@/context/FirebaseContext";
import SingleProductCard from "@/pages/ProductPage/components/SingleProductCard";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const data = await firebase.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <p className="text-danger text-center">{error}</p>;

  const visibleProducts = products.filter((p) => p.show !== false);

  return (
    <div className="categories w-full px-4 md:px-8">
      {/* New Arrivals Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            New Arrivals
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {visibleProducts
              .filter((p) => p.newArrivals === true)
              .map((product) => (
                <SingleProductCard key={product.docId} product={product} />
              ))}
          </div>

          <div className="flex justify-center mt-6">
            <button className="px-6 bg-black text-white py-3 rounded-md cursor-pointer"
            onClick={() => navigate("/Allproduct")} // Navigate on click
            >
              View All
            </button>
          </div>
        </div>
      </section>

      {/* Feature Product Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Feature Product
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {visibleProducts
              .filter((p) => p.featureProduct === true)
              .map((product) => (
                <SingleProductCard key={product.docId} product={product} />
              ))}
          </div>

          <div className="flex justify-center mt-6">
            <button className="px-6 bg-black text-white py-3 rounded-md cursor-pointer"
            onClick={() => navigate("/Allproduct")} // Navigate on click
            >
              View All
            </button>
          </div>
        </div>
      </section>

      {/* Top Selling Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Top Selling
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {visibleProducts
              .filter((p) => p.topselling === true)
              .map((product) => (
                <SingleProductCard key={product.docId} product={product} />
              ))}
          </div>

          <div className="flex justify-center mt-6">
            <button className="px-6 bg-black text-white py-3 rounded-md cursor-pointer"
            onClick={() => navigate("/Allproduct")}>
              View All
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
