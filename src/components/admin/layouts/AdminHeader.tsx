import React from "react";
import { AdminUser } from "@/contexts/AdminContext";
import { Sun, Moon } from "lucide-react";

interface HeaderProps {
  pageTitle: string;
  adminUser: AdminUser | null;
  theme: string;
  toggleTheme: () => void;
}

export function AdminHeader({ pageTitle, adminUser, theme, toggleTheme }: HeaderProps) {
  return (
    <header className="hidden md:flex h-16 bg-card border-b border-border items-center justify-between px-8 z-30 shrink-0">
      <h1 className="text-base font-semibold text-foreground tracking-tight">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Separator Divider */}
        <div className="h-6 w-px bg-border shrink-0" />

        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-foreground">{adminUser?.name}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{adminUser?.role}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground uppercase border border-border">
            {adminUser?.name?.charAt(0) || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
export default AdminHeader;
