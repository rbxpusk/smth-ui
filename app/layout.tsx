import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/Toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "smth UI — Component Library",
  description: "Dark material design system built on #876cff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
