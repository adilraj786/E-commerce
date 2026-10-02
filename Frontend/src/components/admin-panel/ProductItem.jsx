import React from "react";
import { Edit, Trash2 } from "lucide-react";

const ProductItem = ({ product, onEdit, onDelete, onToggleVisibility }) => {
  return (
    <div className="grid grid-cols-6 items-center border-b py-2 px-4">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <span>{product.name}</span>
      <span>{product.category}</span>
      <span>₹{product.price}</span>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1 cursor-pointer text-sm text-blue-500">
          <input
            type="checkbox"
            checked={product.show}
            onChange={onToggleVisibility}
          />
          {product.show ? "Visible" : "Hidden"}
        </label>

        <button
          onClick={onEdit}
          className="text-green-500 cursor-pointer hover:scale-110 transition"
        >
          <Edit size={16} />
        </button>

        <button
          onClick={onDelete}
          className="text-red-500 cursor-pointer hover:scale-110 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
