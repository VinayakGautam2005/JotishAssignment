import { useState } from "react";
import { useLogin } from "@/hooks/use-employees";
import { Loader2, ArrowRight } from "lucide-react";
import { api } from "@shared/routes";
import { cn } from "@/lib/utils";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Quick validation
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await loginMutation.mutateAsync({ username, password });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl shadow-xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 p-8 text-center border-b border-border/50">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 overflow-hidden shadow-lg shadow-primary/10">
              <img src="/favicon.png" alt="Jotish Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground">Welcome to Jotish</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage your team</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="testuser"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent",
                    "focus:bg-background focus:border-primary focus:outline-none transition-all duration-200",
                    "placeholder:text-muted-foreground/50 font-medium"
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent",
                    "focus:bg-background focus:border-primary focus:outline-none transition-all duration-200",
                    "placeholder:text-muted-foreground/50 font-medium"
                  )}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-semibold text-primary-foreground shadow-lg shadow-primary/20",
                    "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
                    "transform hover:-translate-y-0.5 transition-all duration-200",
                    "flex items-center justify-center gap-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  )}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Use username: <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">testuser</span> password: <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">Test123</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
