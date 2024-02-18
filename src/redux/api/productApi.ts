import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// url
import {
  AllProductsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  MessageResponse,
  NewProductRequest,
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
        query: (_id) =>  `${_id}`,
        providesTags: ["product"],
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
      query: ({ formData, userId,  productId}) => ({
        url: `${productId}?_id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({  userId,  productId}) => ({
        url: `${productId}?_id=${userId}`,
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
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
