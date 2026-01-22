"use client";

import { toast } from "react-toastify";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/http/authHttp";
import { useFormValidation } from "@/hooks/useFormValidation";
import { registerSchema } from "@/lib/validation/authValidation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { errors, setFieldError, clearFieldError, setErrors, clearAllErrors } =
    useFormValidation();

  const validateField = (field: keyof typeof formData, value: string) => {
    try {
      registerSchema.shape[field].parse(value);
      clearFieldError(field);
    } catch (err: any) {
      if (err.errors && err.errors[0]) {
        setFieldError(field, err.errors[0].message);
      }
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");
    clearAllErrors();

    // Client-side validation
    try {
      registerSchema.parse(formData);
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
      await authFetch("auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setSuccess(true);
      toast.success("Registration successful!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      if (err.body?.errors) {
        setErrors(err.body.errors);
      } else {
        setGeneralError(err.message || "Failed to register");
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 font-inter">
        <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            Request Submitted
          </h1>
          <p className="text-slate-500 font-medium">
            Your admin registration was successful. You will be redirected to
            the login page shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 font-inter">
      <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 border border-slate-100">
        <div className="flex flex-col gap-2 mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Access
          </h1>
          <p className="text-slate-500 font-medium">
            Register to manage your campsites and bookings
          </p>
        </div>

        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className={`w-full px-5 py-3.5 rounded-2xl border ${
                  errors.fullName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                } bg-slate-50/50 outline-none focus:ring-4 transition-all font-medium`}
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                onBlur={() => validateField("fullName", formData.fullName)}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm ml-1 font-medium">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className={`w-full px-5 py-3.5 rounded-2xl border ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                } bg-slate-50/50 outline-none focus:ring-4 transition-all font-medium`}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => validateField("email", formData.email)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm ml-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                className={`w-full px-5 py-3.5 rounded-2xl border ${
                  errors.phoneNumber
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                } bg-slate-50/50 outline-none focus:ring-4 transition-all font-medium`}
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                onBlur={() =>
                  validateField("phoneNumber", formData.phoneNumber)
                }
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm ml-1 font-medium">
                  {errors.phoneNumber}
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
                className={`w-full px-5 py-3.5 rounded-2xl border ${
                  errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                } bg-slate-50/50 outline-none focus:ring-4 transition-all font-medium`}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => validateField("password", formData.password)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm ml-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-70"
          >
            {loading ? "Processing..." : "Register Admin"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-bold hover:text-blue-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
