import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Panel({
  kicker,
  live,
  extra,
  children,
  className,
}: {
  kicker: string;
  live?: boolean;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-line bg-paper p-3 sm:p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="kicker">{kicker}</p>
        <span className="flex items-center gap-2">
          {extra}
          {live ? (
            <span className="flex items-center gap-1.5 font-mono text-micro text-power">
              <i className="live-dot" /> live
            </span>
          ) : null}
        </span>
      </div>
      {children}
    </section>
  );
}
