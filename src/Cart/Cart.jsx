import React, { useEffect } from "react";
import { useState } from "react";
import Header from "../components/Header";
import "../styles/cart.css";
import CartItem from "./CartItem";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const Cart = ({ setCartData }) => {
  //useState
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const [id, setId] = useState(1);
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [checkAll, setCheckAll] = useState(false);
  const [productList, setProductList] = useState([]);
  const [cart, setCart] = useState([]);
  const [fetchedProducts, setFetchedProducts] = useState(false);
  const [total, setTotal] = useState(0);
  //fetching

  const fetchCart = async () => {
    try {
      const responseCart = await axios.get(`/cart/${userId}`);
      console.log(responseCart.data);
      setCart(responseCart.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const productFetchPromises = cart.map((car) =>
        fetchProduct(car.productItemId)
      );
      const products = await Promise.all(productFetchPromises);

      const updatedProducts = products.flat().map((product) => ({
        ...product,
        selected: false,
      }));

      setProductList(updatedProducts);
      console.log(updatedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(`/productItem/${productId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const removeAll = async () => {
    productList.every((product) => removeCartItem(product.productItemId));
  };
  const removeCartItem = async (productItemId) => {
    let cartId = findCartItemIdByProductItemId(productItemId);
    try {
      const response = await axios.post(`/deleteCartItem`, { cartId });

      if (response.status === 200) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== cartId));
        console.log(cart);
      }
      setProductList((prevProducts) =>
        prevProducts.filter(
          (product) => product.productItemId !== productItemId
        )
      );

      getTotal();

      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  //useEffect
  useEffect(() => {
    if (userId && !fetchedProducts) {
      fetchCart();
    } else if (userId === null) {
      navigate("/login");
    }
  }, [userId]);

  useEffect(() => {
    if (cart.length > 0 && fetchedProducts === false) {
      fetchAllProducts();
      setFetchedProducts(true);
    }
  }, [cart, fetchedProducts]);

  useEffect(() => {
    getTotal();
  }, [productList, cart]);

  //function
  const getTotal = () => {
    let sum = 0;

    productList.forEach((product) => {
      if (product.selected === true) {
        const discountedPrice = product.price * (1 - product.discount / 100);
        sum += discountedPrice * getQuantity(product.productItemId);
      }
    });

    setTotal(sum);
  };

  const handleProductChange = (id) => {
    const updatedProducts = productList.map((product) =>
      product.productItemId === id
        ? { ...product, selected: !product.selected }
        : product
    );
    setProductList(updatedProducts);

    const allSelected = updatedProducts.every((product) => product.selected);
    setCheckAll(allSelected);
  };

  const handleCheckAllChange = () => {
    const newCheckAll = !checkAll;
    const updatedProducts = productList.map((product) => ({
      ...product,
      selected: newCheckAll,
    }));
    setProductList(updatedProducts);
    setCheckAll(newCheckAll);
  };

  const getQuantity = (id) => {
    const item = cart.find((car) => car.productItemId === id);
    return item ? item.qty : null;
  };

  const handleInputChange = (id, event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, "");

    if (newValue === "") {
      setCart((prevCart) =>
        prevCart.map((product) =>
          product.productItemId === id ? { ...product, qty: "" } : product
        )
      );
    } else {
      const newQuantity = parseInt(newValue, 5);
      const stockQuantity = checkQtyInStock(id);

      if (newQuantity <= stockQuantity) {
        setCart((prevCart) =>
          prevCart.map((product) =>
            product.productItemId === id
              ? { ...product, qty: newQuantity }
              : product
          )
        );
      } else {
        alert(
          `Quantity exceeds available stock (${stockQuantity} items available)`
        );
      }
    }
  };

  const handleBlur = (id) => {
    setCart((prevCart) =>
      prevCart.map((product) =>
        product.productItemId === id &&
        (product.qty === "" || product.qty === 0)
          ? { ...product, qty: 1 }
          : product
      )
    );
  };

  const findCartItemIdByProductItemId = (productItemId) => {
    const cartItem = cart.find(
      (cartItem) => cartItem.productItemId === productItemId
    );
    console.log(cartItem.id);
    return cartItem ? cartItem.id : null;
  };
  const checkQtyInStock = (id) => {
    const product = productList.find((product) => product.productItemId === id);

    if (product) {
      return product.quantityStock;
    } else {
      console.log("Product not found in stock.");
      return null;
    }
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((car) =>
      car.productItemId === id && car.qty + 1 <= checkQtyInStock(id)
        ? { ...car, qty: car.qty + 1 }
        : car
    );

    setCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const itemToDecrease = cart.find((car) => car.productItemId === id);

    if (itemToDecrease && itemToDecrease.qty === 1) {
      const confirmRemoval = window.confirm(
        "Do you want to remove this item from the cart?"
      );
      if (confirmRemoval) {
        removeCartItem(itemToDecrease.productItemId);
      }
    } else {
      const updatedCart = cart.map((car) =>
        car.productItemId === id ? { ...car, qty: car.qty - 1 } : car
      );
      setCart(updatedCart);
    }
  };

  const passCart = () => {
    const quantityMap = new Map();
    cart.forEach((cartItem) => {
      quantityMap.set(cartItem.productItemId, cartItem.qty);
    });

    localStorage.removeItem("cart");
    localStorage.setItem(
      "cart",
      JSON.stringify(
        productList
          .filter((product) => product.selected === true)
          .map((product) => ({
            ...product,
            quantity: quantityMap.get(product.productItemId) || 1,
          }))
      )
    );
    console.log(localStorage.getItem("cart"));
  };

  return (
    <>
      <div className="">
        {productList.length > 0 ? (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left rtl:text-right mt-12 py-5">
              <thead class="text-xs b">
                <tr>
                  <th scope="col" class="px-16 py-3 text-center">
                    Product
                  </th>
                  <th scope="col" class="px-16 py-3 text-center">
                    Quantity
                  </th>
                  <th scope="col" class="px-6 py-3 text-center">
                    Price
                  </th>
                  <th scope="col" class="px-6 py-3 text-center">
                    Total
                  </th>
                  <th scope="col" class="px-6 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {productList.map((product) => (
                  <tr key={product.productItemId} class="bg-white">
                    <td class="px-16 py-4 font-semibold text-center text-gray-900 dark:text-black">
                      <input
                        type="checkbox"
                        className="checkbox absolute"
                        checked={product.selected}
                        onClick={() =>
                          handleProductChange(product.productItemId)
                        }
                      />
                      {product.name}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-content-center">
                        <button
                          class="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                          type="button"
                          onClick={() => decreaseQty(product.productItemId)}
                        >
                          <span class="sr-only">Quantity button</span>
                          <svg
                            class="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2"
                          >
                            <path stroke="currentColor" d="M1 1h16" />
                          </svg>
                        </button>
                        <div>
                          <input
                            type="number"
                            id="first_product"
                            class="bg-gray-50 text-center w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder=""
                            value={getQuantity(product.productItemId) ?? ""}
                            onChange={(event) =>
                              handleInputChange(product.productItemId, event)
                            }
                            onBlur={() => handleBlur(product.productItemId)}
                            required
                          />
                        </div>
                        <button
                          class="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                          type="button"
                          onClick={() => increaseQty(product.productItemId)}
                        >
                          <span class="sr-only">Quantity button</span>
                          <svg
                            class="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path stroke="currentColor" d="M9 1v16M1 9h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-red-400 text-center">
                      {(
                        product.price -
                        product.price * (product.discount / 100)
                      ).toLocaleString("vi-VN")}{" "}
                      VND
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-black text-center">
                      {(
                        getQuantity(product.productItemId) *
                        (product.price -
                          product.price * (product.discount / 100))
                      ).toLocaleString("vi-VN")}{" "}
                      VND
                    </td>
                    <td class="px-6 py-4 text-center">
                      <button
                        type="button"
                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
                        onClick={() => removeCartItem(product.productItemId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between py-4 px-16 bg-slate-50">
              <div className="flex items-center mb-2 px-4">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  value=""
                  checked={checkAll}
                  onChange={handleCheckAllChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="default-checkbox"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Check All
                </label>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mb-1 px-4">
                  <button
                    type="button"
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
                    onClick={() => removeAll()}
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center mb-2 px-4">
                  <h3>Subtotal: {total.toLocaleString("vi-VN")} VND</h3>
                </div>
                <div className="flex items-center mb-1 px-4">
                  <button
                    type="button"
                    className="text-white bg-orange-500 hover:bg-orange-700/80 focus:ring-4 focus:outline-none focus:ring-[#]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-orange-700/40 dark:focus:ring-gray-600 me-2 mb-2"
                    onClick={() => {
                      const checkCartSelected = productList.some(
                        (product) => product.selected === true
                      );
                      if (checkCartSelected) {
                        passCart();
                        navigate("/checkout");
                      } else {
                        alert("Please select at least one item!");
                      }
                    }}
                  >
                    Check out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Your cart is empty.
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
