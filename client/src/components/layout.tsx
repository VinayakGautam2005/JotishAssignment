import { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { LogOut, LayoutGrid, BarChart3, Map as MapIcon, ChevronLeft } from "lucide-react";
import { useLogout } from "@/hooks/use-employees";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

export function Layout({ children, title, showBack = false }: LayoutProps) {
  const [location] = useLocation();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row font-sans text-foreground">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-background border-r border-border h-screen sticky top-0 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/favicon.png" alt="Jotish Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight">Jotish</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem href="/" icon={<LayoutGrid size={20} />} active={location === "/"}>
            Dashboard
          </NavItem>
          <NavItem href="/graph" icon={<BarChart3 size={20} />} active={location === "/graph"}>
            Analytics
          </NavItem>
          <NavItem href="/map" icon={<MapIcon size={20} />} active={location === "/map"}>
            Geo Map
          </NavItem>
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-background border-b border-border p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {showBack && (
            <Link href="/" className="p-2 -ml-2 mr-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft size={24} />
            </Link>
          )}
          <span className="font-bold font-display text-lg">Jotish</span>
        </div>
        <button onClick={logout} className="p-2 text-muted-foreground">
          <LogOut size={20} />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <header className="mb-8 flex items-center justify-between">
          <div>
            {showBack && (
              <Link href="/" className="hidden md:inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-2 transition-colors">
                <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
              </Link>
            )}
            {title && (
              <h2 className="text-3xl font-bold font-display text-foreground tracking-tight">{title}</h2>
            )}
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-3 z-50 pb-safe">
        <MobileNavItem href="/" icon={<LayoutGrid size={24} />} active={location === "/"} />
        <MobileNavItem href="/graph" icon={<BarChart3 size={24} />} active={location === "/graph"} />
        <MobileNavItem href="/map" icon={<MapIcon size={24} />} active={location === "/map"} />
      </div>
    </div>
  );
}

function NavItem({ href, icon, children, active }: { href: string; icon: ReactNode; children: ReactNode; active: boolean }) {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
      active
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}>
      {icon}
      <span>{children}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
    </Link>
  );
}

function MobileNavItem({ href, icon, active }: { href: string; icon: ReactNode; active: boolean }) {
  return (
    <Link href={href} className={cn(
      "p-3 rounded-xl transition-colors",
      active ? "text-primary bg-primary/10" : "text-muted-foreground"
    )}>
      {icon}
    </Link>
  );
}
