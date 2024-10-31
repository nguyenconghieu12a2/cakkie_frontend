import "./App.css";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout";
import Order from "./Order/Order";
import Product from "./Product/Product";
import Footer from "./Footer/Footer";
function App() {
  return (
    <div className="App">
      {/* <Product /> */}
      <Cart />
      <Checkout />
      <Order />
      <Footer />
    </div>
  );
}

export default App;
