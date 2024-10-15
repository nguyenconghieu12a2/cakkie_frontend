import { useState } from "react";
import '../styles/cartItem.css'

function CartItem({ product_image, product_name, product_qty, price }) {
  const [quantity, setQuantity] = useState(product_qty);

  const increaseQty = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    setQuantity(quantity - 1);
  };

  return (
    <section className="cart-item">
      <div>
        <img src={`./images/${product_image}`} alt={product_image} />
        <p>{product_name}</p>
      </div>
      <div>
        <i class="fa-solid fa-plus" onClick={increaseQty}></i>
        <input type="number" value={product_qty} min="1" />
        <i class="fa-solid fa-minus" onClick={decreaseQty}></i>
      </div>
      <div>{price} VND</div>
      <div>{quantity}</div>
      <div>
        <button>Remove</button>
      </div>
    </section>
  );
}

export default CartItem;
