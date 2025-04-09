"use client";
import Controller from "@/components/controller";
import Header from "@/components/header";
import Logger from "@/components/logger";

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header />

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 h-screen ">
          {/* Left side - Log */}
          <Logger />
          {/* Right side - Controls */}
          <Controller />
        </div>
      </div>
      );
    </main>
  );
}
