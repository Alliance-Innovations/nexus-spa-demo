"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNexus } from "@/hooks/useNexus";
import { ClientOnly } from "./ClientOnly";

export function Navigation() {
  const pathname = usePathname();
  const { trackEvent } = useNexus();

  const handleNavClick = (page: string) => {
    trackEvent("navigation", {
      from: pathname,
      to: page,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });
  };

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/products", label: "Products", icon: "🛍️" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/cart", label: "Cart", icon: "🛒" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">Nexus Demo</span>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <ClientOnly fallback={
              navItems.map((item) => (
                <div
                  key={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))
            }>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </ClientOnly>
          </div>
        </div>
      </div>
    </nav>
  );
}
