import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heien | Architect of Infrastructure & Self-Made Developer",
  description: "From Business Administration to Full-Stack Developer. Building enterprise infrastructure at BISO, coding 10+ hours daily. Explore 70+ repositories and real-time coding stats.",
  keywords: ["developer", "full-stack", "infrastructure", "Next.js", "Flutter", "TypeScript", "portfolio"],
  authors: [{ name: "Heien" }],
  openGraph: {
    title: "Heien | Architect of Infrastructure",
    description: "Self-taught developer who traded spreadsheets for source code. Building infrastructure that scales.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
