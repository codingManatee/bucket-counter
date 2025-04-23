import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import { Metadata } from "next";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bucket-Counter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen h-max-screen overflow-hidden`}
      >
        <Header />
        <main className="flex-1 bg-gray-100 overflow-hidden ">{children}</main>
      </body>
    </html>
  );
}
