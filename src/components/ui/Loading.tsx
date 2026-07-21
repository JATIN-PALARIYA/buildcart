import React from "react";

interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
}

export function Loading({ label = "Authenticating...", fullScreen = true }: LoadingProps) {
  const containerClass = fullScreen
    ? "flex h-screen items-center justify-center bg-background text-foreground"
    : "flex py-12 items-center justify-center text-foreground";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="text-sm font-medium tracking-wide text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
export default Loading;
