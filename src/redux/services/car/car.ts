import {
  CarCreateType,
  CarResponseType,
  CarUpdateType,
} from "@/lib/cars/CarResponse";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL_CAR_API,
  }),
  tagTypes: ["Car"], // used for cache invalidation
  endpoints: (builder) => ({
    // GET all cars with pagination
    getCars: builder.query<CarResponseType[], { page: number; limit: number }>({
      query: ({ page, limit }) => {
        const skip = (page - 1) * limit;
        return `cars?skip=${skip}&limit=${limit}`;
      },
      providesTags: ["Car"],
    }),

    // GET car by ID
    getCarById: builder.query<CarResponseType, string>({
      query: (id) => `cars/${id}`,
      providesTags: (result, error, id) => [{ type: "Car", id }],
    }),

    // CREATE car
    createCar: builder.mutation<
      CarResponseType,
      { newCar: CarCreateType; accessToken: string }
    >({
      query: ({ newCar, accessToken }) => ({
        url: "cars",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: newCar,
      }),
      invalidatesTags: ["Car"],
    }),

    // UPDATE car
    updateCar: builder.mutation<
      CarResponseType,
      { updateCar: CarUpdateType; accessToken: string; id: string }
    >({
      query: ({ updateCar, accessToken, id }) => ({
        url: `cars/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: updateCar,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Car", id }],
    }),

    // DELETE car
    deleteCar: builder.mutation<
      { message: string },
      { accessToken: string; id: string }
    >({
      query: ({ accessToken, id }) => ({
        url: `cars/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      transformResponse: (response: any) => ({ message: response.message }),
      invalidatesTags: (result, error, { id }) => [{ type: "Car", id }],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carApi;
