import React from "react";
import Link from "next/link";
import { Store, LogOut, LucideIcon } from "lucide-react";
import { AdminUser } from "@/contexts/AdminContext";

interface SidebarProps {
  pathname: string;
  navItems: Array<{ name: string; href: string; icon: LucideIcon }>;
  adminUser: AdminUser | null;
  logout: () => void;
}

export function AdminSidebar({
  pathname,
  navItems,
  adminUser,
  logout,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border shrink-0 h-full">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
        <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <Store className="h-5 w-5 text-primary" />
          <span>BuildCart Admin</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
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

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border space-y-4 shrink-0 bg-card">
        <div className="px-2">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="text-sm font-medium truncate">{adminUser?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{adminUser?.email}</p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 border border-transparent rounded-lg text-sm font-medium text-foreground transition-all cursor-pointer"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
export default AdminSidebar;
