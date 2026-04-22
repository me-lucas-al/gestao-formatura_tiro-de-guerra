"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Target, Loader2 } from "lucide-react";
import Image from "next/image";
import { loginAdmin } from "@/actions/login";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginAdmin({ adminName, password });

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Ocorreu um erro inesperado.");
      }
    } catch (err) {
      setError("Falha na conexão com o servidor.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.98_0.01_143)] p-4 dark:bg-[oklch(0.15_0.02_143)]">
      {/* Background patterns/texture for military feel */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.35 0.08 143) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Military Branding Header */}
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[oklch(0.35_0.08_143)] text-white mb-2 shadow-lg ring-4 ring-[oklch(0.35_0.08_143)]/20">
            <Image src="/tg_logotipo.png" alt="Logo TG" width={32} height={32} className="size-8 object-contain drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-[oklch(0.25_0.05_143)] dark:text-[oklch(0.9_0.02_143)] uppercase font-mono">
            Tiro de Guerra
          </h1>
          <p className="text-sm font-bold tracking-[0.2em] text-[oklch(0.4_0.08_143)] dark:text-[oklch(0.6_0.05_143)] uppercase font-mono">
            Gestão de Formatura
          </p>
        </div>

        <Card className="border-2 border-[oklch(0.35_0.08_143)]/20 shadow-xl overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-black/90">
          <div className="h-1.5 w-full bg-[oklch(0.35_0.08_143)]" />

          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold font-mono uppercase flex items-center gap-2">
              <Target className="size-5 text-[oklch(0.35_0.08_143)]" />
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-xs uppercase tracking-wider font-medium">
              Identifique-se para prosseguir
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="adminName"
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                >
                  Usuário / RA
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-2.5 size-4 text-muted-foreground group-focus-within:text-[oklch(0.35_0.08_143)] transition-colors" />
                  <Input
                    id="adminName"
                    placeholder="DIGITE SEU USUÁRIO"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    className="pl-10 border-[oklch(0.35_0.08_143)]/20 focus-visible:ring-[oklch(0.35_0.08_143)] focus-visible:border-[oklch(0.35_0.08_143)] uppercase font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    Senha de Acesso
                  </Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground group-focus-within:text-[oklch(0.35_0.08_143)] transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 border-[oklch(0.35_0.08_143)]/20 focus-visible:ring-[oklch(0.35_0.08_143)] focus-visible:border-[oklch(0.35_0.08_143)]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 text-xs font-bold bg-destructive/10 border border-destructive/20 text-destructive rounded-md uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
                  [ALERTA]: {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[oklch(0.35_0.08_143)] hover:bg-[oklch(0.25_0.05_143)] text-white font-mono font-bold uppercase tracking-widest py-6 transition-all shadow-md active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  "AUTENTICAR"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
