import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import EmployeeDetails from "@/pages/details";
import PhotoResult from "@/pages/photo-result";
import SalaryGraph from "@/pages/graph";
import CityMap from "@/pages/map";
import NotFound from "@/pages/not-found";

// Simple auth guard wrapper
function PrivateRoute({ component: Component, ...rest }: any) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Protected Routes */}
      <Route path="/">
        {() => <PrivateRoute component={Dashboard} />}
      </Route>
      
      <Route path="/employee/:id">
        {() => <PrivateRoute component={EmployeeDetails} />}
      </Route>
      
      <Route path="/photo">
        {() => <PrivateRoute component={PhotoResult} />}
      </Route>
      
      <Route path="/graph">
        {() => <PrivateRoute component={SalaryGraph} />}
      </Route>
      
      <Route path="/map">
        {() => <PrivateRoute component={CityMap} />}
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
