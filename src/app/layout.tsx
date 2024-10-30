import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./layout/AuthLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoreApp - idSmartCare",
  description: "CoreApp - idSmartCare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} data-theme="light">
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
