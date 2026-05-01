import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AccentProvider } from "@/components/AccentProvider";
import { Sidebar } from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "AuraFinance",
  description: "AI-powered premium budgeting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full flex antialiased">
        <AccentProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </AccentProvider>
      </body>
    </html>
  );
}
