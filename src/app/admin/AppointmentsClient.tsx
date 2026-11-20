"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { treatments } from "@/data/treatments";
import {
  updateAppointmentAction,
  createAppointmentAdminAction,
  deleteAppointmentAction,
} from "./actions";
import type { AppointmentStatus } from "@/lib/admin-schema";

export type AppointmentRecord = {
  id: string;
  full_name: string;
  phone: string;
  treatment: string;
  preferred_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
};

interface AppointmentsClientProps {
  appointments: AppointmentRecord[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  currentStatus: string;
  currentSearch: string;
}

export function AppointmentsClient({
  appointments,
  totalCount,
  currentPage,
  pageSize,
  currentStatus,
  currentSearch,
}: AppointmentsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Search input state
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentRecord | null>(null);

  // Form error states
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // URL Query parameter updater
  const updateQuery = (newParams: { status?: string; search?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newParams.status !== undefined) {
      if (newParams.status === "all") {
        params.delete("status");
      } else {
        params.set("status", newParams.status);
      }
      params.set("page", "1");
    }

    if (newParams.search !== undefined) {
      const trimmed = newParams.search.trim();
      if (!trimmed) {
        params.delete("search");
      } else {
        params.set("search", trimmed);
      }
      params.set("page", "1");
    }

    if (newParams.page !== undefined) {
      if (newParams.page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(newParams.page));
      }
    }

    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchInput });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateQuery({ search: "" });
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Phone to WhatsApp URL helper
  const getWhatsAppLink = (phone: string, fullName: string) => {
    const cleanPhone = phone.replace(/^0/, "92").replace(/[\s-+]/g, "");
    const message = encodeURIComponent(
      `Hello ${fullName}, this is Professional Dental Clinic about your appointment request.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // Treatment title helper
  const getTreatmentTitle = (slug: string) => {
    const found = treatments.find((t) => t.slug === slug);
    return found ? found.title : slug;
  };

  // Preferred time label helper
  const getPreferredTimeLabel = (time: string) => {
    switch (time) {
      case "morning":
        return "Morning (9 AM – 1 PM)";
      case "afternoon":
        return "Afternoon (1 PM – 5 PM)";
      case "evening":
        return "Evening (5 PM – 9 PM)";
      default:
        return "Any time";
    }
  };

  // Status badge style helper
  const renderStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            ● New
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            ✕ Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  // Delete handler
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the appointment for "${name}"?`)) {
      startTransition(async () => {
        const res = await deleteAppointmentAction(id);
        if (res.success) {
          setActionMessage("Appointment deleted successfully.");
          setTimeout(() => setActionMessage(null), 3000);
        } else {
          alert(res.error || "Failed to delete appointment");
        }
      });
    }
  };

  // Update handler
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAppointment) return;
    setUpdateError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingAppointment.id,
      status: formData.get("status"),
      notes: formData.get("notes"),
    };

    startTransition(async () => {
      const res = await updateAppointmentAction(data);
      if (res.success) {
        setEditingAppointment(null);
        setActionMessage("Appointment updated successfully.");
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        setUpdateError(res.error || "Failed to update appointment");
      }
    });
  };

  // Create handler
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      treatment: formData.get("treatment"),
      preferredTime: formData.get("preferredTime"),
      notes: formData.get("notes"),
    };

    startTransition(async () => {
      const res = await createAppointmentAdminAction(data);
      if (res.success) {
        setIsCreateOpen(false);
        setActionMessage("New appointment added successfully.");
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        setCreateError(res.error || "Failed to create appointment");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-[16px] border border-[#BDD3F0] shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0F2A4A] tracking-tight">
            Patient Appointments
          </h2>
          <p className="text-xs sm:text-sm text-[#3E5575] mt-0.5">
            Total records: <span className="font-semibold text-[#0F2A4A]">{totalCount}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreateError(null);
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center justify-center min-h-[42px] px-5 rounded-full font-semibold text-sm bg-[#2F6FD0] text-white hover:bg-[#255bb0] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          + Add appointment
        </button>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          {actionMessage}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white p-4 sm:p-5 rounded-[16px] border border-[#BDD3F0] shadow-xs space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#3E5575] uppercase tracking-wider mr-1">
            Status:
          </span>
          {(["all", "new", "confirmed", "cancelled"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => updateQuery({ status: st })}
              disabled={isPending}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer capitalize ${
                currentStatus === st
                  ? "bg-[#2F6FD0] text-white shadow-xs"
                  : "bg-[#F4F7FB] text-[#3E5575] border border-[#BDD3F0] hover:bg-[#EAF2FD] hover:text-[#0F2A4A]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by patient name or phone number..."
              className="w-full min-h-[40px] px-3.5 rounded-lg border border-[#BDD3F0] text-sm text-[#0F2A4A] bg-white focus:outline-none focus:border-[#2F6FD0] transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#0F2A4A]"
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="min-h-[40px] px-5 rounded-lg font-semibold text-sm border border-[#2F6FD0] bg-white text-[#2F6FD0] hover:bg-[#EAF2FD] transition-colors cursor-pointer"
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Appointments List Display */}
      {appointments.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-[16px] border border-[#BDD3F0] shadow-xs">
          <p className="text-base text-[#3E5575] font-medium">
            No appointments found matching your criteria.
          </p>
          {(currentStatus !== "all" || currentSearch) && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateQuery({ status: "all", search: "" });
              }}
              className="mt-3 text-sm font-semibold text-[#2F6FD0] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[16px] border border-[#BDD3F0] shadow-xs overflow-hidden">
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0F2A4A]">
              <thead className="bg-[#F8FAFC] border-b border-[#BDD3F0] text-xs font-semibold text-[#3E5575] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Treatment</th>
                  <th className="py-3.5 px-4">Preferred Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date Added</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#0F2A4A]">
                      <div>{apt.full_name}</div>
                      {apt.notes && (
                        <div className="text-xs text-[#64748B] mt-0.5 line-clamp-1 italic">
                          &quot;{apt.notes}&quot;
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${apt.phone}`}
                          className="font-medium text-[#2F6FD0] hover:underline"
                          title="Call patient"
                        >
                          {apt.phone}
                        </a>
                        <span className="text-gray-300">|</span>
                        <a
                          href={getWhatsAppLink(apt.phone, apt.full_name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hover:bg-emerald-100 transition-colors"
                          title="Open WhatsApp chat"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#3E5575]">
                      {getTreatmentTitle(apt.treatment)}
                    </td>
                    <td className="py-3.5 px-4 text-[#3E5575]">
                      {getPreferredTimeLabel(apt.preferred_time)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderStatusBadge(apt.status)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#64748B]">
                      {new Date(apt.created_at).toLocaleString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUpdateError(null);
                          setEditingAppointment(apt);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#BDD3F0] text-[#1F57AE] hover:bg-[#EAF2FD] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(apt.id, apt.full_name)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Shown on small screens) */}
          <div className="block md:hidden divide-y divide-[#E2E8F0]">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-[#0F2A4A]">{apt.full_name}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {new Date(apt.created_at).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {renderStatusBadge(apt.status)}
                </div>

                <div className="text-xs space-y-1.5 text-[#3E5575] bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                  <div>
                    <span className="font-semibold text-[#0F2A4A]">Treatment:</span>{" "}
                    {getTreatmentTitle(apt.treatment)}
                  </div>
                  <div>
                    <span className="font-semibold text-[#0F2A4A]">Time:</span>{" "}
                    {getPreferredTimeLabel(apt.preferred_time)}
                  </div>
                  {apt.notes && (
                    <div>
                      <span className="font-semibold text-[#0F2A4A]">Notes:</span>{" "}
                      <span className="italic">{apt.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={`tel:${apt.phone}`}
                    className="inline-flex items-center text-xs font-semibold text-[#2F6FD0] border border-[#BDD3F0] px-3 py-1.5 rounded-full hover:bg-[#EAF2FD]"
                  >
                    📞 Call {apt.phone}
                  </a>
                  <a
                    href={getWhatsAppLink(apt.phone, apt.full_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full hover:bg-emerald-100"
                  >
                    💬 WhatsApp
                  </a>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setUpdateError(null);
                      setEditingAppointment(apt);
                    }}
                    className="px-3 py-1 text-xs font-semibold rounded-md border border-[#BDD3F0] text-[#1F57AE] hover:bg-[#EAF2FD]"
                  >
                    Edit Status &amp; Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(apt.id, apt.full_name)}
                    className="px-3 py-1 text-xs font-semibold rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-[#F8FAFC] border-t border-[#BDD3F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#3E5575]">
            <div>
              Showing{" "}
              <span className="font-semibold text-[#0F2A4A]">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#0F2A4A]">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-semibold text-[#0F2A4A]">{totalCount}</span> appointments
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || isPending}
                onClick={() => updateQuery({ page: currentPage - 1 })}
                className="px-3.5 py-1.5 rounded-lg border border-[#BDD3F0] bg-white font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages || isPending}
                onClick={() => updateQuery({ page: currentPage + 1 })}
                className="px-3.5 py-1.5 rounded-lg border border-[#BDD3F0] bg-white font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[480px] rounded-[20px] border border-[#BDD3F0] shadow-xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-lg font-heading font-bold text-[#0F2A4A]">
                  Edit Appointment
                </h3>
                <p className="text-xs text-[#3E5575]">
                  Patient: <span className="font-semibold">{editingAppointment.full_name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAppointment(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {updateError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {updateError}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F2A4A] mb-1">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editingAppointment.status}
                  className="w-full min-h-[42px] px-3 rounded-lg border border-[#BDD3F0] bg-white text-sm text-[#0F2A4A] focus:outline-none focus:border-[#2F6FD0]"
                >
                  <option value="new">New</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2A4A] mb-1">
                  Notes <span className="font-normal text-gray-500">(up to 500 characters)</span>
                </label>
                <textarea
                  name="notes"
                  maxLength={500}
                  rows={4}
                  defaultValue={editingAppointment.notes || ""}
                  placeholder="Internal clinic notes regarding this appointment..."
                  className="w-full p-3 rounded-lg border border-[#BDD3F0] bg-white text-sm text-[#0F2A4A] focus:outline-none focus:border-[#2F6FD0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setEditingAppointment(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#2F6FD0] text-white hover:bg-[#255bb0] disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[500px] rounded-[20px] border border-[#BDD3F0] shadow-xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-lg font-heading font-bold text-[#0F2A4A]">
                Add New Appointment
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0F2A4A] mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Ahmad Ali"
                  className="w-full min-h-[42px] px-3 rounded-lg border border-[#BDD3F0] bg-white text-sm text-[#0F2A4A] focus:outline-none focus:border-[#2F6FD0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2A4A] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="03001234567"
                  className="w-full min-h-[42px] px-3 rounded-lg border border-[#BDD3F0] bg-white text-sm text-[#0F2A4A] focus:outline-none focus:border-[#2F6FD0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2A4A] mb-1">
                  Treatment
                </label>
                <select
                  name="treatment"
                  required
                  className="w-full min-h-[42px] px-3 rounded-lg border border-[#BDD3F0] bg-white text-sm text-[#0F2A4A] focus:outline-none focus:border-[#2F6FD0]"
                >
                  <option value="">Select treatment</option>
                  {treatments.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2A4A] mb-1">
                  Preferred Time
                </label>
                <select
                  name="preferredTime"
                  defaultValue="any"
                  className="w-full min-h-[42px] px-3 rounded-lg border border-[#BDD3F0] bg-white text-sm text-[#0F2A4A] focus:outline-none focus:border-[#2F6FD0]"
                >
                  <option value="any">Any time</option>
                  <option value="morning">Morning (9 AM – 1 PM)</option>
                  <option value="afternoon">Afternoon (1 PM – 5 PM)</option>
                  <option value="evening">Evening (5 PM – 9 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2A4A] mb-1">
                  Notes <span className="font-normal text-gray-500">(optional, max 500 chars)</span>
                </label>
                <textarea
                  name="notes"
                  maxLength={500}
                  rows={3}
                  placeholder="Internal notes..."
                  className="w-full p-3 rounded-lg border border-[#BDD3F0] bg-white text-sm text-[#0F2A4A] focus:outline-none focus:border-[#2F6FD0]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#2F6FD0] text-white hover:bg-[#255bb0] disabled:opacity-50"
                >
                  {isPending ? "Adding..." : "Add appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

