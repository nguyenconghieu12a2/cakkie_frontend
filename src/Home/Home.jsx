import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function Home() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Add state for selected category
  const itemsPerPage = 20;

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/Product/getAll`);
      setProductList(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    const uniqueProducts = [
      ...new Set(productList.map((product) => product.productID)),
    ].map((id) => {
      return productList.find((product) => product.productID === id);
    });

    setUniqueProducts(uniqueProducts);
    console.log(uniqueProducts);
  }, [productList]);

  const filteredProducts = uniqueProducts.filter((product) => {
    if (selectedCategory === "All") {
      return true;
    } else if (selectedCategory === "Cake") {
      return !["Basic Tools", "Other Tools", "Boxs", "Bags"].includes(
        product.categoryName
      );
    } else if (selectedCategory === "Tools") {
      return ["Basic Tools", "Other Tools"].includes(product.categoryName);
    } else if (selectedCategory === "Box") {
      return ["Boxs", "Bags"].includes(product.categoryName);
    } else {
      return product.categoryName === selectedCategory;
    }
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Calculate total pages based on filtered products
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex); // Display filtered products

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to page 1 when changing category
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header Title={"Home"} />

      {/* Category Bar */}
      <div className="bg-white px-8 py-4 flex justify-center">
        <button
          onClick={() => handleCategoryChange("All")}
          className={`mx-2 px-4 py-2 rounded-lg font-semibold ${
            selectedCategory === "All"
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleCategoryChange("Cake")}
          className={`mx-2 px-4 py-2 rounded-lg font-semibold ${
            selectedCategory === "Cake"
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          Cake
        </button>
        <button
          onClick={() => handleCategoryChange("Tools")}
          className={`mx-2 px-4 py-2 rounded-lg font-semibold ${
            selectedCategory === "Tools"
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          Basic Tools
        </button>

        <button
          onClick={() => handleCategoryChange("Box")}
          className={`mx-2 px-4 py-2 rounded-lg font-semibold ${
            selectedCategory === "Box"
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          Boxs
        </button>
      </div>

      <section className="px-8 py-12 bg-white">
        <h2 className="text-2xl font-bold mb-6">More To Buy</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((product) => (
            <Link
              to={`/product/${product.productID}`}
              style={{ textDecoration: "none", color: "black" }}
              state={{ userId: 1 }}
              key={product.productId}
            >
              <div className="bg-gray-300 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={`./${product.productImage}.jpg`}
                  alt={product.name}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-gray-700">
                    {product.price.toLocaleString("vi-VN")} VND
                  </p>
                  <p className="text-yellow-500">
                    {"★".repeat(product.productRating)}{" "}
                    {"☆".repeat(5 - product.productRating)}{" "}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-4 py-2 ${
                page === currentPage
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-700"
              } font-semibold rounded`}
            >
              {page}
            </button>
          ))}
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-200 text-center py-6">
        Footer
      </footer>
    </div>
  );
}

export default Home;
