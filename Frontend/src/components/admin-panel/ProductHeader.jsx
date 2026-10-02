import React from "react";

const ProductHeader = () => {
  return (
    <div className="grid grid-cols-6 font-semibold border-b py-2 px-4 bg-gray-100">
      <span>Image</span>
      <span>Name</span>
      <span>Category</span>
      <span>Price</span>
      {/* <span>Action</span> */}
      <span>Show</span>
    </div>
  );
};

export default ProductHeader;
