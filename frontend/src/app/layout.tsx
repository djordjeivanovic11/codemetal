// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Orbitron } from "next/font/google";
import LayoutWrapper from "@/components/Layout/LayoutWrapper";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lantern - LoRa Mesh Network",
  description: "Lantern: LoRa-based Advanced Network for Tactical Edge Resilient Nodes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} antialiased bg-background text-typography`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
