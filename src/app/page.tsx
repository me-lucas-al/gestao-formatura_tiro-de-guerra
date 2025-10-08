"use client";

import { useState } from "react";
import HeaderLogin from "@/modules/login/header-login";
import InputAdminName from "@/modules/login/input-admin-name";
import InputPassword from "@/modules/login/input-password";
import ButtonSubmit from "@/modules/login/button-submit";
import { useLogin } from "@/hooks/use-login";
import { AxiosError } from "axios";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useLogin();

  const apiError = error as AxiosError<{ error: string }>;
  const errorMessage = apiError?.response?.data?.error;

  const handleSubmit = () => {
    if (!name || !password) return;
    mutate({ adminName: name, password });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <HeaderLogin />
        <div className="space-y-4">
          <InputAdminName
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center">{errorMessage}</p>
        )}
        <ButtonSubmit
          loading={isPending}
          disabled={!name || !password}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}