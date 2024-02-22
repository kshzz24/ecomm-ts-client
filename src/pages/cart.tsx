import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import CartItems from "../components/cart-item";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
  const { cartItems, subtotal, total, tax, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );


  console.log(cartItems);

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCoupon, setIsValidCoupon] = useState<boolean>(false);
  const dispatch = useDispatch();

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (productId: string) => {
    // dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
    dispatch(removeCartItem(productId));
  };
  useEffect(() => {

    const {token,cancel } = axios.CancelToken.source();

    const timeoutID = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {cancelToken:token,})
        .then((res) => {
          //   console.log(res.data);
          dispatch(discountApplied(res.data.discount));
          setIsValidCoupon(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          //  console.log(e.response.data.message);
          dispatch(discountApplied(0));
          dispatch(calculatePrice());
          setIsValidCoupon(false);
        });

      if (Math.random() > 0.5) {
        setIsValidCoupon(true);
      } else {
        setIsValidCoupon(false);
      }
      return () => {
        clearTimeout(timeoutID);
        cancel();
        // jab tak type krenge tab tak yeh false krdega kyuki haar baar cleanup function call hoga jab bhi
        // coupoun change hoga aur  jaise hi type krna band krenge woh ya toh false hoga ya true 1s ke baad
        setIsValidCoupon(false);
      };
    }, 1000);
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <CartItems
              key={index}
              cartItem={item}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>No Items Available</h1>
        )}
      </main>
      <aside>
        <p>Subtotal : ₹ {subtotal}</p>
        <p>Shipping Charges : ₹ {shippingCharges}</p>
        <p>Tax : ₹ {tax}</p>
        <p>
          Discount : <em className="red"> - ₹ {discount} </em>
        </p>
        <p>
          <b> Total </b> : ₹ {total}
        </p>
        <input
          type="text"
          value={couponCode}
          placeholder="Coupon Code"
          onChange={(e) => setCouponCode(e.target.value)}
        ></input>
        {couponCode &&
          (isValidCoupon ? (
            <span className="green">
              ₹ {discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}
        {cartItems.length > 0 && <Link to="/shipping">Check Out</Link>}
      </aside>
    </div>
  );
};

export default Cart;