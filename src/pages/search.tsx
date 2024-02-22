import { useState } from "react";
import ProductCard from "../components/productCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productApi";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import { CartItem } from "../types/types";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: isProductError,
    error: productError,
  } = useSearchProductsQuery({ search, sort, category, page, price: maxPrice });

  console.log(searchedData);
  const dispatch = useDispatch();
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Item Added To Cart");
  };
  const getInfoHandler = () => {};
  const isNextPage = page < 4;
  const isPrevPage = page > 1;

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if (isProductError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value=""> None </option>
            <option value="asc"> Price (Low to High) </option>
            <option value="dsc"> Price (Hgh to Low) </option>
          </select>
        </div>
        <div>
          <h4>Max Price : {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={200000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=""> All </option>
            {loadingCategories === false &&
              categoriesResponse?.categories.map((category, idx) => (
                <option key={idx} value={category}>
                  {" "}
                  {category[0].toLocaleUpperCase() + category.substring(1)}{" "}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search By Name...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {productLoading ? (
          <Skeleton />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((product, idx) => (
              <ProductCard
                key={idx}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                cartHandler={addToCartHandler}
                infoHandler={getInfoHandler}
                photo={product.photo}
              />
            ))}
          </div>
        )}
        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((page) => page - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((page) => page + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;