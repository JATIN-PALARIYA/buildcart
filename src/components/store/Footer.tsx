"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Twitter, Github, Linkedin, Mail, ExternalLink, ChevronDown } from "lucide-react";
import { getCategories } from "@/lib/api/category";
import { Category } from "@/lib/types/category";

export function Footer() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Click outside listener to close custom category menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load categories dynamically from backend
  useEffect(() => {
    async function loadFooterCategories() {
      try {
        const fetched = await getCategories();
        setCategories(fetched);
      } catch (error) {
        console.error("Failed to fetch footer categories:", error);
      }
    }
    loadFooterCategories();
  }, []);

  return (
    <footer className="bg-secondary/20 border-t border-border/40 mt-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 sm:mb-6">

        {/* Brand Information */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group focus:outline-none">
            <span className="h-6 w-6 rounded-lg bg-foreground text-background font-bold text-sm flex items-center justify-center tracking-tight transition-transform duration-300 group-hover:rotate-6">
              B
            </span>
            <span className="font-bold text-sm tracking-tight text-foreground">
              Build<span className="text-muted-foreground font-normal">Cart</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Crafting premium workspace peripherals, acoustic speakers, and smart lighting systems for developers, designers, and thinkers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4">
            Navigation
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
              >
                Admin Panel
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories Quicklinks */}
        <div>
          <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4">
            Categories
          </h4>
          <ul className="space-y-2">
            {categories.slice(0, 4).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            {categories.length > 4 && (
              <li className="relative inline-flex items-center gap-1" ref={dropdownRef}>
                <Link
                  href={`/products?category=${categories[4]?.slug}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {categories[4]?.name}
                </Link>
                {categories.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none p-0.5"
                    aria-label="Toggle extra categories"
                  >
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-foreground" : ""}`} />
                  </button>
                )}

                {isDropdownOpen && categories.length > 5 && (
                  <div className="absolute left-0 bottom-full mb-2 w-56 bg-card border border-border/80 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase px-2.5 py-1 border-b border-border/40 mb-1">
                      More Categories
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar">
                      {categories.slice(5).map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            router.push(`/products?category=${cat.slug}`);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors flex items-center justify-between cursor-pointer group"
                        >
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* Contacts & Social Links */}
        <div>
          <h4 className="text-xs font-semibold text-foreground tracking-wider uppercase mb-4">
            Connect
          </h4>
          <ul className="space-y-2 mb-4">
            <li className="text-xs text-muted-foreground flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <span>support@buildcart.dev</span>
            </li>
            <li className="text-xs text-muted-foreground">
              <span>Uttarakhand, India</span>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              aria-label="Twitter Account"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://github.com/Jatin-Palariya"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              aria-label="GitHub Account"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto pt-4 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-muted-foreground">
          &copy; {currentYear} BuildCart. All rights reserved. Made for e-commerce demo.
        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
