import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const AdminProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg p-4 shadow-lg flex flex-col justify-between">
      <Link to={`product/${product.docId}`} className="block">
        <img
          src={product.images}
          alt={product.name}
          className="w-full h-52 object-cover rounded-md"
        />
        <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
        <p className="text-gray-600">{product.brand}</p>
        <p className="text-gray-800 mt-2">₹{product.price}</p>
      </Link>

      {/* Edit & Delete buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
          onClick={() => onEdit(product.docId)}
        >
          <Pencil size={16} /> Edit
        </button>
        <button
          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
          onClick={() => onDelete(product.docId)}
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard;
