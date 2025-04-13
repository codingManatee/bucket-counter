"use client";
import Controller from "@/components/controller";
import Dashboard from "@/components/dashboard";
import Header from "@/components/header";
import Logger from "@/components/logger";

export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 ">
        <Logger />
        <Controller />
        <Dashboard />
      </div>
    </div>
  );
}
