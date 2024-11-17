/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
// /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
// import { useState } from "react";
// import { FaMinus, FaPlus } from "react-icons/fa";
// import { useGetSingleProductQuery } from "../redux/api/productApi";
// import toast from "react-hot-toast";
// import { CustomError } from "../types/api-types";
// import { Skeleton } from "../components/loader";
// import { useNavigate, useParams } from "react-router-dom";
// import { addToCart } from "../redux/reducer/cartReducer";
// import { useDispatch, useSelector } from "react-redux";
// import { CartItem } from "../types/types";
// import { RootState } from "../redux/store";

import { CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaRegStar,
  FaStar,
} from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/loader";
import RatingsComponent from "../components/rating";
import {
  useAllReviewsOfProductsQuery,
  useDeleteReviewMutation,
  useNewReviewMutation,
  useProductDetailsQuery,
} from "../redux/api/productApi";
import { addToCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { CartItem, Review } from "../types/types";
import { responseToast } from "../utils/features";
// // import { addToCart } from "../redux/reducer/cartReducer";
// const stock = 99;
// const ProductDetails = () => {
//   const params = useParams();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state: RootState) => state.userReducer);

//   console.log(params);

//   const { isLoading, isError, error, data } = useGetSingleProductQuery(
//     params?.id!
//   );

//   console.log(data?.product._id);

//   if (isError) {
//     const err = error as CustomError;
//     toast.error(err.data.message);
//   }

//   const [quantity, setQuantity] = useState(1);

//   const incrementHandler = () => {
//     if (stock <= quantity) return;
//     setQuantity((quantity) => quantity + 1);
//   };

//   const decrementHandler = () => {
//     if (1 >= quantity) return;

//     setQuantity((quantity) => quantity - 1);
//   };

//   const addToCartHandler = (cartItem: CartItem) => {
//     // if (cartItem.stock < 1) return toast.error("Out of Stock");
//     if (!user) {
//       toast.error("Please Login First");
//       navigate("/login");
//       return;
//     }
//     dispatch(addToCart(cartItem));
//     toast.success("Item Added To Cart");
//   };

//   return (
//     <div className="product-container">
//       {isLoading ? (
//         <Skeleton />
//       ) : (
//         <>
//           <section className="main-container">
//             <div className="img-container">
//               <img src={data?.product?.photos[0]?.url} alt="" />
//             </div>

//             <div className="product-details">
//               <div className="product-title">
//                 <h1>{data?.product.name}</h1>
//                 <span>{data?.product._id}</span>
//               </div>

//               <div className="product-buy">
//                 <h1> ₹{data?.product.price}</h1>
//                 <b
//                   className={
//                     data?.product.stock! > 0 ? "in-stock" : " out-of-stock"
//                   }
//                 >
//                   {data?.product.stock! > 0 ? "In Stock" : "Out Of Stock"}
//                 </b>
//               </div>

//               <div className="cart-container">
//                 {data?.product.stock! > 0 ? (
//                   <>
//                     <div className="cart-handler">
//                       <button onClick={decrementHandler}>
//                         <FaMinus />
//                       </button>
//                       <p>{quantity}</p>
//                       <button onClick={incrementHandler}>
//                         <FaPlus />
//                       </button>
//                     </div>

//                     <div className="add-handler">
//                       <button
//                         onClick={() =>
//                           addToCartHandler({
//                             productId: data?.product._id!,
//                             name: data?.product.name!,
//                             price: data?.product.price!,
//                             stock: data?.product.stock!,
//                             quantity,
//                             photo: data?.product?.photos[0]?.url!,
//                           })
//                         }
//                       >
//                         Add to Cart
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <h1 style={{ color: "red" }}> Not Avaliable</h1>
//                 )}
//               </div>
//             </div>
//           </section>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, isError, data } = useProductDetailsQuery(params.id!);
  const reviewsResponse = useAllReviewsOfProductsQuery(params.id!);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [reviewComment, setReviewComment] = useState("");
  const reviewDialogRef = useRef<HTMLDialogElement>(null);
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);

  const [createReview] = useNewReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const decrement = () => {
    setQuantity((prev) => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };
  console.log(data?.product.stock, "this is the stock");
  const increment = () => {
    if (data?.product?.stock! === 0) {
      return toast.error(`Product Out of Stock`);
    }
    if (data?.product?.stock! >= quantity)
      return toast.error(`${data?.product?.stock} available only`);
    setQuantity((prev) => prev + 1);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) return <Navigate to="/404" />;

  const showDialog = () => {
    reviewDialogRef.current?.showModal();
  };

  const {
    Ratings: RatingsEditable,
    rating,
    setRating,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.75rem",
      color: "coral",
      justifyContent: "flex-start",
    },
  });

  const reviewCloseHandler = () => {
    reviewDialogRef.current?.close();
    setRating(0);
    setReviewComment("");
  };

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewSubmitLoading(true);
    reviewCloseHandler();

    const res = await createReview({
      comment: reviewComment,
      rating,
      userId: user?._id,
      productId: params.id!,
    });

    setReviewSubmitLoading(false);

    responseToast(res, null, "");

    // API call to submit review
  };

  const handleDeleteReview = async (reviewId: string) => {
    const res = await deleteReview({ reviewId, userId: user?._id });
    responseToast(res, null, "");
  };

  console.log(data, "dddddd");
  return (
    <div className="product-details">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          {" "}
          <main>
            <section>
              <Slider
                onClick={() => setCarouselOpen(true)}
                showThumbnails
                showNav={false}
                // showDots={true}
                images={data?.product?.photos.map((i) => i.url) || []}
              />
              {carouselOpen && (
                <MyntraCarousel
                  setIsOpen={setCarouselOpen}
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  images={data?.product?.photos.map((i) => i.url) || []}
                />
              )}
            </section>
            <section>
              <code>{data?.product?.category}</code>
              <h1>{data?.product?.name}</h1>
              <em
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <RatingsComponent value={data?.product?.rating || 0} />(
                {data?.product?.numOfReviews || 0} reviews)
              </em>

              <h3> ₹{data?.product?.price}</h3>
              <article>
                <div>
                  <button onClick={decrement}>-</button>
                  <span>{quantity}</span>
                  <button onClick={increment}>+</button>
                </div>
                <button
                  onClick={() =>
                    addToCartHandler({
                      productId: data?.product?._id!,
                      name: data?.product?.name!,
                      price: data?.product?.price!,
                      stock: data?.product?.stock!,
                      quantity,
                      photo: data?.product?.photos[0]?.url! || "",
                    })
                  }
                >
                  Add To Cart
                </button>
                <p>{data?.product?.description}</p>
              </article>
            </section>
          </main>
        </>
      )}
      <dialog ref={reviewDialogRef} className="review-dialog">
        <button onClick={reviewCloseHandler}>X</button>
        <h2>Write a Review</h2>
        <form onSubmit={submitReview}>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Review..."
          ></textarea>
          <RatingsEditable />
          <button disabled={reviewSubmitLoading} type="submit">
            Submit
          </button>
        </form>
      </dialog>

      <section>
        <article>
          <h2>Reviews</h2>

          {reviewsResponse.isLoading
            ? null
            : user && (
                <button onClick={showDialog}>
                  <FiEdit />
                </button>
              )}
        </article>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            overflowX: "auto",
            padding: "2rem",
          }}
        >
          {reviewsResponse.isLoading ? (
            <>
              <Skeleton width="45rem" length={5} />
              <Skeleton width="45rem" length={5} />
              <Skeleton width="45rem" length={5} />
            </>
          ) : (
            reviewsResponse.data?.reviews.map((review) => (
              <ReviewCard
                handleDeleteReview={handleDeleteReview}
                userId={user?._id}
                key={review._id}
                review={review}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        border: "1px solid #f1f1f1",
        height: "80vh",
      }}
    >
      <section style={{ width: "100%", height: "100%" }}>
        <Skeleton
          width="100%"
          containerHeight="100%"
          height="100%"
          length={1}
        />
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
        }}
      >
        <Skeleton width="40%" length={3} />
        <Skeleton width="50%" length={4} />
        <Skeleton width="100%" length={2} />
        <Skeleton width="100%" length={10} />
      </section>
    </div>
  );
};

const ReviewCard = ({
  review,
  userId,
  handleDeleteReview,
}: {
  userId?: string;
  review: Review;
  handleDeleteReview: (reviewId: string) => void;
}) => (
  <div className="review">
    <RatingsComponent value={review.rating} />
    <p>{review.comment}</p>
    <div>
      <img src={review.user.photo} alt="User" />
      <small>{review.user.name}</small>
    </div>
    {userId === review.user._id && (
      <button onClick={() => handleDeleteReview(review._id)}>
        <FaTrash />
      </button>
    )}
  </div>
);
const NextButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowRightLong />
  </button>
);
const PrevButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowLeftLong />
  </button>
);

export default ProductDetails;
