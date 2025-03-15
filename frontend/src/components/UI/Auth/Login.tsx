"use client";

import React from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Define Zod schema for form validation
const loginSchema = z.object({
  agentId: z.string().min(3, "Agent ID is required"),
  accessKey: z.string().min(6, "Access Key must be at least 6 characters"),
});

// ✅ Define TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Authenticated:", data);
    // 🔒 Handle authentication (e.g., API request)
  };

  return (
    <>
      <Head>
        <title>Secure Access | Lantern</title>
        <meta name="description" content="Restricted access. Authorized personnel only." />
      </Head>

      {/* Fullscreen Background */}
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      >

        {/* Login Form Container */}
        <div className="relative z-10 w-full max-w-md bg-[#0e0e0e] p-8 shadow-2xl border border-gray-800">
          <h1 className="text-4xl font-extrabold text-[#c1ff72] mb-6 tracking-wide">
            Secure Access
          </h1>
          <p className="text-gray-400 mb-6 text-lg uppercase tracking-widest">
            Authorized Users Only
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Agent ID Field */}
            <div className="text-left">
              <label htmlFor="agentId" className="block text-gray-300 font-medium mb-2">
                Agent ID
              </label>
              <input
                id="agentId"
                type="text"
                {...register("agentId")}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:ring-2 text-white transition placeholder-gray-500 ${
                  errors.agentId ? "border-red-500 focus:ring-red-500" : "focus:ring-[#c1ff72]"
                }`}
                placeholder="Enter your ID"
                autoComplete="off"
              />
              {errors.agentId && <p className="text-red-500 text-sm mt-1">{errors.agentId.message}</p>}
            </div>

            {/* Access Key Field */}
            <div className="text-left">
              <label htmlFor="accessKey" className="block text-gray-300 font-medium mb-2">
                Access Key
              </label>
              <input
                id="accessKey"
                type="password"
                {...register("accessKey")}
                className={`w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:ring-2 text-white transition placeholder-gray-500 ${
                  errors.accessKey ? "border-red-500 focus:ring-red-500" : "focus:ring-[#c1ff72]"
                }`}
                placeholder="Enter your access key"
              />
              {errors.accessKey && <p className="text-red-500 text-sm mt-1">{errors.accessKey.message}</p>}
            </div>

            {/* Submit Button */}
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
