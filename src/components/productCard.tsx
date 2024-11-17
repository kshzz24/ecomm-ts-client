import { FaInfo, FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";
import { transformImage } from "../utils/features";

type ProductsProp = {
  productId: string;
  photos: {
    public_id: string;
    url: string;
  }[];
  name: string;
  price: number;
  stock: number;
  cartHandler: (cartItem: CartItem) => string | undefined;
  infoHandler: () => void;
};

const ProductCard = ({
  productId,
  price,
  photos,
  name,
  stock,
  cartHandler,
  infoHandler,
}: ProductsProp) => {
  console.log(photos, "phototo");
  return (
    <div className="product-card">
      <img src={transformImage(photos[0]?.url,700) ?? ""} alt="product-id" />
      <p>{name}</p>
      <span>{`₹ ${price}`}</span>
      <div>
        <button
          className="cartBtn"
          onClick={() =>
            cartHandler({
              productId,
              stock,
              quantity: 1,
              photo: photos[0]?.url,
              name,
              price,
            })
          }
        >
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
