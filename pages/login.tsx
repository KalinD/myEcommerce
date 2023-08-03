import React, { useState, FormEvent, useRef } from "react";
import InputField from "@/components/InputField";
import SubmitButton from "@/components/SubmitButton";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "@/components/Button";
import { AiFillGithub } from "react-icons/ai";

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // const result = await signIn("credentials", {
    //   emailOrUsername: emailOrUsername,
    //   password: password,
    // });
  };

  return (
    <div className="w-fit mx-auto bg-accent bg-opacity-75 p-8 mt-16 rounded text-black">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <InputField
          type="text"
          name="emailOrUsername"
          value={emailOrUsername}
          setValue={setEmailOrUsername}
          placeholder="Enter Email or Username"
        />
        <InputField
          type="password"
          name="password"
          value={password}
          setValue={setPassword}
          placeholder="Enter Password"
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
