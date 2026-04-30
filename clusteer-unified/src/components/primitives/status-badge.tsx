"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "completed" | "success" | "approved" | "active" | "processing" | "pending" | "failed" | "cancelled" | "rejected" | "suspended" | "closed" | "unverified";

const STATUS_MAP: Record<string, { label: string; variant: string; className?: string }> = {
  // Success states
  completed: { label: "Completed", variant: "default", className: "bg-success/10 text-success border-success/20 hover:bg-success/15" },
  success: { label: "Success", variant: "default", className: "bg-success/10 text-success border-success/20 hover:bg-success/15" },
  approved: { label: "Approved", variant: "default", className: "bg-success/10 text-success border-success/20 hover:bg-success/15" },
  active: { label: "Active", variant: "default", className: "bg-success/10 text-success border-success/20 hover:bg-success/15" },
  // Processing states
  processing: { label: "Processing", variant: "secondary", className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15" },
  pending: { label: "Pending", variant: "secondary", className: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/15" },
  unverified: { label: "Unverified", variant: "secondary", className: "bg-muted text-muted-foreground" },
  // Error states
  failed: { label: "Failed", variant: "destructive", className: "bg-danger/10 text-danger border-danger/20 hover:bg-danger/15" },
  cancelled: { label: "Cancelled", variant: "outline", className: "bg-muted text-muted-foreground" },
  rejected: { label: "Rejected", variant: "destructive", className: "bg-danger/10 text-danger border-danger/20 hover:bg-danger/15" },
  suspended: { label: "Suspended", variant: "destructive", className: "bg-danger/10 text-danger border-danger/20 hover:bg-danger/15" },
  closed: { label: "Closed", variant: "outline", className: "bg-muted text-muted-foreground" },
};

export function StatusBadge({ status, label, className }: { status: string; label?: string; className?: string }) {
  const config = STATUS_MAP[status.toLowerCase()] ?? { label: status, variant: "outline" as const, className: "" };
  return (
    <Badge variant={config.variant as any} className={cn("text-[11px] font-medium capitalize", config.className, className)}>
      {label ?? config.label}
    </Badge>
  );
}
