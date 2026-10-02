import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Crosshair,
  LayoutGrid,
  Menu,
  Network,
  ScrollText,
  Shield,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ClockBar } from "@/components/sim/ClockBar";
import { DeviceDrawer } from "@/components/sim/DeviceDrawer";
import { cn } from "@/lib/utils";
import { bindEngineToStore, useSimStore } from "@/store/simulation-store";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/topology", label: "Campus Topology", icon: Network },
  { to: "/security", label: "Security Monitoring", icon: Shield },
  { to: "/attack", label: "Attack Simulation", icon: Crosshair },
  { to: "/analytics", label: "Network Analytics", icon: Activity },
  { to: "/logs", label: "Logs & Events", icon: ScrollText },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-150",
              active ? "bg-accent/15 text-accent" : "text-muted hover:bg-elevated hover:text-fg",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const mobileOpen = useSimStore((s) => s.mobileNavOpen);
  const setMobile = useSimStore((s) => s.setMobileNavOpen);

  useEffect(() => bindEngineToStore(), []);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="hidden border-r border-border bg-surface lg:flex lg:flex-col">
        <div className="px-5 pt-6 pb-5">
          <p className="kicker">Smart Pod HZCN</p>
          <h1 className="mt-2 text-lg font-medium tracking-tight">Control center</h1>
          <p className="mt-1 text-xs text-muted">Hybrid Zoned Campus Network</p>
        </div>
        <div className="px-3">
          <NavLinks />
        </div>
        <div className="mt-auto px-5 py-5">
          <p className="text-[0.7rem] leading-relaxed text-subtle">
            Software simulation only. No live campus traffic, packet capture, or physical Smart Pods.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-sm">
          <div className="flex flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <Button
                size="icon"
                variant="outline"
                className="lg:hidden"
                onClick={() => setMobile(true)}
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </Button>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">Smart Pod HZCN</p>
                  <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.14em] text-accent uppercase">
                    Simulation mode
                  </span>
                </div>
                <p className="text-xs text-muted">HZCN simulation · not live network monitoring</p>
              </div>
            </div>
            <ClockBar />
          </div>
        </header>
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6">{children}</main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobile}>
        <SheetContent side="left" title="Smart Pod HZCN">
          <div className="p-3">
            <NavLinks onNavigate={() => setMobile(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <DeviceDrawer />
    </div>
  );
}
