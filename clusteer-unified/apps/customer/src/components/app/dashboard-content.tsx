"use client";

import { PageTransition } from "@/components/primitives/motion";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
