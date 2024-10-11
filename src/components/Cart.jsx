import './styles/Cart.css'

function Cart() {
    return (
        <section className="cart">
        <h1>Shopping Cart</h1>
        <table id="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="cart-items">
                {/* <!-- cart items will be displayed here --> */}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">Total:</td>
                    <td id="total-price">$0.00</td>
                </tr>
            </tfoot>
        </table>
        <div id="cart-actions">
            <button id="update-cart">Update Cart</button>
            <button id="checkout">Checkout</button>
        </div>
        </section>
    );
}

export default Cart;