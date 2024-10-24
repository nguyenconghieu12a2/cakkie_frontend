import { useState } from "react";
import "../styles/cartItem.css";

function CartItem({ product_image, product_name, product_qty, price }) {
  const [quantity, setQuantity] = useState(product_qty);

  const handleInputChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]/g, "");
    if (quantity > 1) {
      setQuantity(parseInt(newValue));
    }
  };
  const increaseQty = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <section className="cart-item">
      <div className="product-info item">
        <img src={`${product_image}`} className="image" alt={product_image} />
        <p>{product_name}</p>
      </div>
      <div className="item qty">
        <button class="fa-solid fa-plus icon" onClick={increaseQty}></button>
        <input
          className="quantity"
          type="number"
          value={quantity}
          min="1"
          onChange={handleInputChange}
        />
        <button class="fa-solid fa-minus icon" onClick={decreaseQty}></button>
      </div>
      <div className="item price">{price} VND</div>
      <div className="item total">{quantity * price}</div>
      <div className="item remove">
        <button>Remove</button>
      </div>
    </section>
  );
}

export default CartItem;
