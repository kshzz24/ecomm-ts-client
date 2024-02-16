import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BarResponse,
  LineResponse,
  PieResponse,
  StatsResponse,
} from "../../types/api-types";

export const dashboardAPI = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`,
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    stats: builder.query<StatsResponse, string>({
      query: (id) => `stats?_id=${id}`,
      keepUnusedDataFor: 0,
    }),
    pie: builder.query<PieResponse, string>({
      query: (id) => `pie?_id=${id}`,
      keepUnusedDataFor: 0,
    }),
    bar: builder.query<BarResponse, string>({
      query: (id) => `bar?_id=${id}`,
      keepUnusedDataFor: 0,
    }),
    line: builder.query<LineResponse, string>({
      query: (id) => `line?_id=${id}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useStatsQuery, usePieQuery, useBarQuery, useLineQuery } =
  dashboardAPI;
