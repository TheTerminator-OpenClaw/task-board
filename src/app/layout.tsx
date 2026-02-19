import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Board - Terminator",
  description: "Task board for tracking work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-900 text-white px-6 py-3 flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">Task Board</Link>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-blue-300">Tasks</Link>
            <Link href="/calendar" className="hover:text-blue-300">Calendar</Link>
            <Link href="/team" className="hover:text-blue-300">Team</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
