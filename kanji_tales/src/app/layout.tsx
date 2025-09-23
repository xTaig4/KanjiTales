import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanji Tales",
  description: "A storytelling app for learning Kanji",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="w-full h-full m-0 p-0">
        {/* Sidebar + main content */}
        <div className="flex min-h-screen w-full">
          {/* Nav rail / sidebar */}
          {/* Using dynamic import not needed yet; simple direct import */}
          <Sidebar />
          {/* Main content area - takes remaining width and centers content */}
          <main className="flex-1 flex items-center justify-center">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
