import React from "react";
import { signIn } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="w-fit mx-auto bg-accent bg-opacity-75 p-8 mt-16 rounded text-black">
      <form
        onSubmit={handleSubmit(async (data) => {
          const res = await signIn("credentials", {
            emailOrUsername: data.emailOrUsername,
            password: data.password,
            callbackUrl: `${process.env.NEXTAUTH_URL}/`,
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
