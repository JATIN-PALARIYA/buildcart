"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/contexts/AdminContext";
import LoginForm from "@/components/admin/auth/LoginForm";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdmin();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  );
}
