import { BarChart2 } from 'lucide-react';

export function Header() {
  return (
    <header className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 justify-center">
        <BarChart2 className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold">Analytics Platform Demo</h1>
      </div>
      <p className="mt-2 text-gray-600 text-center">Experience real-time analytics event tracking</p>
    </header>
  );
}