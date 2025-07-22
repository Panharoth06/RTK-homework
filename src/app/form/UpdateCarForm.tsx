"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { error } from "console";
import { useUpdateCarMutation } from "@/redux/services/car/car";
import { CarUpdateType } from "@/lib/cars/CarResponse";
import { id } from "zod/v4/locales";

const updateCarSchema = z.object({
  id: z.string().min(1, { message: "Make is required" }),
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.coerce
    .number()
    .gte(1886)
    .lte(new Date().getFullYear(), {
      message: `Year must be between 1886 and ${new Date().getFullYear()}`,
    }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  mileage: z.coerce
    .number()
    .nonnegative({ message: "Mileage cannot be negative" }),
  description: z.string().optional(),
  color: z.string().min(1, { message: "Color is required" }),
  fuel_type: z.string().min(1, { message: "Fuel type is required" }),
  transmission: z.string().min(1, { message: "Transmission is required" }),
  image: z.string().url({ message: "Must be a valid image URL" }),
  is_sold: z.boolean(),
});

export default function UpdateCarFormComponent() {
  //calling updateCarMutation
  const [updateCar, { data, error }] = useUpdateCarMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = secureLocalStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    if (!token) {
      setMessage("Please login first to update a car");
    }
  }, []);

  const form = useForm<z.infer<typeof updateCarSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateCarSchema) as any,
    defaultValues: {
      id: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      description: "",
      color: "",
      fuel_type: "",
      transmission: "",
      image: "",
      is_sold: false,
    },
  });

  async function onSubmit(values: z.infer<typeof updateCarSchema>) {
    //update request body
    const updateNewCar: CarUpdateType = {
      make: values.make,
      model: values.model,
      year: values.year,
      price: values.price,
      mileage: values.mileage,
      description: values.description || "",
      color: values.color,
      fuel_type: values.fuel_type,
      transmission: values.transmission,
      image: values.image,
      isSold: values.is_sold,
    };

    const accessToken = "";

    updateCar({
      updateCar: updateNewCar,
      accessToken: accessToken,
      id: values.id,
    });

    console.log("the data", data);
    console.log(error);
  }

  const fields = [
    "id",
    "make",
    "model",
    "year",
    "price",
    "mileage",
    "color",
    "fuel_type",
    "transmission",
    "image",
  ] as const;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Authentication Status */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-yellow-800 mb-2">
            You need to login to update a car.
          </p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </a>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          {/* Display message */}
          {message && (
            <div
              className={`p-3 rounded-md ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 capitalize">
                      {fieldName}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={
                          ["year", "price", "mileage"].includes(fieldName)
                            ? "number"
                            : "text"
                        }
                        placeholder={`Enter ${fieldName}`}
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe the car in detail..."
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md min-h-[100px]"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_sold"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Sold
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={isLoading || !isAuthenticated}
            >
              {isLoading ? "Updating..." : "Update Car"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
