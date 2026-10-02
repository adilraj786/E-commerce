import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search } from "lucide-react";
import { useFirebase } from "@/context/FirebaseContext";
import ProductHeader from "@/components/admin-panel/ProductHeader";
import ProductItem from "@/components/admin-panel/ProductItem";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/context/FirebaseConfig";

export default function AdminProduct() {
  const navigate = useNavigate();
  const firebase = useFirebase();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await firebase.getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, [firebase]);

  const handleDelete = async (productId) => {
    await firebase.deleteProduct(productId);
    setProducts((prev) => prev.filter((p) => p.docId !== productId));
  };

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const toggleProductVisibility = async (productId, currentVisibility) => {
    try {
      const docRef = doc(db, "products", productId);
      await updateDoc(docRef, { show: !currentVisibility });

      setProducts((prev) =>
        prev.map((p) =>
          p.docId === productId ? { ...p, show: !currentVisibility } : p
        )
      );
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-500"
            size={18}
          />
        </div>

        <button
          className="px-4 py-2 flex items-center gap-2 bg-black text-white rounded-lg transition"
          onClick={() => navigate("/admin/products/add")}
        >
          <Package size={20} /> + Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="bg-white shadow-md p-4">
        <ProductHeader />
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductItem
              key={product.docId}
              product={product}
              onEdit={() => handleEdit(product.docId)}
              onDelete={() => handleDelete(product.docId)}
              onToggleVisibility={() =>
                toggleProductVisibility(product.docId, product.show)
              }
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
