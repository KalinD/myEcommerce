import { useAuth } from "@/context/AuthContext";
import React, { FormEvent, useState } from "react";
import InputField from "@/components/InputField";
import SubmitButton from "@/components/SubmitButton";
import { signIn } from "next-auth/react";

interface RegisterFields {
  username: {
    value: string;
  };
  email: {
    value: string;
  };
  password: {
    value: string;
  };
  password2: {
    value: string;
  };
}

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { register } = useAuth();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
      }),
    });

    if (await res.json()) {
      await signIn("credentials", {
        emailOrUsername: username,
        password: password,
        callbackUrl: '/',
        redirect: true
      });
    }
  };

  return (
    <div className="w-fit mx-auto bg-accent bg-opacity-75 p-8 mt-16 rounded text-black">
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <InputField
          type="text"
          name="name"
          value={name}
          setValue={setName}
          placeholder="Enter Name"
        />
        <InputField
          type="text"
          name="username"
          value={username}
          setValue={setUsername}
          placeholder="Enter Username"
        />
        <InputField
          type="email"
          name="email"
          value={email}
          setValue={setEmail}
          placeholder="Enter Email"
        />
        <InputField
          type="password"
          name="password"
          value={password}
          setValue={setPassword}
          placeholder="Enter Password"
        />
        <InputField
          type="password"
          name="password2"
          value={password2}
          setValue={setPassword2}
          placeholder="Confirm Password"
        />
        <SubmitButton value="Register" />
      </form>
    </div>
  );
}
