import React from "react";
import { ShieldCheck, Cpu, Truck, Laptop } from "lucide-react";

export function BoutiquePhilosophy() {
  return (
    <section className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-border/30 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
          Boutique Philosophy
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
          Crafted with Purpose
        </h2>
      </div>
      <div className="bg-secondary/20 dark:bg-secondary/10 border border-border/40 rounded-3xl py-12 px-6 sm:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-background border border-border/80 flex items-center justify-center text-muted-foreground">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Premium Sourcing
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We construct using 100% genuine merino wool, solid walnut hardwood, and aerospace CNC-grade aluminum.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-background border border-border/80 flex items-center justify-center text-muted-foreground">
            <Cpu className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Precision Tooling
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Machined rotary dials and hot-swappable key layouts tailored for maximum typing satisfaction.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-background border border-border/80 flex items-center justify-center text-muted-foreground">
            <Truck className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Complimentary Shipping
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All items in our boutique catalog qualify for free global delivery. No hidden taxes or calculations.
          </p>
        </div>

        <div className="space-y-3">
          <div className="w-9 h-9 rounded-xl bg-background border border-border/80 flex items-center justify-center text-muted-foreground">
            <Laptop className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Minimal Aesthetics
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Designed to look clean, mature, and clutter-free on any workspace, omitting flashy gamer lighting.
          </p>
        </div>

      </div>
    </section>
  );
}
export default BoutiquePhilosophy;
