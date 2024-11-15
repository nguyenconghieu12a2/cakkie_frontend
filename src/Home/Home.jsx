import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
  const itemsPerPage = 20;

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/Product/getAll`);
      setProductList(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
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

  const filteredProducts = () => {
    if (selectedCategory === "All") return uniqueProducts;

    return uniqueProducts.filter((product) => {
      return (
        product.categoryName === selectedCategory &&
        (!selectedSubCategory ||
          product.subCategoryName === selectedSubCategory) &&
        (!selectedSubSubCategory ||
          product.subsubCategoryName === selectedSubSubCategory)
      );
    });
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

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
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
                  src={`./${product.productImage}.jpg`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
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
                      {"★".repeat(product.productRating)}
                      {"☆".repeat(5 - product.productRating)}
                    </p>
                    <span className="text-gray-500 text-xs">
                      ({product.productRating})
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {/* <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-2 px-4 py-2 rounded-lg bg-gray-300 disabled:bg-gray-200"
          >
            Previous
          </button> */}
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
          {/* <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-2 px-4 py-2 rounded-lg bg-gray-300 disabled:bg-gray-200"
          >
            Next
          </button> */}
        </div>
      </section>
    </div>
  );
}

export default Home;
