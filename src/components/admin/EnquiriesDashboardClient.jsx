"use client";

import { useMemo, useState, useTransition } from "react";
import { LogOut, RefreshCw, Search, Loader2, Mail, Phone, MapPin, Trash2, Archive, CheckCircle2, Download, Save } from "lucide-react";
import { updateEnquiryStatusAction, updateEnquiryNotesAction, deleteEnquiryAction, listEnquiriesAction } from "@/actions/enquiries";
import { signOutAction } from "@/actions/auth";
import { formatDate, formatDateTime, toCSV } from "@/lib/utils";

const STATUS_META = {
  new: { label: "New", className: "bg-[#C9A66B] text-[#1E1E1E]" },
  contacted: { label: "Contacted", className: "bg-[#1E1E1E] text-[#F8F7F4]" },
  archived: { label: "Archived", className: "bg-[#5A5A5A] text-[#F8F7F4]" },
};

export default function EnquiriesDashboardClient({ initialEnquiries, adminEmail }) {
  const [rows, setRows] = useState(initialEnquiries);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, startRefresh] = useTransition();
  const [mutating, startMutate] = useTransition();
  const [savingNotes, startSaveNotes] = useTransition();

  const openDetail = (r) => {
    setSelected(r);
    setNotesDraft(r.admin_notes ?? "");
    setNotesSaved(false);
  };

  const saveNotes = () => {
    if (!selected) return;
    setError("");
    setNotesSaved(false);
    startSaveNotes(async () => {
      const r = await updateEnquiryNotesAction(selected.id, notesDraft);
      if (r.ok) {
        setRows((prev) => prev.map((row) => (row.id === selected.id ? { ...row, admin_notes: notesDraft } : row)));
        setSelected((prev) => (prev ? { ...prev, admin_notes: notesDraft } : prev));
        setNotesSaved(true);
      } else setError(r.error ?? "Failed to save notes.");
    });
  };

  const refresh = () => {
    setError("");
    startRefresh(async () => {
      const r = await listEnquiriesAction();
      if (r.ok) setRows(r.data ?? []);
      else setError(r.error ?? "Failed to refresh.");
    });
  };

  const updateStatus = (id, status) => {
    setError("");
    startMutate(async () => {
      const r = await updateEnquiryStatusAction(id, status);
      if (r.ok) {
        setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
        setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
      } else setError(r.error ?? "Failed to update status.");
    });
  };

  const remove = (id) => {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    setError("");
    startMutate(async () => {
      const r = await deleteEnquiryAction(id);
      if (r.ok) {
        setRows((prev) => prev.filter((row) => row.id !== id));
        if (selected?.id === id) setSelected(null);
      } else setError(r.error ?? "Failed to delete.");
    });
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      const n = q.toLowerCase();
      return (
        r.name.toLowerCase().includes(n) ||
        (r.email ?? "").toLowerCase().includes(n) ||
        (r.phone ?? "").toLowerCase().includes(n) ||
        (r.project_type ?? "").toLowerCase().includes(n) ||
        (r.message ?? "").toLowerCase().includes(n)
      );
    });
  }, [rows, filter, q]);

  const counts = useMemo(() => {
    const c = { all: rows.length, new: 0, contacted: 0, archived: 0 };
    rows.forEach((r) => { c[r.status] = (c[r.status] ?? 0) + 1; });
    return c;
  }, [rows]);

  const exportCSV = () => {
    const csv = toCSV(filtered, [
      "created_at",
      "name",
      "phone",
      "email",
      "location",
      "project_type",
      "message",
      "status",
      "admin_notes",
    ]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F4] py-10">
      <div className="hab-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#1E1E1E] pb-6">
          <div>
            <p className="hab-overline text-[#C9A66B]">Enquiry management</p>
            <h1 className="font-display text-5xl md:text-6xl mt-2 leading-none text-[#1E1E1E]">Enquiries</h1>
            <p className="hab-overline mt-3 text-[#5A5A5A]" data-testid="admin-user-email">
              Signed in as {adminEmail}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportCSV} className="hab-btn-secondary" data-testid="admin-export-btn">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={refresh} disabled={refreshing} className="hab-btn-secondary" data-testid="admin-refresh-btn">
              {refreshing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Refresh
            </button>
            <form action={signOutAction}>
              <button type="submit" className="hab-btn-primary" data-testid="admin-signout-btn">
                Sign Out <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {["all", "new", "contacted", "archived"].map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              data-testid={`admin-filter-${k}`}
              className={`text-left border border-[#1E1E1E] p-5 transition-all ${
                filter === k ? "bg-[#1E1E1E] text-[#F8F7F4]" : "bg-white hover:-translate-y-1"
              }`}
            >
              <p className="hab-overline opacity-70">{k === "all" ? "Total" : k}</p>
              <p className="font-display text-5xl mt-2 leading-none">{counts[k] ?? 0}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 border border-[#1E1E1E] bg-white px-4 py-3">
          <Search size={18} />
          <input
            data-testid="admin-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, phone, email, project…"
            className="flex-1 outline-none font-body bg-transparent"
          />
        </div>

        {error && (
          <div data-testid="admin-error" className="mt-6 border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline">
            {error}
          </div>
        )}

        <div className="mt-8 border border-[#1E1E1E] bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1E1E1E] text-[#F8F7F4]">
              <tr className="hab-overline">
                <th className="text-left px-4 py-3">Received</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Project</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 hab-overline text-[#5A5A5A]" data-testid="admin-empty-state">
                    No enquiries match. Once a visitor submits the form, it will appear here.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-[#E5E2DC] hover:bg-[#F8F7F4] cursor-pointer" onClick={() => openDetail(r)} data-testid={`admin-row-${r.id}`}>
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3 font-body font-semibold">{r.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.phone}</td>
                  <td className="px-4 py-3 font-body">{r.project_type || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 hab-overline text-[10px] ${STATUS_META[r.status]?.className ?? ""}`}>
                      {STATUS_META[r.status]?.label ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="hab-overline text-[#C9A66B]">View →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-stretch justify-end" onClick={() => setSelected(null)} data-testid="admin-detail-overlay">
          <div className="w-full max-w-xl bg-white border-l border-[#1E1E1E] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#1E1E1E] flex items-start justify-between">
              <div>
                <p className="hab-overline text-[#C9A66B]">Enquiry</p>
                <h2 className="font-display text-3xl mt-2 leading-tight text-[#1E1E1E]">{selected.name}</h2>
                <p className="text-xs mt-2 text-[#5A5A5A]">Received {formatDateTime(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="hab-btn-secondary px-4 py-2 text-xs" data-testid="admin-detail-close">Close</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 gap-3">
                <a href={`tel:${selected.phone}`} className="flex items-center gap-3 border border-[#1E1E1E] p-4 hover:bg-[#C9A66B] hover:text-[#1E1E1E] transition-colors">
                  <Phone size={16} /><span className="font-mono text-xs">{selected.phone}</span>
                </a>
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-3 border border-[#1E1E1E] p-4 hover:bg-[#C9A66B] hover:text-[#1E1E1E] transition-colors">
                    <Mail size={16} /><span className="font-mono text-xs">{selected.email}</span>
                  </a>
                )}
                {selected.location && (
                  <div className="flex items-center gap-3 border border-[#1E1E1E] p-4">
                    <MapPin size={16} /><span className="font-body text-sm">{selected.location}</span>
                  </div>
                )}
              </div>

              {selected.project_type && (
                <div className="border border-[#1E1E1E] p-4">
                  <p className="hab-overline text-[#5A5A5A]">Project type</p>
                  <p className="font-display text-2xl mt-1 text-[#1E1E1E]">{selected.project_type}</p>
                </div>
              )}

              <div className="border border-[#1E1E1E] p-4">
                <p className="hab-overline text-[#5A5A5A]">Message</p>
                <p className="font-body text-sm mt-2 whitespace-pre-wrap">{selected.message || "—"}</p>
              </div>

              <div className="border-t border-[#E5E2DC] pt-5">
                <p className="hab-overline text-[#5A5A5A] mb-3">Internal notes</p>
                <textarea
                  data-testid="admin-notes-input"
                  rows={4}
                  value={notesDraft}
                  onChange={(e) => { setNotesDraft(e.target.value); setNotesSaved(false); }}
                  placeholder="Not visible to the customer — call outcomes, follow-ups, quoted price…"
                  className="w-full border border-[#1E1E1E]/30 bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-[#C9A66B] resize-y"
                />
                <div className="flex items-center gap-3 mt-2">
                  <button disabled={savingNotes} data-testid="admin-save-notes" onClick={saveNotes} className="hab-btn-secondary px-4 py-2 text-xs">
                    {savingNotes ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save notes
                  </button>
                  {notesSaved && <span className="hab-overline text-green-700">Saved</span>}
                </div>
              </div>

              <div className="border-t border-[#E5E2DC] pt-5">
                <p className="hab-overline text-[#5A5A5A] mb-3">Update status</p>
                <div className="flex flex-wrap gap-2">
                  <button disabled={mutating} data-testid="admin-mark-contacted" onClick={() => updateStatus(selected.id, "contacted")} className="hab-btn-secondary px-4 py-2 text-xs">
                    <CheckCircle2 size={14} /> Mark Contacted
                  </button>
                  <button disabled={mutating} data-testid="admin-mark-archived" onClick={() => updateStatus(selected.id, "archived")} className="hab-btn-secondary px-4 py-2 text-xs">
                    <Archive size={14} /> Archive
                  </button>
                  <button disabled={mutating} data-testid="admin-mark-new" onClick={() => updateStatus(selected.id, "new")} className="hab-btn-secondary px-4 py-2 text-xs">
                    Re-open as New
                  </button>
                  <button disabled={mutating} data-testid="admin-delete-btn" onClick={() => remove(selected.id)} className="border border-red-800 bg-red-600 text-white px-4 py-2 text-xs hab-overline flex items-center gap-2 hover:bg-red-700">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
