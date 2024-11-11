"use client";

import { MultiStepForm } from "@/components/MultiStepForm/MultiStepForm";
import { Header } from "@/components/Header";
import { EventLog } from "@/components/EventLog";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <Header />
      <div className="max-w-8xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MultiStepForm />
        <EventLog />
      </div>
    </main>
  );
}
