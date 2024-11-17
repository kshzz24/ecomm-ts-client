import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// url
import {
  AllProductsResponse,
  AllReviewsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  DeleteReviewRequest,
  MessageResponse,
  NewProductRequest,
  NewReviewRequest,
  ProductResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  SingleProductResponse,
  UpdateProductRequest,
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    // return & query argument
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    getSingleProduct: builder.query<SingleProductResponse, string>({
      query: (_id) => `${_id}`,
    }),
    allAdminProdcuts: builder.query<AllProductsResponse, string>({
      query: (_id) => `admin-products?_id=${_id}`,
      providesTags: ["product"],
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => `category`,
      providesTags: ["product"],
    }),
    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ price, search, category, sort, page }) => {
        let base = `all?search=${search}&page=${page}`;
        if (price) base += `&price=${price}`;
        if (category) base += `&category=${category}`;
        if (sort) base += `&sort=${sort}`;
        return base;
      },
      providesTags: ["product"],
    }),
    productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, _id }) => ({
        url: `new?_id=${_id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?_id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?_id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),

    allReviewsOfProducts: builder.query<AllReviewsResponse, string>({
      query: (productId) => `reviews/${productId}`,
      providesTags: ["product"],
    }),

    newReview: builder.mutation<MessageResponse, NewReviewRequest>({
      query: ({ comment, rating, productId, userId }) => ({
        url: `review/new/${productId}?id=${userId}`,
        method: "POST",
        body: { comment, rating },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["product"],
    }),

    deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
      query: ({ reviewId, userId }) => ({
        url: `/review/${reviewId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
    // another query after products
  }),
});

// after endpoints
export const {
  useLatestProductsQuery,
  useAllAdminProdcutsQuery,
  useCategoriesQuery,
  useGetSingleProductQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useAllReviewsOfProductsQuery,
  useNewReviewMutation,
  useDeleteReviewMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
