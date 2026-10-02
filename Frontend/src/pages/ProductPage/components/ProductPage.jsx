import React, { useState, useEffect } from "react";
import { useFirebase } from "@/context/FirebaseContext";
import SingleProductCard from "@/pages/ProductPage/components/SingleProductCard";
import { useLocation } from "react-router-dom";
import { ChevronDown, Filter } from "lucide-react";

const ProductPage = () => {
  const firebase = useFirebase();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    if (category) {
      setSelectedCategories([category]);
    }
  }, [location]);

  useEffect(() => {
    setLoading(true);
    firebase
      .getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategories.length) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    if (selectedBrands.length) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    if (sortOrder === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "name-asc") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortOrder === "name-desc") {
      filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategories, selectedBrands, sortOrder]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="flex w-full px-4 md:px-8 py-6 gap-8 flex-col lg:flex-row">
      {/* Sidebar Filters */}
      <aside
        className={`fixed top-0 left-0 w-3/4 max-w-xs h-full border-r z-40 p-6 transform transition-transform duration-300 ease-in-out lg:relative lg:w-64 lg:translate-x-0 ${
          filterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4 lg:hidden">
          <h3 className="text-lg font-bold">Filters</h3>
          <button
            onClick={() => setFilterOpen(false)}
            className="text-sm font-medium text-black"
          >
            Close
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-bold text-black mb-2 uppercase">
            Category
          </h4>
          {["Men", "Women", "Kids", "Accessories", "Footwear"].map(
            (category) => (
              <label
                key={category}
                className="block mb-2 text-sm text-gray-800"
              >
                <input
                  type="checkbox"
                  className="mr-2 accent-black"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            )
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold text-black mb-2 uppercase">Brand</h4>
          {["Nike", "Adidas", "Puma", "Zara", "H&M"].map((brand) => (
            <label key={brand} className="block mb-2 text-sm text-gray-800">
              <input
                type="checkbox"
                className="mr-2 accent-black"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </aside>

      {/* Product Section */}
      <main className="flex-1">
        {/* Top Bar with Sort + Filter Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-black">
            All Products{" "}
            <span className="text-sm text-gray-600 ml-2">
              ({filteredProducts.length} Products)
            </span>
          </h2>

          <div className="flex gap-4 items-center">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden px-4 py-2 border border-gray-300 rounded-md text-sm text-black flex items-center gap-2"
            >
              <Filter size={16} /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="border border-gray-300 px-4 py-2 rounded-md text-sm font-medium text-black flex items-center gap-2"
              >
                Sort by <ChevronDown className="w-4 h-4" />
              </button>
              {sortOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-20 text-sm font-medium text-black">
                  {[
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "name-asc", label: "Name: A to Z" },
                    { value: "name-desc", label: "Name: Z to A" },
                  ].map((option) => (
                    <li
                      key={option.value}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        sortOrder === option.value ? "bg-gray-100" : ""
                      }`}
                      onClick={() => {
                        setSortOrder(option.value);
                        setSortOpen(false);
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Loading...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No products found.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <SingleProductCard key={product.docId} product={product} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
