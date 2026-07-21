import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-radial from-secondary/40 via-background to-background pt-10 pb-12 lg:pt-14 lg:pb-16 border-b border-border/25">
      <div className="max-w-6xl 2xl:max-w-350 mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-left duration-700">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground text-xxs font-bold uppercase tracking-wider border border-border/80">
            Boutique Hardware
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Refined Tools for the Modern Developer.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Sustainably crafted mechanical keyboards, high-fidelity audio monitors, and ambient lightbars engineered to optimize focus and elevate your desktop aesthetic.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-xs font-bold text-background shadow-md hover:bg-foreground/95 transition-all cursor-pointer group"
            >
              Explore Gear
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/products?category=accessories"
              className="flex items-center justify-center rounded-xl bg-secondary/50 border border-border px-6 py-3 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Browse Accessories
            </Link>
          </div>
        </div>

        {/* Right Graphic/Image Banner */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border shadow-xl dark:shadow-2xl/40 animate-in fade-in slide-in-from-right duration-700">
          <Image
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Tech and Hardware Workspace Setup"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
export default Hero;
