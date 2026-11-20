import type { Metadata } from "next";
import { createClient, requireAdmin } from "@/lib/supabase/server";
import { adminQuerySchema } from "@/lib/admin-schema";
import { AppointmentsClient, type AppointmentRecord } from "./AppointmentsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Appointments | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

const PAGE_SIZE = 20;

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Guard check: verifies user is logged in and is ADMIN_USER_ID
  await requireAdmin();

  // 2. Resolve and validate URL query parameters with Zod
  const rawParams = await searchParams;
  const parsedParams = adminQuerySchema.parse({
    status: typeof rawParams.status === "string" ? rawParams.status : undefined,
    search: typeof rawParams.search === "string" ? rawParams.search : undefined,
    page: typeof rawParams.page === "string" ? rawParams.page : undefined,
  });

  const { status, search, page } = parsedParams;

  // 3. Query appointments with user session client (respecting Supabase RLS)
  const supabase = await createClient();
  let query = supabase
    .from("appointments")
    .select("id, full_name, phone, treatment, preferred_time, status, notes, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  // Status filter (new, confirmed, cancelled)
  if (status !== "all") {
    query = query.eq("status", status);
  }

  // Search filter (name or phone)
  if (search.trim()) {
    const term = search.trim();
    query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  // Pagination (20 per page)
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Failed to load appointments:", error.code || error.message);
  }

  const appointments: AppointmentRecord[] = (data || []).map((row) => ({
    id: row.id,
    full_name: row.full_name,
    phone: row.phone,
    treatment: row.treatment,
    preferred_time: row.preferred_time,
    status: row.status || "new",
    notes: row.notes || null,
    created_at: row.created_at,
  }));

  const totalCount = count || 0;

  return (
    <AppointmentsClient
      appointments={appointments}
      totalCount={totalCount}
      currentPage={page}
      pageSize={PAGE_SIZE}
      currentStatus={status}
      currentSearch={search}
    />
  );
}
