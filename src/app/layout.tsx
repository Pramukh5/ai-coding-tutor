import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import './globals.css'

export const metadata: Metadata = {
  title: "AI Coding Tutor",
  description: "A web-based coding tutor that provides personalized hints and solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
