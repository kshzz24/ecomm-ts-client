import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import  { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  // gives an object which has a data prop
  const { data, isError, isLoading } = useLatestProductsQuery("");
  // data has success, products
  console.log(data);
  const dispatch = useDispatch();
  
  const addToCartHandler = (cartItem:CartItem) => {
    if(cartItem.stock < 1) return toast.error("Out of Stock");
       dispatch(addToCart(cartItem));
       toast.success("Item Added To Cart");
  };

  const getInfoHandler = () => {};

  if (isError) toast.error("Cannot Fetch products");

  return (
    <div className="home">
      {/* img */}
      <section className="img-section"></section>

      <h1>
        Latest Product
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>

      <main>
        {isLoading ? (
          <Skeleton />
        ) : (
          data?.products.map((product, idx) => (
            <ProductCard
              key={idx}
              productId={product._id}
              price={product.price}
              photo={product.photo}
              stock={product.stock}
              name={product.name}
              cartHandler={addToCartHandler}
              infoHandler={getInfoHandler}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
