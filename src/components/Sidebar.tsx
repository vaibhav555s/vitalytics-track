import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plus, 
  Calendar, 
  FileText, 
  UserPlus, 
  Settings as SettingsIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Add Reading", href: "/add-reading", icon: Plus },
  { name: "Timeline", href: "/timeline", icon: Calendar },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Doctor Connect", href: "/doctor-connect", icon: UserPlus },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r bg-card/50 backdrop-blur-sm">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
