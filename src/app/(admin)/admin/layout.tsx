"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { useTheme } from "@/providers/ThemeProvider";
import { AdminSidebar } from "@/components/admin/layouts/AdminSidebar";
import { AdminHeader } from "@/components/admin/layouts/AdminHeader";
import { AdminMobileHeader } from "@/components/admin/layouts/AdminMobileHeader";
import { AdminMobileDrawer } from "@/components/admin/layouts/AdminMobileDrawer";
import { navItems } from "@/components/admin/layouts/navigation";
import Loading from "@/components/ui/Loading";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, adminUser } = useAdmin();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated and not on login page
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, pathname, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If on login page, just render the child component without sidebar shell
  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  // If not authenticated, render loading state
  if (!isAuthenticated) {
    return <Loading label="Authenticating..." />;
  }

  const getPageTitle = () => {
    const item = navItems.find((i) => i.href === pathname);
    return item ? item.name : "Admin Panel";
  };

  return (
    <div className="h-screen overflow-hidden bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar Layout Component */}
      <AdminSidebar
        pathname={pathname}
        navItems={navItems}
        adminUser={adminUser}
        logout={logout}
      />

      {/* Mobile Top Header Component */}
      <AdminMobileHeader
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenMenu={() => setMobileMenuOpen(true)}
      />

      {/* Mobile Sidebar Drawer Navigation Component */}
      <AdminMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        pathname={pathname}
        navItems={navItems}
        adminUser={adminUser}
        logout={logout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Desktop Header Component */}
        <AdminHeader
          pageTitle={getPageTitle()}
          adminUser={adminUser}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Content Viewport Wrapper */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <main className="p-6 md:p-8 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
