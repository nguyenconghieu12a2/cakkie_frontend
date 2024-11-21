import React, { useEffect, useState } from "react";
// import ProductList from "./components/ProductList";
import Coupon from "./components/Coupon";
import Banner from "./components/Banner";
import Home from "./Home/Home";
import BestSeller from "./components/best-seller";

const HomePage = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch("/api/coupons/getall");
        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div>
      <section className="banner pt-10 pb-10">
        {/* <h1 className="text-4xl mt-3">Welcome to CAKKIE</h1>
        <div className="w-full">
          <p className="flex justify-center text-xl mt-3">
            Your one-stop shop for all things cool!
          </p>
        </div> */}
        <Banner />
      </section>

      <section className="coupons pb-10">
        <h2 className="mt-3">Exclusive Coupons</h2>
        <Coupon coupons={coupons} />
      </section>

      <section className="top-products">
        <h2>Top Trend Products</h2>
        <BestSeller />
      </section>

      <section className="products">
        <h2>Featured Products</h2>
        <Home />
      </section>
    </div>
  );
};

export default HomePage;
