"use client";

import React, { useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "@/api/auth/route";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login({
        username: data.email, // backend expects email as username
        password: data.password,
      });

      localStorage.setItem("token", response.access_token);

      console.log("Authenticated successfully:", response);

      // Redirect to dashboard on successful login
      router.push("/dashboard");
    } catch (error) {
      console.error("Authentication failed:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <>
      <Head>
        <title>Secure Access | Lantern</title>
        <meta name="description" content="Restricted access. Authorized personnel only." />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="relative z-10 w-full max-w-md bg-[#0e0e0e] p-8 shadow-2xl border border-gray-800">
          <h1 className="text-4xl font-extrabold text-[#c1ff72] mb-6 tracking-wide">
            Secure Access
          </h1>
          <p className="text-gray-400 mb-6 text-lg uppercase tracking-widest">
            Authorized Users Only
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="text-left">
              <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:ring-2 text-white transition placeholder-gray-500 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-[#c1ff72]"
                }`}
                placeholder="Enter your email"
                autoComplete="off"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field with Toggle */}
            <div className="text-left relative">
              <label htmlFor="password" className="block text-gray-300 font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:ring-2 text-white transition placeholder-gray-500 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-[#c1ff72]"
                }`}
                placeholder="Enter your password"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold rounded-lg bg-[#c1ff72] text-black transition-all hover:bg-[#d1ff7f] hover:shadow-lg tracking-wide"
            >
              Authenticate
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
