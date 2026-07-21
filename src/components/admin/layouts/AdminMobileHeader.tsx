import React from "react";
import Link from "next/link";
import { Store, Sun, Moon, Menu } from "lucide-react";

interface MobileHeaderProps {
  theme: string;
  toggleTheme: () => void;
  onOpenMenu: () => void;
}

export function AdminMobileHeader({ theme, toggleTheme, onOpenMenu }: MobileHeaderProps) {
  return (
    <div className="md:hidden bg-card border-b border-border h-16 flex items-center justify-between px-4 z-40 sticky top-0 shrink-0">
      <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
        <Store className="h-5 w-5 text-primary" />
        <span>BuildCart Admin</span>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={onOpenMenu}
          className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
}
export default AdminMobileHeader;
