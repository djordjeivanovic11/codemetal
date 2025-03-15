"use client";

import React from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema using Zod
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email").min(1, "Email is required"),
  content: z.string().min(10, "Message must be at least 10 characters").max(500, "Message must be under 500 characters"),
});

// Type definition for form data
type ContactFormData = {
  name: string;
  email: string;
  content: string;
};

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log(data);
    // Handle form submission (e.g., API call)
  };

  return (
    <>
      <Head>
        <title>Contact Us | Lantern</title>
        <meta name="description" content="Get in touch with the Lantern team for inquiries, feedback, or support." />
      </Head>

      {/* Fullscreen immersive section */}
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
        style={{
          background: "radial-gradient(circle, rgba(193,255,114,0.2) 20%, rgba(24,24,24,1) 100%)",
          color: "#f7f7f7",
        }}
      >
        {/* Background Glow Effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-[900px] h-[900px] bg-[#c1ff72] rounded-full blur-[200px]"></div>
        </div>

        {/* Contact Form */}
        <div className="relative z-10 w-full max-w-lg bg-[#0e0e0e] rounded-xl shadow-2xl p-10 border border-gray-800">
          <h1 className="text-4xl font-extrabold mb-6 text-[#c1ff72]">Get in Touch</h1>
          <p className="text-lg text-gray-400 mb-8">
            We’d love to hear from you. Fill out the form and we’ll get back to you shortly.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="text-left">
              <label htmlFor="name" className="block text-gray-300 font-medium mb-2">Name</label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#c1ff72] text-white transition"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div className="text-left">
              <label htmlFor="email" className="block text-gray-300 font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#c1ff72] text-white transition"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Message Field */}
            <div className="text-left">
              <label htmlFor="content" className="block text-gray-300 font-medium mb-2">Message</label>
              <textarea
                id="content"
                {...register("content")}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#c1ff72] text-white transition resize-none"
                rows={5}
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 text-lg font-semibold rounded-lg bg-[#c1ff72] text-black transition-all hover:bg-[#d1ff7f] hover:shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
