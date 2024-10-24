import React from 'react';
import ProductList from './components/ProductList';

const HomePage = () => {
  return (
    <div>
      <section className="banner">
        <h1>Welcome to CAKKIE</h1>
        <p>Your one-stop shop for all things cool!</p>
      </section>

      <section className="products">
        <h2>Featured Products</h2>
        <ProductList />
      </section>
    </div>
  );
};

export default HomePage;
