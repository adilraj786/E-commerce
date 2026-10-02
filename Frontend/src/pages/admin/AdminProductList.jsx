// import React, { useEffect, useState } from "react";
// import { useFirebase } from "@/context/FirebaseContext";
// import AdminProductCard from "@/components/admin-panel/AdminProductCard";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const AdminProductList = () => {
//   const firebase = useFirebase();
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const data = await firebase.getProducts();
//       setProducts(data);
//     };

//     fetchProducts();
//   }, [firebase]);

//   const handleEdit = (productId) => {
//     // Navigate to edit page with productId
//     navigate(`/admin/products/edit/${productId}`);
//   };

//   const handleDelete = async (productId) => {
//     toast(
//       ({ closeToast }) => (
//         <div className="flex flex-col gap-2 p-4 bg-white/30 backdrop-blur-lg rounded-xl shadow-lg">
//           <p className="text-sm font-medium text-gray-800">
//             Are you sure you want to delete this product?
//           </p>
//           <div className="flex justify-end gap-2 mt-2">
//             <button
//               onClick={async () => {
//                 await firebase.deleteProduct(productId);
//                 setProducts((prevProducts) =>
//                   prevProducts.filter((p) => p.docId !== productId)
//                 );
//                 toast.success("Product deleted successfully!");
//                 closeToast();
//               }}
//               className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
//             >
//               Yes, Delete
//             </button>
//             <button
//               onClick={closeToast}
//               className="bg-gray-300 text-black px-3 py-1 rounded-lg hover:bg-gray-400 transition"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       ),
//       { autoClose: false, closeOnClick: false }
//     );
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <AdminProductCard
//               key={product.docId}
//               product={product}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//               removeProduct={handleDelete}
//             />
//           ))
//         ) : (
//           <p className="text-center text-gray-600 col-span-full">
//             No products found.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminProductList;
