import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/productCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";

const Home = () => {
  const { data, isError, isLoading } = useLatestProductsQuery("");
  const {user} = useSelector((state:RootState)=> state.userReducer)

  console.log(data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToCartHandler = (cartItem: CartItem) => {
    if( !(user)){
      toast.error("Please Login First");
      navigate("/login");
      return
    }
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Item Added To Cart");
  };

  const getInfoHandler = ( id:string ) => {

      
      return navigate(`product/${id}`)

  };

  if (isError) toast.error("Cannot Fetch products");

  return (
    <div className="home">
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
          <>
          
            {data?.products.map((product, idx) => (
              <ProductCard
                key={idx}
                productId={product._id}
                price={product.price}
                photo={product.photo}
                stock={product.stock}
                name={product.name}
                cartHandler={addToCartHandler}
                infoHandler={() => getInfoHandler(product._id)}
              />
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
