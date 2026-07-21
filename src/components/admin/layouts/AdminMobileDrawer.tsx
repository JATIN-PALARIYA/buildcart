import React from "react";
import Link from "next/link";
import { Store, X, LogOut, LucideIcon } from "lucide-react";
import { AdminUser } from "@/contexts/AdminContext";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  navItems: Array<{ name: string; href: string; icon: LucideIcon }>;
  adminUser: AdminUser | null;
  logout: () => void;
}

export function AdminMobileDrawer({
  isOpen,
  onClose,
  pathname,
  navItems,
  adminUser,
  logout,
}: MobileDrawerProps) {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <span className="flex items-center gap-2 font-semibold tracking-tight">
            <Store className="h-5 w-5 text-primary" />
            <span>BuildCart Admin</span>
          </span>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Close Mobile Menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="py-6 px-4 space-y-1 overflow-y-auto h-[calc(100%-16rem)] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                    ? "bg-secondary text-secondary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
              >
                <Icon size={18} className={isActive ? "text-foreground" : "text-muted-foreground"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border absolute bottom-0 left-0 right-0 bg-card">
          <div className="mb-4 px-2">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="text-sm font-medium">{adminUser?.name}</p>
            <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-destructive/10 hover:text-destructive border border-transparent rounded-lg text-sm font-medium text-foreground transition-all cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
export default AdminMobileDrawer;
