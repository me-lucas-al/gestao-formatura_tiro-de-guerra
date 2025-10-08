"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderLogin from "./header-login";
import InputAdminName from "./input-admin-name";
import InputPassword from "./input-password";
import ButtonSubmit from "./button-submit";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminName: name, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Falha no login.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Erro ao se conectar ao servidor.");
    } finally {
      setLoading(false);
    }
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
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        <ButtonSubmit
          loading={loading}
          disabled={!name || !password}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}