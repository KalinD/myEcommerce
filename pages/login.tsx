import React from "react";
import { signIn } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Head from "next/head";

type Inputs = {
  emailOrUsername: string;
  password: string;
};

const loginSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string(),
});

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="w-fit mx-auto bg-accent bg-opacity-75 p-8 mt-16 rounded text-primary-color">
      <Head>
        <title>Login into your account</title>
        <meta name="description" content="Login into your account using your email or username, and password. Or login using OAuth and your GitHub account." />
        <meta property="og:title" content="Login into your account" />
        <meta property="og:description" content="Login into your account using your email or username, and password. Or login using OAuth and your GitHub account." />
        <meta property="og:image" content="https://www.kalind-ecommerce.com/" />
        <meta property="og:image:secure" content="https://www.kalind-ecommerce.com/" />
        <meta property="og:url" content="https://www.kalind-ecommerce.com/login" />
        <meta name="keywords" content="login, ecommrce, demo" />
        <link rel="canonical" href="https://www.kalind-ecommerce.com/login" />
      </Head>
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
        <Input
          type="text"
          {...register("emailOrUsername")}
          placeholder="Enter Email or Username"
        />
        <Input
          type="password"
          {...register("password")}
          placeholder="Enter Password"
        />
        <Button type="submit">Login</Button>
      </form>
      <Button
        type="button"
        className="w-full mt-3"
        onClick={() => {
          signIn("github", { callbackUrl: "/" });
        }}
      >
        <AiFillGithub />
      </Button>
    </div>
  );
}
