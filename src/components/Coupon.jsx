import React, { useEffect, useRef, useState } from 'react';
import '../style/Coupon.css';

const Coupon = ({ coupons }) => {
  const [offset, setOffset] = useState(0);
  const [shuffledCoupons, setShuffledCoupons] = useState([]);
  const couponListRef = useRef(null);

  // Function to shuffle an array
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  useEffect(() => {
    setShuffledCoupons(shuffleArray(coupons)); // Shuffle coupons initially
  }, [coupons]);

  useEffect(() => {
    // Calculate the width of the coupon list for looping
    const listWidth = couponListRef.current.scrollWidth / 2;

    // Start the scrolling effect
    const intervalId = setInterval(() => {
      setOffset((prevOffset) => {
        // Reset offset to 0 once it reaches the listWidth (for smooth looping)
        return prevOffset <= -listWidth ? 0 : prevOffset - 1;
      });
    }, 20);

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [shuffledCoupons]);

  return (
    <div className="coupon-list-container">
      <div
        className="coupon-list"
        ref={couponListRef}
        style={{ transform: `translateX(${offset}px)` }}
      >
        {/* Duplicate shuffledCoupons for seamless scrolling */}
        {[...shuffledCoupons, ...shuffledCoupons].map((coupon, index) => (
          <div key={index} className="coupon">
            {coupon.name} : {coupon.code}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coupon;
