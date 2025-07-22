"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

// formSchema Validation using zod
const formValidation = z
  .object({
    username: z.string().min(2, {
      message: "At least input 2 character in username",
    }),
    email: z.email({ pattern: z.regexes.rfc5322Email }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 character up",
      })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    confirmed_password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  })
  .refine((data) => data.password === data.confirmed_password, {
    message: "Password and Confirm Password didn't match",
    path: ["confirmed_password"],
  });

export default function RegisterFormComponent() {
  // 1. Define form
  const form = useForm<z.infer<typeof formValidation>>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmed_password: "",
    },
  });

  // 2. apply handlesubmission
  async function onSubmit(values: z.infer<typeof formValidation>) {
    // implement register function server handleroute
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/form",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          confirmed_password: values.confirmed_password,
        }),
      });

      if (!res.ok) {
        console.log("Failed to register");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-[400px] border p-8 rounded-lg mx-auto ">
      <Link href={"/login"} className="underline">
        Login
      </Link>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-3">
          {/* username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="koko" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="koko@gmail.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Koko123$%$%" {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* confirmedP password */}

          <FormField
            control={form.control}
            name="confirmed_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="Koko123$%$%" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Register</Button>
        </form>
      </Form>
    </div>
  );
}
