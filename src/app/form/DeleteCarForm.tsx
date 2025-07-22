"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { Button } from "@/components/ui/button";
import {
  FormField,
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDeleteCarMutation } from "@/redux/services/car/car";

const deleteCarSchema = z.object({
  id: z.string().min(1, { message: "Car ID is required" }),
});

export default function DeleteCarFormComponent() {
  // calling deleteCarMutation
  const [deleteCar, { data, isLoading, error }] = useDeleteCarMutation();

  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = secureLocalStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    if (!token) {
      setMessage("Please login first to delete a car");
    }
  }, []);

  const form = useForm<z.infer<typeof deleteCarSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(deleteCarSchema) as any,
    defaultValues: {
      id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof deleteCarSchema>) {
    const accessToken = secureLocalStorage.getItem("authToken") as string;

    try {
      const response = await deleteCar({
        id: values.id,
        accessToken: accessToken,
      }).unwrap();

      setMessage(response.message);
      form.reset();
    } catch (err: any) {
      if (err?.data?.detail) {
        setMessage(err.data.detail[0]?.msg || "Validation error");
      } else {
        setMessage("Failed to delete car. Make sure the ID is correct.");
      }
    }
  }

  const fields = ["id"] as const;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Authentication Status */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-yellow-800 mb-2">
            You need to login to delete a car.
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

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={isLoading || !isAuthenticated}
            >
              {isLoading ? "Deleting..." : "Delete Car"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
