import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const SingleProductCard = ({ product }) => {
  return (
    <div className="w-full max-w-xs bg-white rounded-xl shadow-md overflow-hidden border">
      <Link to={`/product/${product.docId}`}>
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-[320px] object-cover"
        />

        <div className="p-4">
          <h3 className="text-md font-bold text-gray-900 mb-1">
            {product.name}
          </h3>

          <div className="text-sm text-gray-500 flex justify-between mb-1">
            <span>{product.category}</span>
            <span>{product.brand}</span>
          </div>

          <p className="text-lg font-semibold text-black mb-2">
            ₹{product.price}
          </p>

          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill="currentColor"
                stroke="none"
                className={i < (product.rating || 0) ? "" : "opacity-50"}
              />
            ))}
          </div>

          <p className="text-sm text-gray-600 mb-3">
            {product.reviews} reviews
          </p>
        </div>
      </Link>
    </div>
  );
};

export default SingleProductCard;
