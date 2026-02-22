import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type Employee } from "@shared/routes";
import { useLocation } from "wouter";

// ============================================
// Auth & Employee Hooks
// ============================================

export function useLogin() {
  const [, setLocation] = useLocation();
  
  return useMutation({
    mutationFn: async (credentials: typeof api.auth.login.input._type) => {
      // In a real app, we'd use api.auth.login.path
      // For this assignment, we are mocking the success to redirect
      // or actually hitting the endpoint if the backend is ready.
      // Given the prompt, let's implement the fetch.
      
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid username or password");
        throw new Error("Login failed");
      }

      return await res.json();
    },
    onSuccess: () => {
      // Simple client-side session simulation
      localStorage.setItem("isAuthenticated", "true");
      setLocation("/");
    },
  });
}

export function useEmployees() {
  return useQuery({
    queryKey: [api.employees.list.path],
    queryFn: async () => {
      // Check auth (simple check for this assignment)
      if (!localStorage.getItem("isAuthenticated")) {
        throw new Error("Unauthorized");
      }

      const res = await fetch(api.employees.list.path);
      if (!res.ok) throw new Error("Failed to fetch employees");
      
      const data = await res.json();
      // Validate with Zod
      return api.employees.list.responses[200].parse(data);
    },
    // Keep data fresh but don't refetch constantly for this demo
    staleTime: 5 * 60 * 1000, 
  });
}

export function useEmployee(id: string) {
  // Since we don't have a single GET endpoint in the provided API spec for one employee,
  // we derive it from the list. Ideally, we'd have a specific endpoint.
  const { data: employees, isLoading, error } = useEmployees();
  
  const employee = employees?.find(e => e.employeeId === id || e.employeeId === String(id));
  
  return { employee, isLoading, error };
}

export function useLogout() {
  const [, setLocation] = useLocation();
  return () => {
    localStorage.removeItem("isAuthenticated");
    setLocation("/login");
  };
}
