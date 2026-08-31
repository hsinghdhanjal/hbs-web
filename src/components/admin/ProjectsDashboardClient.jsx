"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ImageOff,
  ArrowUp,
  ArrowDown,
  Loader2,
  EyeOff,
  Eye,
} from "lucide-react";
import ImageUploader from "@/components/cms/ImageUploader";
import {
  createProjectAction,
  deleteProjectAction,
  moveProjectAction,
  updateProjectAction,
  uploadProjectImageAction,
} from "@/actions/projects";

export default function ProjectsDashboardClient({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [moving, startMove] = useTransition();

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    if (!needle) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        (p.category ?? "").toLowerCase().includes(needle) ||
        (p.location ?? "").toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle),
    );
  }, [projects, q]);

  const sortedFiltered = useMemo(() => [...filtered].sort((a, b) => a.sort_order - b.sort_order), [filtered]);

  const upsert = (row) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === row.id);
      return exists ? prev.map((p) => (p.id === row.id ? row : p)) : [...prev, row];
    });
    setEditing(row);
  };

  const remove = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const move = (id, direction) => {
    setError("");
    setProjects((prev) => {
      const sorted = [...prev].sort((a, b) => a.sort_order - b.sort_order);
      const idx = sorted.findIndex((p) => p.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[swapIdx];
      const aOrder = a.sort_order;
      return prev.map((p) => {
        if (p.id === a.id) return { ...p, sort_order: b.sort_order };
        if (p.id === b.id) return { ...p, sort_order: aOrder };
        return p;
      });
    });
    startMove(async () => {
      const r = await moveProjectAction(id, direction);
      if (!r.ok) setError(r.error ?? "Failed to reorder.");
    });
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F4] py-10">
      <div className="hab-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#1E1E1E] pb-6">
          <div>
            <p className="hab-overline text-[#C9A66B]">Content management</p>
            <h1 className="font-display text-5xl md:text-6xl mt-2 leading-none text-[#1E1E1E]">Projects</h1>
            <p className="hab-overline mt-3 text-[#5A5A5A]">
              {projects.filter((p) => p.published).length} of {projects.length} live in the Projects section
            </p>
          </div>
          <button onClick={() => setEditing("new")} data-testid="projects-add-btn" className="hab-btn-primary">
            <Plus size={14} /> Add Project
          </button>
        </div>

        <div className="mt-8 flex items-center gap-3 border border-[#1E1E1E] bg-white px-4 py-3">
          <Search size={18} />
          <input
            data-testid="projects-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, category, location, slug…"
            className="flex-1 outline-none font-body bg-transparent"
          />
        </div>

        {error && (
          <div data-testid="projects-error" className="mt-6 border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8">
          {sortedFiltered.map((p, i) => (
            <div
              key={p.id}
              className="border border-[#1E1E1E] bg-white overflow-hidden flex flex-col"
              data-testid={`projects-card-${p.slug}`}
            >
              <div className="relative h-44 bg-[#F3F2EE] border-b border-[#1E1E1E] overflow-hidden">
                {p.image_url ? (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,#F8F7F4,#F8F7F4_12px,#F3F2EE_12px,#F3F2EE_24px)]">
                    <ImageOff size={22} className="text-[#1E1E1E]/40" />
                  </div>
                )}
                <span
                  data-testid={`projects-published-${p.slug}`}
                  className={`absolute top-3 left-3 hab-overline px-2 py-1 flex items-center gap-1 ${
                    p.published ? "bg-[#1E1E1E] text-[#F8F7F4]" : "bg-[#C9A66B] text-[#1E1E1E]"
                  }`}
                >
                  {p.published ? <Eye size={11} /> : <EyeOff size={11} />}
                  {p.published ? "Live" : "Hidden"}
                </span>
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  <button
                    onClick={() => move(p.id, "up")}
                    disabled={moving || i === 0}
                    data-testid={`projects-move-up-${p.slug}`}
                    className="w-7 h-7 border border-[#1E1E1E] bg-white/90 flex items-center justify-center hover:bg-[#C9A66B] disabled:opacity-30"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => move(p.id, "down")}
                    disabled={moving || i === sortedFiltered.length - 1}
                    data-testid={`projects-move-down-${p.slug}`}
                    className="w-7 h-7 border border-[#1E1E1E] bg-white/90 flex items-center justify-center hover:bg-[#C9A66B] disabled:opacity-30"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="font-display text-lg leading-tight text-[#1E1E1E]">{p.name}</p>
                <p className="hab-overline text-[#C9A66B] mt-1">{p.category}</p>
                <p className="hab-overline text-[#5A5A5A] mt-2">
                  {p.location} {p.year && `· ${p.year}`}
                </p>
                <button
                  onClick={() => setEditing(p)}
                  data-testid={`projects-edit-${p.slug}`}
                  className="hab-btn-secondary px-4 py-2 text-xs mt-4 self-start"
                >
                  <Pencil size={13} /> Edit
                </button>
              </div>
            </div>
          ))}
          {sortedFiltered.length === 0 && (
            <div className="col-span-full text-center py-16 hab-overline text-[#5A5A5A] border border-[#1E1E1E] bg-white" data-testid="projects-empty-state">
              No projects match. Add one to feature it in the Projects section.
            </div>
          )}
        </div>
      </div>

      {editing && (
        <ProjectDrawer
          project={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(row) => upsert(row)}
          onDeleted={(id) => {
            remove(id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ProjectDrawer({ project, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    name: project?.name ?? "",
    slug: project?.slug ?? "",
    category: project?.category ?? "",
    location: project?.location ?? "",
    year: project?.year ?? "",
    scope: project?.scope ?? "",
    summary: project?.summary ?? "",
  });
  const [published, setPublished] = useState(project?.published ?? true);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const isNew = !project;

  const save = () => {
    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }
    setError("");
    startTransition(async () => {
      if (isNew) {
        const r = await createProjectAction({ ...form, published });
        if (r.ok && r.data) onSaved(r.data);
        else setError(r.error ?? "Failed to create project.");
      } else {
        const r = await updateProjectAction(project.id, { ...form, published });
        if (r.ok && r.data) onSaved(r.data);
        else setError(r.error ?? "Failed to save project.");
      }
    });
  };

  const doDelete = () => {
    if (!project) return;
    if (!window.confirm(`Delete "${project.name}" permanently? This also removes its image.`)) return;
    setError("");
    startTransition(async () => {
      const r = await deleteProjectAction(project.id);
      if (r.ok) onDeleted(project.id);
      else setError(r.error ?? "Failed to delete project.");
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-stretch justify-end" onClick={onClose} data-testid="projects-drawer-overlay">
      <div className="w-full max-w-2xl bg-white border-l border-[#1E1E1E] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-[#1E1E1E] flex items-start justify-between">
          <div>
            <p className="hab-overline text-[#C9A66B]">{isNew ? "New project" : "Edit project"}</p>
            <h2 className="font-display text-3xl mt-2 leading-tight text-[#1E1E1E]">{isNew ? "Add a project" : project.name}</h2>
          </div>
          <button onClick={onClose} data-testid="projects-drawer-close" aria-label="Close" className="w-11 h-11 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#C9A66B]">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!isNew && (
            <div>
              <p className="hab-overline text-[#5A5A5A] mb-3">Project image</p>
              <div className="relative w-full h-56 border border-[#1E1E1E] bg-[#F3F2EE] overflow-hidden mb-3">
                {project.image_url ? (
                  <Image src={project.image_url} alt={project.name} fill className="object-cover" sizes="90vw" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,#F8F7F4,#F8F7F4_12px,#F3F2EE_12px,#F3F2EE_24px)]">
                    <ImageOff size={24} className="text-[#1E1E1E]/40" />
                  </div>
                )}
              </div>
              <ImageUploader
                slotKey={project.id}
                fieldName="project_id"
                uploadAction={uploadProjectImageAction}
                onUploaded={(row) => onSaved(row)}
                compact
              />
            </div>
          )}
          {isNew && (
            <p className="hab-overline text-[#5A5A5A] border border-dashed border-[#1E1E1E]/30 p-4">
              Save the project first, then reopen it to upload an image.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="hab-overline font-bold">Name *</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                data-testid="projects-input-name"
                className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B]"
                placeholder="e.g. Bhandari Shoe Company Complex"
              />
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="hab-overline font-bold">Slug (URL-safe id)</span>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                data-testid="projects-input-slug"
                className="border border-[#1E1E1E]/30 bg-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#C9A66B]"
                placeholder="auto-generated from name if left blank"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="hab-overline font-bold">Category</span>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                data-testid="projects-input-category"
                className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B]"
                placeholder="e.g. Commercial Complex"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="hab-overline font-bold">Location</span>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                data-testid="projects-input-location"
                className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B]"
                placeholder="e.g. Amritsar"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="hab-overline font-bold">Year</span>
              <input
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                data-testid="projects-input-year"
                className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B]"
                placeholder="e.g. 2024"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="hab-overline font-bold">Scope</span>
              <input
                value={form.scope}
                onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                data-testid="projects-input-scope"
                className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B]"
                placeholder="e.g. Architecture · Structure · Façade"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="hab-overline font-bold">Summary</span>
            <textarea
              rows={4}
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              data-testid="projects-input-summary"
              className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B] resize-y"
              placeholder="A short description of the project…"
            />
          </label>

          <label className="flex items-center gap-3 border border-[#1E1E1E] p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              data-testid="projects-input-published"
              className="w-4 h-4"
            />
            <span className="hab-overline">
              {published ? "Published — visible in the Projects section" : "Hidden — kept in admin only"}
            </span>
          </label>

          {error && (
            <div data-testid="projects-drawer-error" className="border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#E5E2DC] pt-6">
            {!isNew ? (
              <button
                onClick={doDelete}
                disabled={pending}
                data-testid="projects-delete-btn"
                className="border border-red-800 bg-red-600 text-white px-4 py-3 hab-overline flex items-center gap-2 hover:bg-red-700"
              >
                <Trash2 size={14} /> Delete
              </button>
            ) : (
              <span />
            )}
            <button onClick={save} disabled={pending} data-testid="projects-save-btn" className="hab-btn-primary px-6 py-3 text-xs">
              {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
