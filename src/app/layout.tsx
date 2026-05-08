import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uptrix — Enterprise Grade Monitoring Engine",
  description:
    "A comprehensive suite of tools built for speed, accuracy, and reliability. Monitor your online infrastructure from a single & unified dashboard.",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#0a0f0d] text-[#d4e4dc]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
