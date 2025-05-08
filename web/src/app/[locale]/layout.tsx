import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import { Metadata } from "next";
import Header from "@/components/layout/header";
import ClientShiftReset from "@/components/layout/ClientShiftReset";
import { NextIntlClientProvider } from "next-intl";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-dvh h-max-dvh overflow-hidden`}
      >
        <NextIntlClientProvider>
          <ClientShiftReset />
          <Header />
          <main className="flex-1 bg-gray-100 overflow-hidden ">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
