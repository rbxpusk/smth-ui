import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/Toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "smth UI — Component Library",
  description: "Dark material design system built on #876cff",
  metadataBase: new URL("https://ui.puskevit.com"),
  icons: {
    icon: "/download.png",
  },
  openGraph: {
    title: "smth UI — Component Library",
    description: "Dark material design system built on #876cff",
    url: "https://ui.puskevit.com",
    siteName: "smth UI",
    images: [
      {
        url: "/download.png",
        width: 1200,
        height: 630,
        alt: "smth UI — Component Library",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "smth UI — Component Library",
    description: "Dark material design system built on #876cff",
    images: ["/download.png"],
  },
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
