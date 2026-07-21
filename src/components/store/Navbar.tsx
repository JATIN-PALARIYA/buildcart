"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "./SearchModal";
import { getCategories } from "@/lib/api/category";
import { Category } from "@/lib/types/category";

interface NavbarProps {
  onCartOpen: () => void;
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories dynamically from backend
  useEffect(() => {
    async function loadNavbarCategories() {
      try {
        // TODO: Categories API
        const fetched = await getCategories();
        setCategories(fetched);
      } catch (error) {
        console.error("Failed to fetch navbar categories:", error);
      }
    }
    loadNavbarCategories();
  }, []);

  // Command palette shortcut ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-all duration-300">
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <span className="h-6.5 w-6.5 rounded-lg bg-foreground text-background font-bold text-base flex items-center justify-center tracking-tight transition-transform duration-300 group-hover:rotate-6">
              B
            </span>
            <span className="font-bold text-base tracking-tight text-foreground">
              Build<span className="text-muted-foreground font-normal">Cart</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Categories Dropdown Trigger */}
            {categories.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                  onBlur={() => setTimeout(() => setCategoriesDropdownOpen(false), 200)}
                  className="text-xs font-semibold tracking-wide text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  Categories
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${categoriesDropdownOpen ? "rotate-180 text-foreground" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2.5 min-w-[230px] rounded-xl bg-card border border-border/80 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-md">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase px-3 py-1 border-b border-border/40 mb-1">
                      Browse Categories
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-0.5 custom-scrollbar">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
                        >
                          <span>{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Shop Search Shortcut */}
          <button
            onClick={() => setSearchOpen(true)}
            className="group flex items-center justify-between gap-3 w-36 sm:w-60 md:w-72 lg:w-80 px-3.5 py-2 rounded-full border border-border/70 bg-secondary/20 hover:bg-secondary/50 text-muted-foreground hover:text-foreground text-xs transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring/40 shadow-xs"
            title="Search Products"
            aria-label="Search products"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="h-4 w-4 text-muted-foreground/85 shrink-0" />
              <span className="hidden sm:inline text-xs font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors truncate">Search products, gear, category...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted border border-border text-[9px] font-bold text-muted-foreground/80 leading-none select-none shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggler */}
          <ThemeToggle />

          {/* Cart Icon Trigger */}
          <button
            onClick={onCartOpen}
            className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary border border-border/30 hover:border-border/80 text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center justify-center relative cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring/40"
            aria-label="Open Cart"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[9px] font-bold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center border-2 border-background tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-card py-4.5 px-4 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className={`text-sm font-semibold px-2 py-1.5 rounded-lg hover:bg-secondary/40 ${
                  pathname === link.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {categories.length > 0 && (
              <div className="border-t border-border/40 my-1 pt-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground px-2">
                  Categories
                </span>
                <div className="flex flex-col gap-2 mt-2 pl-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={closeMobileMenu}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
