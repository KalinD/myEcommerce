import { useAuth } from "@/context/AuthContext";
import React, { FormEvent, useState } from "react";
import InputField from "@/components/InputField";
import SubmitButton from "@/components/SubmitButton";

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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { register } = useAuth();

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    register(username, email, password, password2);
  };

  return (
    <div className="w-fit mx-auto bg-accent bg-opacity-75 p-8 mt-16 rounded text-black">
      <form onSubmit={handleRegister} className="flex flex-col gap-3">
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
};
