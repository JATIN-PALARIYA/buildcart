"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/AdminContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Loader2, Lock, Mail, Store } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAdmin();
  const [error, setError] = useState<string | null>(null);
  const [seedStatus, setSeedStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedStatus(null);
    try {
      const response = await fetch("/api/admin/seed", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setSeedStatus({ type: "success", message: data.message || "Database seeded successfully! Try logging in now." });
      } else {
        setSeedStatus({ type: "error", message: data.message || "Failed to seed database." });
      }
    } catch (err) {
      setSeedStatus({ type: "error", message: "Network error occurred during database seeding." });
    } finally {
      setSeeding(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      // TODO: Authentication handled by backend
      const success = await login(values.email, values.password);
      if (success) {
        router.push("/admin");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during authentication.";
      setError(msg);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm relative overflow-hidden">
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="h-10 w-10 bg-secondary flex items-center justify-center rounded-lg border border-border mb-3">
          <Store className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Admin Portal</h2>
        <p className="text-muted-foreground text-xs mt-1">Sign in to manage your e-commerce store</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2 items-start text-destructive text-xs">
          <AlertCircle className="shrink-0 h-4 w-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/75">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="email"
              type="email"
              placeholder="admin@buildcart.com"
              {...register("email")}
              className={`w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm placeholder-muted-foreground/50 outline-none transition-all ${errors.email
                ? "border-destructive focus:ring-1 focus:ring-destructive focus:border-destructive"
                : "border-border focus:ring-1 focus:ring-primary focus:border-primary"
                }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/75">
              <Lock className="h-4 w-4" />
            </span>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm placeholder-muted-foreground/50 outline-none transition-all ${errors.password
                ? "border-destructive focus:ring-1 focus:ring-destructive focus:border-destructive"
                : "border-border focus:ring-1 focus:ring-primary focus:border-primary"
                }`}
            />
          </div>
          {errors.password && (
            <p className="text-[11px] text-destructive font-medium">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-primary text-primary-foreground hover:opacity-90 font-medium rounded-lg text-sm shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {seedStatus && (
        <div className={`mt-4 p-3 border rounded-lg text-xs ${seedStatus.type === "success"
          ? "bg-green-500/10 border-green-500/25 text-green-600 dark:text-green-400"
          : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}>
          {seedStatus.message}
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-border flex flex-col items-center gap-3">
        <div className="text-center w-full flex flex-col items-center">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Demo / Testing Credentials</p>
          <div className="mt-1.5 flex flex-col gap-1 items-center bg-muted/50 border border-border/50 rounded-lg p-2 text-xs font-mono w-full max-w-[280px]">
            <div className="flex justify-between w-full px-1">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground font-medium select-all">admin@admin.com</span>
            </div>
            <div className="flex justify-between w-full px-1 border-t border-border/30 pt-1">
              <span className="text-muted-foreground">Password:</span>
              <span className="text-foreground font-medium select-all">admin</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSeed}
          disabled={seeding}
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1.5 disabled:opacity-50 cursor-pointer select-none"
        >
          {seeding ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Seeding database...
            </>
          ) : (
            "Reset & Seed Database"
          )}
        </button>
      </div>
    </div>
  );
}
export default LoginForm;
