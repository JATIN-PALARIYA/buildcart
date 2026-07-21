"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

interface StoreLayoutWrapperProps {
  children: React.ReactNode;
}

export function StoreLayoutWrapper({ children }: StoreLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // If navigating to admin panel, do not render storefront header, footer, or cart drawer
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col flex-1 w-full max-w-full overflow-x-hidden bg-background text-foreground transition-colors duration-200">
      <Navbar onCartOpen={() => setIsCartOpen(true)} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
export default StoreLayoutWrapper;
