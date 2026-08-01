import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import {
  isSupabaseAuthConfigured,
  isSupabaseBackendEnabled,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "JKP Hallinta",
  description: "JKP Groupin suojattu sisällönhallintapaneeli.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const enabled =
    isSupabaseBackendEnabled() &&
    isSupabaseConfigured() &&
    isSupabaseAuthConfigured();

  return <AdminDashboard enabled={enabled} />;
}
