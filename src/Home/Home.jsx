import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSearchResults, setFilteredSearchResults] = useState([]);
  const itemsPerPage = 20;
  const [filterCriteria, setFilterCriteria] = useState({
    rating: null,
    price: null,
  });

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/Product/getAll`);
      setProductList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const uniqueProducts = productList.reduce((acc, product) => {
    const uniqueKey = `${product.name}-${product.categoryName}-${product.subCategoryName}-${product.subsubCategoryName}`;
    if (!acc.some((item) => item.uniqueKey === uniqueKey)) {
      acc.push({ ...product, uniqueKey });
    }
    return acc;
  }, []);

  const groupedProducts = uniqueProducts.reduce((acc, product) => {
    const { categoryName, subCategoryName, subsubCategoryName } = product;

    if (!acc[categoryName]) acc[categoryName] = {};
    if (!acc[categoryName][subCategoryName])
      acc[categoryName][subCategoryName] = {};
    if (!acc[categoryName][subCategoryName][subsubCategoryName]) {
      acc[categoryName][subCategoryName][subsubCategoryName] = [];
    }
    acc[categoryName][subCategoryName][subsubCategoryName].push(product);

    return acc;
  }, {});

  const handleFilterChange = (criteria, value) => {
    setFilterCriteria((prevCriteria) => ({
      ...prevCriteria,
      [criteria]: value === prevCriteria[criteria] ? null : value,
    }));
    setCurrentPage(1);
  };

  const filteredProducts = () => {
    let products = uniqueProducts;

    if (selectedCategory !== "All") {
      products = products.filter((product) => {
        return (
          product.categoryName === selectedCategory &&
          (!selectedSubCategory ||
            product.subCategoryName === selectedSubCategory) &&
          (!selectedSubSubCategory ||
            product.subsubCategoryName === selectedSubSubCategory)
        );
      });
    }

    const { minRating, maxRating } = filterCriteria;
    if (minRating || maxRating) {
      products = products.filter(
        (product) =>
          (!minRating || product.averageRating >= minRating) &&
          (!maxRating || product.averageRating <= maxRating)
      );
    }

    const { minPrice, maxPrice } = filterCriteria;
    if (minPrice || maxPrice) {
      products = products.filter(
        (product) =>
          (!minPrice || product.price >= minPrice) &&
          (!maxPrice || product.price <= maxPrice)
      );
    }

    return products;
  };

  const totalPages = Math.ceil(filteredProducts().length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts().slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setSelectedSubSubCategory(null);
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedSubSubCategory(null);
    setCurrentPage(1);
  };

  const handleSubSubCategoryChange = (subSubCategory) => {
    setSelectedSubSubCategory(subSubCategory);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredSearchResults([]);
      return;
    }

    const results = uniqueProducts.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredSearchResults([]);
  };

  const handleRatingRangeChange = (key, value) => {
    setFilterCriteria((prevCriteria) => {
      const updatedCriteria = { ...prevCriteria, [key]: value };

      // Ensure minRating is less than or equal to maxRating
      if (key === "minRating" && value > (updatedCriteria.maxRating || 0)) {
        updatedCriteria.maxRating = value; // Update maxRating if minRating > maxRating
      }
      if (key === "maxRating" && value < (updatedCriteria.minRating || 0)) {
        updatedCriteria.minRating = value; // Update minRating if maxRating < minRating
      }

      return updatedCriteria;
    });
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (key, value) => {
    setFilterCriteria((prevCriteria) => {
      const updatedCriteria = { ...prevCriteria, [key]: value };

      // Ensure minPrice is less than or equal to maxPrice
      if (key === "minPrice" && value > (updatedCriteria.maxPrice || 0)) {
        updatedCriteria.maxPrice = value; // Update maxPrice if minPrice > maxPrice
      }
      if (key === "maxPrice" && value < (updatedCriteria.minPrice || 0)) {
        updatedCriteria.minPrice = value; // Update minPrice if maxPrice < minPrice
      }

      return updatedCriteria;
    });
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="bg-white px-8 py-4 flex justify-center relative border-b">
        <div className="relative w-1/2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for cakes, flavors..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
          {filteredSearchResults.length > 0 && (
            <ul className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg z-10 max-h-60 overflow-y-auto">
              {filteredSearchResults.map((product) => (
                <li
                  key={product.productID}
                  onClick={() =>
                    (window.location.href = `/product/${product.productID}`)
                  }
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-4"
                >
                  <div className="image-container">
                    <img
                      src={`/images/${product.productImage}`}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md scalable"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-black">{product.name}</p>
                    <p className="text-gray-500 text-sm">
                      {product.price.toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="bg-white px-8 py-4 flex justify-center space-x-2 border-b">
        <button
          onClick={() => handleCategoryChange("All")}
          className={`px-4 py-2 rounded-full font-semibold ${
            selectedCategory === "All"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        {Object.keys(groupedProducts).map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full font-semibold ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {selectedCategory !== "All" && (
        <div className="bg-gray-100 px-8 py-3 flex justify-center space-x-2 border-b">
          {Object.keys(groupedProducts[selectedCategory] || {}).map(
            (subCategory) => (
              <button
                key={subCategory}
                onClick={() => handleSubCategoryChange(subCategory)}
                className={`px-3 py-1 rounded-full font-semibold ${
                  selectedSubCategory === subCategory
                    ? "bg-blue-400 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {subCategory}
              </button>
            )
          )}
        </div>
      )}

      {selectedSubCategory && (
        <div className="bg-gray-200 px-8 py-2 flex justify-center space-x-2 border-b">
          {Object.keys(
            groupedProducts[selectedCategory][selectedSubCategory] || {}
          ).map((subSubCategory) => (
            <button
              key={subSubCategory}
              onClick={() => handleSubSubCategoryChange(subSubCategory)}
              className={`px-2 py-1 rounded-full font-semibold ${
                selectedSubSubCategory === subSubCategory
                  ? "bg-blue-300 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {subSubCategory}
            </button>
          ))}
        </div>
      )}
      <div className="ml-10 mb-3">
        <p className="font-semibold mb-2 text-xl mt-3">
          Filter by Rating Range:
        </p>
        <div className="flex space-x-4 items-center">
          <div>
            <label htmlFor="minRating" className="block mb-1 text-gray-700">
              Min Rating
            </label>
            <select
              id="minRating"
              value={filterCriteria.minRating || ""}
              onChange={(e) =>
                handleRatingRangeChange("minRating", Number(e.target.value))
              }
              className="p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Stars
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="maxRating" className="block mb-1 text-gray-700">
              Max Rating
            </label>
            <select
              id="maxRating"
              value={filterCriteria.maxRating || ""}
              onChange={(e) =>
                handleRatingRangeChange("maxRating", Number(e.target.value))
              }
              className="p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Stars
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="ml-10 mb-3">
        <p className="font-semibold mb-2 text-xl">Filter by Price Range:</p>
        <div className="flex space-x-4 items-center">
          <div>
            <label htmlFor="minPrice" className="block mb-1 text-gray-700">
              Min Price
            </label>
            <select
              id="minPrice"
              value={filterCriteria.minPrice || ""}
              onChange={(e) =>
                handlePriceRangeChange("minPrice", Number(e.target.value))
              }
              className="p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              {[0, 100000, 200000, 300000, 400000, 500000, 1000000].map(
                (price) => (
                  <option key={price} value={price}>
                    {price.toLocaleString("vi-VN")} VND
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label htmlFor="maxPrice" className="block mb-1 text-gray-700">
              Max Price
            </label>
            <select
              id="maxPrice"
              value={filterCriteria.maxPrice || ""}
              onChange={(e) =>
                handlePriceRangeChange("maxPrice", Number(e.target.value))
              }
              className="p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              {[100000, 200000, 300000, 400000, 500000, 1000000, 2000000].map(
                (price) => (
                  <option key={price} value={price}>
                    {price.toLocaleString("vi-VN")} VND
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      <section className="px-8 py-12 bg-white">
        <h2 className="text-2xl font-bold mb-6">More To Buy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((product) => (
            <Link
              to={`/product/${product.productID}`}
              style={{ textDecoration: "none", color: "black" }}
              state={{ userId: 1 }}
              key={product.productID}
              className="flex flex-col items-center w-full h-full p-2"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full h-full flex flex-col">
                <img
                  src={`/images/${product.productImage}`} // Correctly formatted like your old code
                  alt={product.name}
                  className="w-full h-48 object-cover scalable"
                />
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 overflow-hidden">
                    {product.name}
                  </h3>
                  <p className="text-gray-700 font-medium mb-1">
                    {product.price.toLocaleString("vi-VN")} VND
                  </p>
                  <div className="flex items-center">
                    <p className="text-yellow-500 text-sm mr-1">
                      {"★".repeat(Math.round(product.averageRating || 0))}
                      {"☆".repeat(5 - Math.round(product.averageRating || 0))}
                    </p>
                    <span className="text-gray-500 text-xs">
                      ({product.averageRating?.toFixed(1) || "0.0"})
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-2 px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
