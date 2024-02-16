import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";
import { server } from "../redux/store";


type CartItemProps = {
  cartItem:CartItem;
  incrementHandler:  (cartItem: CartItem) => void;
  decrementHandler:  (cartItem: CartItem) => void;
  removeHandler:(productId: string) => void;
};

const CartItems = ({cartItem, incrementHandler, decrementHandler, removeHandler}:CartItemProps) => {
  const {photo, name, quantity, price,productId} = cartItem;
  return (
    <div className="cart-item">
        <img src={`${server}/${photo}`} alt={name} />
        <article>
          <Link to={`product/${productId}`}>{ name }</Link>
          <span>₹ {price}</span>
        </article>
        <div>
          <button onClick={() => decrementHandler(cartItem)}>
            <FaMinus />
          </button>
          <p>{quantity}</p>
          <button  onClick={() => incrementHandler(cartItem)} >
            <FaPlus  />
          </button>
        </div>
        <button onClick={() => removeHandler(productId)} >
          <FaTrash />
        </button>
    </div>
  )
};

export default CartItems