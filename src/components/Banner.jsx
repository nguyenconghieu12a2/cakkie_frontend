import React, { useEffect, useState } from 'react';
import '../style/Banner.css';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const intervalTime = 15000; // 15 seconds

  useEffect(() => {
    // Fetch banners from the API
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners');
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    // Auto-advance to the next banner every 15 seconds
    const intervalId = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, intervalTime);

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [banners.length]);

  const handleClickBanner = () => {
    const banner = banners[currentBannerIndex];
    if (banner && banner.link) {
      window.open(banner.link, '_blank'); // Open link in new tab
    }
  };

  const goToNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const goToPreviousBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  return (
    <div className="banner-container">
      <div
        className="banner-slider"
        style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <img
            key={index}
            src={`/images/${banner.image}`}
            alt={banner.title}
            onClick={handleClickBanner}
            className="banner-image"
          />
        ))}
      </div>
      {banners.length > 0 && (
        <div className="banner-controls">
          <button onClick={goToPreviousBanner} className="banner-button">❮</button>
          <button onClick={goToNextBanner} className="banner-button">❯</button>
        </div>
      )}
    </div>
  );
};

export default Banner;
