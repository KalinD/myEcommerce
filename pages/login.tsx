import React from "react";
import { signIn } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

type Inputs = {
  emailOrUsername: string;
  password: string;
};

const loginSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string()
})

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="w-fit mx-auto bg-accent bg-opacity-75 p-8 mt-16 rounded text-black">
      <form
        onSubmit={handleSubmit(async (data) => {
          const res = await signIn("credentials", {
            emailOrUsername: data.emailOrUsername,
            password: data.password,
            callbackUrl: "/",
            redirect: true,
          });
        })}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          {...register("emailOrUsername")}
          className='rounded p-1'
          placeholder="Enter Email or Username"
        />
        <input
          type="password"
          {...register("password")}
          placeholder="Enter Password"
          className='rounded p-1'
        />
        <Button type="submit">Login</Button>
      </form>
      <AiFillGithub
        onClick={() => {
          signIn("github", { callbackUrl: "/" });
        }}
      />
    </div>
  );
}
