"use client";

import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000); // Reset after 5s
    }
  };

  if (subscribed) {
    return (
      <div className="max-w-md mx-auto p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-200">
        <Check className="h-4 w-4" />
        Thank you for subscribing! Check your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="grow px-4 py-2.5 rounded-xl border border-border/80 bg-background text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/50 text-foreground"
      />
      <button
        type="submit"
        className="group px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
      >
        Subscribe
        <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
    </form>
  );
}
export default NewsletterForm;
