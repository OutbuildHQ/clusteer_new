"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/admin/Toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ToastProvider>
      {/* Sidebar - Renders as overlay on mobile */}
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Layout - Full screen on mobile, flex with sidebar on desktop */}
      <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
        {/* Main Content - Takes full width on mobile, shares space with sidebar on desktop */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Header */}
          <AdminHeader
            onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#FAFAFA]">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
