import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import ConfirmationPopup from "@/components/ConfirmationPopup";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import AuthWrapper from "@/components/auth/AuthWrapper";
import LayoutContent from "@/components/layout/LayoutContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  display: "swap",
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mono = Montserrat({
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Campora Admin",
  description: "Admin panel for Campora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mono.variable} ${geistMono.variable} font-montserrat scrollbar-hidden antialiased bg-primary-bg`}
      >
        <NextTopLoader
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
          zIndex={1600}
          showAtBottom={false}
        />

        <AuthWrapper>
          <LayoutContent>{children}</LayoutContent>
        </AuthWrapper>

        <ConfirmationPopup />
        <ToastContainer position="bottom-right" theme="light" />
      </body>
    </html>
  );
}
