"use client";

import { MultiStepForm } from "@/components/MultiStepForm/MultiStepForm";
import { EventLog } from "@/components/EventLog";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Nexus Analytics Demo</h1>
          <p className="text-gray-600 mt-2">Test your analytics script integration with this comprehensive SPA</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MultiStepForm />
          <EventLog />
        </div>
      </div>
    </main>
  );
}
