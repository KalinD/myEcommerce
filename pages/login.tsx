import React from "react";
import SubmitButton from "@/components/SubmitButton";
import { signIn } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

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
          await signIn("credentials", {
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
        <SubmitButton value="Login" />
      </form>
      <AiFillGithub
        onClick={() => {
          signIn("github", { callbackUrl: "/" });
        }}
      />
    </div>
  );
}
