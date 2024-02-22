import { FaInfo, FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";

type ProductsProp = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  cartHandler: (cartItem: CartItem) => string | undefined
  infoHandler : () => void;
};

const ProductCard = ({
  productId,
  price,
  photo,
  name,
  stock,
  cartHandler,
  infoHandler,
}: ProductsProp) => {
  return (
    <div className="product-card">
      <img src={photo} alt="product-id" />
      <p>{name}</p>
      <span>{`₹ ${price}`}</span>
      <div>
        <button className="cartBtn" onClick={() => cartHandler({
          productId,
          stock,
          quantity: 1,
          photo,
          name,
          price
        })}>
          <FaPlus />
        </button>
        <button className="detail" onClick={() => infoHandler()}>
          <FaInfo />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
