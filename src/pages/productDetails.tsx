/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useGetSingleProductQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { Skeleton } from "../components/loader";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "../types/types";
import { RootState } from "../redux/store";

// import { addToCart } from "../redux/reducer/cartReducer";
  const stock  = 99;
const ProductDetails = () => {
   
   const params = useParams();

   const dispatch = useDispatch();
   const navigate = useNavigate();
    const {user} = useSelector((state:RootState)=> state.userReducer)

    console.log(params);
    

  const { isLoading, isError, error, data } = useGetSingleProductQuery(params?.id!);

   
   console.log(data?.product._id);
   
  


   if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }


  const [quantity, setQuantity] = useState(1);
  const [addReview, setAddReview] = useState<number>(1);

  const incrementHandler = () => {
    if (stock <= quantity) return;
    setQuantity((quantity) => quantity + 1);
  };

  const decrementHandler = () => {
    if (1 >= quantity) return;

    setQuantity((quantity) => quantity - 1);
  };

  const addToCartHandler = (cartItem:CartItem) => {
    // if (cartItem.stock < 1) return toast.error("Out of Stock");
    if(!(user)){
      toast.error("Please Login First");
      navigate("/login");
      return
    }
    dispatch(addToCart(cartItem));
    toast.success("Item Added To Cart");
  }

  const addReviewHandler = () => {
       if(user?._id){
           setAddReview(() => addReview-1);
       }
       else{
          toast.error("Please Login In First");
       }
  }

  return (
 
      <div className="product-container">
         {
            isLoading ? <Skeleton /> : (
                <>
                 <section className="main-container">
          <div className="img-container">
            <img
              src={data?.product.photo}
              alt=""
            />
          </div>

          <div className="product-details">
            <div className="product-title">
              <h1>{data?.product.name}</h1>
              <span>{data?.product._id}</span>
            </div>
           
            <div className="product-buy">
              <h1> ₹{data?.product.price}</h1>
              <b className={stock > 0 ? "in-stock" : " out-of-stock"}>
                {stock > 0 ? "In Stock" : "Out Of Stock"}
              </b>
            </div>
            {stock > 0 ? (
              <div className="cart-container">
                <div className="cart-handler">
                <button onClick={decrementHandler}>
                    <FaMinus />
                  </button>
                  <p>{quantity}</p>
                  <button onClick={incrementHandler}>
                    <FaPlus />
                  </button>
                 
                
                </div>
                <div className="add-handler">
                  <button onClick={() => addToCartHandler({
                    productId : data?.product._id!,
                    name : data?.product.name!,
                    price : data?.product.price!,
                    stock : data?.product.stock!,
                    quantity,
                    photo: data?.product.photo!,

                  
                  })}>Add to Cart</button>
                </div>
              </div>
            ) : (
              <>
              
              </>
            )}
          <div className="review-button">
              <button onClick={addReviewHandler}>Submit Review</button>
            </div>
          </div>
        </section>
        <section className="review-container">
          <div>Review Section</div>
        </section>
        </>
            )
         }
      </div>

  );
};

export default ProductDetails;
