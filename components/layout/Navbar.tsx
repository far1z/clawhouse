"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isRoom = pathname?.startsWith("/room");

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 border-b border-border-subtle",
        "bg-bg-primary/80 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 relative">
            <img src="/logo.svg" alt="Clawhouse" className="w-8 h-8" />
          </div>
          <span className="text-lg font-bold text-text-primary group-hover:text-coral transition-colors">
            Clawhouse
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!isRoom && (
            <Link
              href="/hallway"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                pathname === "/hallway"
                  ? "bg-coral text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-surface"
              )}
            >
              Hallway
            </Link>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
            <span className="text-xs text-text-muted">Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
