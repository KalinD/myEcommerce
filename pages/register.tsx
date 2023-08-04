import { useAuth } from "@/context/AuthContext";
import React, { FormEvent, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import prisma from "@/lib/prisma";

interface RegisterFields {
  username: string;
  email: string;
  password: string;
  password2: string;
  name: string;
}


export default function Register() {
  
const registerSchema = z
.object({
  username: z.string(),
  email: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long!" }),
  password2: z.string(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
})
.refine((data) => data.password === data.password2, {
  message: "Passwords must match!",
  path: ["confirmPassword"],
})
// .refine(async (data) => {
//   const users = await prisma.user.findMany({
//     select: {
//       username: true
//     }
//   })
//   return users.map(u => u.username).includes(data.username)
// }, {message: 'Username is already taken', path: ['uniqueUsername']});

  const { register, handleSubmit, formState: {errors} } = useForm<RegisterFields>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      password2: "",
      name: "",
    },
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="w-fit mx-auto bg-accent bg-opacity-75 p-8 mt-16 rounded text-black">
      <form
        onSubmit={handleSubmit(async (data) => {
          console.log(data)
          const res = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: data.username,
              name: data.name,
              email: data.email,
              password: data.password,
            }),
          });

          if (await res.json()) {
            await signIn("credentials", {
              emailOrUsername: data.username,
              password: data.password,
              callbackUrl: "/",
              redirect: true,
            });
          }
        })}
        className="flex flex-col gap-3"
      >
        <input type="text" placeholder="Enter Name" {...register("name")} />
        <input
          type="text"
          placeholder="Enter Username"
          {...register("username")}
        />
        <input type="email" placeholder="Enter Email" {...register("email")} />
        <input
          type="password"
          placeholder="Enter Password"
          {...register("password")}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("password2")}
        />
        <SubmitButton value="Register" />
      </form>
    </div>
  );
}
