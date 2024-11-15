import React, { useEffect, useState } from "react";
import "../styles/product.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
const Product = () => {
  const { productId } = useParams();
  const [id, setId] = useState(productId);
  const [spec, setSpec] = useState(false);
  const [couponId, setCouponId] = useState(1);
  const [content, setContent] = useState();
  const [toogle, setToogle] = useState(false);
  const [data, setData] = useState();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState([]);
  const [productList, setProductList] = useState([]);
  const [descriptionList, setDescriptionList] = useState([]);
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showOutStockPopup, setShowOutStockPopup] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [disabled, setDisibled] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCoupon();
    if (userId) {
      fetchCart();
    }
    if (productList.length > 0) {
      setSelectedSize(productList[0].size);
      const allProductsOutOfStock = productList.every((product) => {
        const productInCart = cart.find(
          (item) => item.productItemId === product.productItemId
        );
        return productInCart && productInCart.qty >= product.quantityStock;
      });

      if (allProductsOutOfStock) {
        setDisibled(true);
      }
    }
  }, []);

  const fetchCart = async () => {
    try {
      const responseCart = await axios.get(`/cart/${userId}`);
      console.log(responseCart.data);
      setCart(responseCart.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCoupon = async () => {
    try {
      const couponResponse = await axios.get(`/coupon/`);
      console.log(couponResponse);
      setCoupon(couponResponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/Product/${id}`);
      const { productList, descriptionList } = response.data;
      setProductList(productList);
      console.log(productList);
      setDescriptionList(descriptionList);
      console.log(descriptionList);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addProductToCart = async (productItemId) => {
    const selectedProduct = productList.find(
      (product) => product.productItemId === productItemId
    );

    if (!selectedProduct) {
      console.error("Selected product not found!");
      return null;
    }
    const data = {
      userId: userId,
      cartId: userId,
      productItemId: productList.find(
        (product) => product.productItemId === productItemId
      ).productItemId,
      quantity: quantity,
      note: note,
    };
    try {
      const response = await axios.post(`/addToCart`, data);

      if (response.status === 200) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/");
        }, 1500);
      }
      setProductList((prevProducts) =>
        prevProducts.filter(
          (product) => product.productItemId !== productItemId
        )
      );

      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const selectedDescription = () => {
    setContent(selectedProduct.description);
    setSpec(false);
    setToogle(!toogle);
    console.log(toogle, spec);
  };

  const selectedSpecification = () => {
    setSpec(!spec);
    setToogle(false);
  };

  const chooseSize = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  useEffect(() => {
    let initialSize = null;
    for (let i = 0; i < productList.length; i++) {
      const productInCart = cart.find(
        (item) => item.productItemId === productList[i].productItemId
      );

      if (!productInCart || productInCart.qty < productList[i].quantityStock) {
        initialSize = productList[i].size;
        break;
      }
    }

    if (initialSize) {
      chooseSize(initialSize);
    }
  }, [productList, cart]);

  const selectedProduct = productList.find(
    (product) => product.size === selectedSize
  );

  if (!selectedProduct) {
    return (
      <>
        <NotFound />
      </>
    );
  }
  const handleQuantityChange = (operation) => {
    setQuantity((prevQuantity) => {
      if (operation === "increment") {
        let productInCart = cart.find(
          (product) => product.productItemId === selectedProduct.productItemId
        );
        console.log(productInCart);
        const newQuantity = prevQuantity + 1;

        if (productInCart) {
          if (productInCart.qty + newQuantity > selectedProduct.quantityStock) {
            setShowOutStockPopup(true);
            return prevQuantity;
          } else {
            return newQuantity;
          }
        } else {
          if (newQuantity <= selectedProduct.quantityStock) {
            return newQuantity;
          } else {
            window.alert("Your order is the last item in shop!");
            return prevQuantity;
          }
        }
      } else {
        return Math.max(1, prevQuantity - 1);
      }
    });
  };

  const checkLogin = () => {
    console.log(userId);
    return userId === null;
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-page">
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-start justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <p className="text-green-600 font-semibold text-lg">
              Product added to cart!
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showOutStockPopup && (
        <div className="fixed inset-0 flex items-start justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <p className="text-green-600 font-semibold text-lg">
              You already have{" "}
              {
                cart.find(
                  (product) =>
                    product.productItemId === selectedProduct.productItemId
                ).qty
              }{" "}
              in your Cart. If you buy more, it exceed the stock in the shop.
            </p>
            <button
              onClick={() => setShowOutStockPopup(false)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="product-container">
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={`./${selectedProduct.productImage}.jpg`}
              alt="Main Product"
            />
          </div>
        </div>

        <div className="product-info">
          <h2>{selectedProduct.name}</h2>
          <div className="product-rating">
            <p className="text-yellow-500">
              {"★".repeat(productList[0].productRating)}{" "}
              {"☆".repeat(5 - productList[0].productRating)}{" "}
            </p>
          </div>

          <div className="product-sizes">
            <p>Size:</p>
            <div className="size-options">
              {productList.map((product) => {
                const productInCart = cart.find(
                  (item) => item.productItemId === product.productItemId
                );
                const isDisabled =
                  productInCart && productInCart.qty >= product.quantityStock;

                return (
                  <button
                    key={product}
                    className={`size-button ${
                      selectedSize === product.size && !isDisabled
                        ? "selected"
                        : ""
                    }
                    ${isDisabled ? "disabled" : ""}`}
                    onClick={() => chooseSize(product.size)}
                    disabled={isDisabled}
                  >
                    {product.size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="product-pricing">
            <p className="current-price">
              {" "}
              {(
                selectedProduct.price -
                selectedProduct.price * (selectedProduct.discount / 100)
              ).toLocaleString("vi-VN")}{" "}
              VND
            </p>
            <p className="old-price">
              {productList
                .find((product) => product.size === selectedSize)
                .price.toLocaleString("vi-VN")}{" "}
              VND
            </p>
          </div>

          <div className="quantity-control">
            <button onClick={() => handleQuantityChange("decrement")}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => handleQuantityChange("increment")}>+</button>
          </div>

          <div className="action-buttons">
            <button
              disabled={disabled}
              className={` ${disabled ? "disabled" : ""} buy-now`}
              onClick={() => {
                if (!checkLogin()) {
                  addProductToCart(selectedProduct.productItemId);
                  navigate("/cart");
                  // navigate("/checkout", {
                  //   state: {
                  //     product: {
                  //       productId: selectedProduct.productItemId,
                  //       name: selectedProduct.name,
                  //       price: selectedProduct.price,
                  //       size: selectedSize,
                  //       quantity: quantity,
                  //       productImage: selectedProduct.productImage,
                  //       discount: selectedProduct.discount,
                  //     },
                  //   },
                  // });
                } else {
                  navigate("/login");
                }
              }}
            >
              Buy Now
            </button>
            <button
              className={` ${disabled ? "disabled" : ""} add-to-cart`}
              onClick={() =>
                checkLogin()
                  ? navigate("/login")
                  : addProductToCart(selectedProduct.productItemId)
              }
              disabled={disabled}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="product-description">
        <div className="tabs">
          <button onClick={() => selectedDescription()}>Description</button>
          <button onClick={() => selectedSpecification()}>Specification</button>
          <button>Reviews</button>
        </div>
        <div className="tab-content">
          {toogle ? (
            <p>{content}</p>
          ) : (
            spec && (
              <div className="flex justify-center mt-8">
                <table className="min-w-full bg-white shadow-md rounded-lg ">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-start">Title</th>
                      <th className="py-3 px-6 text-start">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {descriptionList.map((des) => (
                      <tr
                        key={des.desId}
                        className="bg-gray-100 hover:bg-gray-200 border-b border-gray-300"
                      >
                        <td className="px-4 py-2 text-gray-800 font-semibold text-start">
                          {des.descriptionTitle}
                        </td>
                        <td className="px-4 py-2 text-gray-700 text-start">
                          {des.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
