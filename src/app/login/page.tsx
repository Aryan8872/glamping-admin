"use client";

import { toast } from "react-toastify";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/http/authHttp";
import { useAuth } from "@/hooks/useAuth";
import { useFormValidation } from "@/hooks/useFormValidation";
import { loginSchema } from "@/lib/validation/authValidation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();
  const { checkAuth } = useAuth();
  const { errors, setFieldError, clearFieldError, setErrors, clearAllErrors } =
    useFormValidation();

  const validateField = (field: "email" | "password", value: string) => {
    try {
      if (field === "email") {
        loginSchema.shape.email.parse(value);
      } else {
        loginSchema.shape.password.parse(value);
      }
      clearFieldError(field);
    } catch (err: any) {
      if (err.errors && err.errors[0]) {
        setFieldError(field, err.errors[0].message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");
    clearAllErrors();

    // Client-side validation
    try {
      loginSchema.parse({ email, password });
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors = err.errors.map((e: any) => ({
          field: e.path[0],
          message: e.message,
        }));
        setErrors(fieldErrors);
      }
      setLoading(false);
      return;
    }

    try {
      await authFetch("auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await checkAuth();
      toast.success("Logged in successfully");
      router.push("/");
    } catch (err: any) {
      // Handle backend validation errors
      if (err.body?.errors) {
        setErrors(err.body.errors);
      } else {
        setGeneralError(
          err.message || "Failed to login. Please check your credentials.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 font-inter">
      <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 border border-slate-100">
        <div className="flex flex-col gap-2 mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-500 font-medium">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="admin@campora.com"
              className={`w-full px-5 py-4 rounded-2xl border ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
              } bg-slate-50/50 outline-none focus:ring-4 transition-all font-medium text-slate-900`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              onBlur={() => validateField("email", email)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm ml-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className={`w-full px-5 py-4 rounded-2xl border ${
                errors.password
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
              } bg-slate-50/50 outline-none focus:ring-4 transition-all font-medium text-slate-900`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
              onBlur={() => validateField("password", password)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm ml-1 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
