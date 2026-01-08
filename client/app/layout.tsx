import { Inter } from "next/font/google"; // Correct import
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { ToastProvider } from "@/components/ui/ToastProvider";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Growthory | AI-Powered Startup Ecosystem",
  description: "Connect with founders, investors, and top talent using AI intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <Layout>{children}</Layout>
        </ToastProvider>
      </body>
    </html>
  );
}
