import { useEmployees } from "@/hooks/use-employees";
import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import {
  Users,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Search,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: employees, isLoading, error } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <Layout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-secondary/50" />
          ))}
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard">
        <div className="p-8 rounded-2xl bg-destructive/5 border border-destructive/20 text-center">
          <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load data</h3>
          <p className="text-muted-foreground">Please try refreshing the page or logging in again.</p>
        </div>
      </Layout>
    );
  }

  const filteredEmployees = employees?.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Dashboard">
      {/* Search and Filters */}
      <div className="mb-8 relative">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, role, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-white shadow-sm",
              "focus:ring-4 focus:ring-primary/10 focus:border-primary focus:outline-none transition-all duration-200"
            )}
          />
        </div>
      </div>

      {/* Stats Cards - Optional visual flair */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="text-muted-foreground text-sm font-medium mb-1">Total Staff</div>
          <div className="text-3xl font-bold text-foreground font-display">{employees?.length || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="text-muted-foreground text-sm font-medium mb-1">Cities</div>
          <div className="text-3xl font-bold text-foreground font-display">
            {new Set(employees?.map(e => e.city)).size}
          </div>
        </div>
        <Link href="/graph" className="group bg-gradient-to-br from-primary to-yellow-600 p-6 rounded-2xl shadow-lg shadow-primary/25 text-primary-foreground relative overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="relative z-10">
            <div className="text-primary-foreground/80 text-sm font-medium mb-1">Analytics</div>
            <div className="text-xl font-bold font-display flex items-center gap-2">
              View Graph <ArrowUpRight size={20} />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Users size={100} />
          </div>
        </Link>
        <Link href="/map" className="group bg-gradient-to-br from-primary to-yellow-600 p-6 rounded-2xl shadow-lg shadow-black/25 text-primary-foreground relative overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="relative z-10">
            <div className="text-primary-foreground/80 text-sm font-medium mb-1">Locations</div>
            <div className="text-xl font-bold font-display flex items-center gap-2">
              View Map <MapPin size={20} />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <MapPin size={100} />
          </div>
        </Link>
      </div>

      {/* Employee List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees?.map((employee, idx) => (
          <div
            key={employee.employeeId}
            onClick={() => setLocation(`/employee/${employee.employeeId}`)}
            className="group bg-white rounded-2xl p-6 border-b-2 border-b-transparent border-x border-t border-border shadow-sm hover:shadow-xl hover:border-primary/40 hover:border-b-primary hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-lg font-bold text-foreground font-display group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {employee.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                ID: {employee.employeeId}
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground font-display mb-1 group-hover:text-primary transition-colors">
              {employee.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{employee.role}</p>

            <div className="space-y-2.5">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin size={16} className="mr-2 text-primary/70" />
                {employee.city}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={16} className="mr-2 text-primary/70" />
                Joined: {employee.startDate}
              </div>
              <div className="flex items-center text-sm font-medium text-foreground">
                <DollarSign size={16} className="mr-2 text-primary" />
                {employee.salary}
              </div>
            </div>

            <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        ))}

        {filteredEmployees?.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No employees found matching "{searchTerm}"
          </div>
        )}
      </div>
    </Layout>
  );
}
