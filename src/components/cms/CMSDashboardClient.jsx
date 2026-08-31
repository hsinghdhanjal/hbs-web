"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Search, ImageOff, Loader2, Pencil, Trash2, X, Copy, ExternalLink, Save, Video } from "lucide-react";
import ImageUploader from "@/components/cms/ImageUploader";
import { deleteImageAction, renameImageAction } from "@/actions/images";
import { formatDateTime } from "@/lib/utils";
import { acceptForSlot, isVideoMime, maxBytesForSlot, slotAllowsVideo } from "@/lib/media-limits";

const PAGE_SIZE = 8;

export default function CMSDashboardClient({ initialImages }) {
  const [images, setImages] = useState(initialImages);
  const [q, setQ] = useState("");
  const [pageFilter, setPageFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const pages = useMemo(() => {
    const set = new Set(images.map((i) => i.page));
    return ["all", ...Array.from(set)];
  }, [images]);

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    return images.filter((r) => {
      if (pageFilter !== "all" && r.page !== pageFilter) return false;
      if (!needle) return true;
      return (
        r.slot_key.toLowerCase().includes(needle) ||
        r.label.toLowerCase().includes(needle) ||
        r.location.toLowerCase().includes(needle) ||
        (r.original_filename ?? "").toLowerCase().includes(needle)
      );
    });
  }, [images, q, pageFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const upsertImage = (row) => {
    setImages((prev) => prev.map((r) => (r.id === row.id ? row : r)));
    setSelected(row);
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F4] py-10">
      <div className="hab-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#1E1E1E] pb-6">
          <div>
            <p className="hab-overline text-[#C9A66B]">Content management</p>
            <h1 className="font-display text-5xl md:text-6xl mt-2 leading-none text-[#1E1E1E]">Site Images</h1>
            <p className="hab-overline mt-3 text-[#5A5A5A]">
              {images.filter((i) => i.public_url).length} of {images.length} slots filled
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
          <div className="lg:col-span-2 flex items-center gap-3 border border-[#1E1E1E] bg-white px-4 py-3">
            <Search size={18} />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              data-testid="cms-search"
              placeholder="Search by slot, label, location, filename…"
              className="flex-1 outline-none font-body bg-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPageFilter(p);
                  setPage(1);
                }}
                data-testid={`cms-page-filter-${p}`}
                className={`hab-overline px-3 py-2 border border-[#1E1E1E] transition-colors ${
                  pageFilter === p ? "bg-[#1E1E1E] text-[#F8F7F4]" : "bg-white hover:bg-[#C9A66B]"
                }`}
              >
                {p === "all" ? "All pages" : p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mt-8">
          {visible.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => setSelected(row)}
              data-testid={`cms-card-${row.slot_key}`}
              className="text-left group border border-[#1E1E1E] bg-white overflow-hidden hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#C9A66B] transition-all"
            >
              <div className="relative h-48 bg-[#F3F2EE] border-b border-[#1E1E1E] overflow-hidden">
                {row.public_url ? (
                  isVideoMime(row.mime_type) ? (
                    <video
                      src={row.public_url}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Image src={row.public_url} alt={row.label} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 1024px) 50vw, 25vw" />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,#F8F7F4,#F8F7F4_12px,#F3F2EE_12px,#F3F2EE_24px)]">
                    <ImageOff size={24} className="text-[#1E1E1E]/40" />
                    <p className="hab-overline text-[#C9A66B]">{slotAllowsVideo(row.slot_key) ? "image or video slot" : "image slot"}</p>
                  </div>
                )}
                <span className={`absolute top-3 left-3 hab-overline px-2 py-1 ${row.public_url ? "bg-[#1E1E1E] text-[#F8F7F4]" : "bg-[#C9A66B] text-[#1E1E1E]"}`}>
                  {row.public_url ? "Live" : "Empty"}
                </span>
                {row.public_url && isVideoMime(row.mime_type) && (
                  <span className="absolute bottom-3 left-3 hab-overline bg-white/90 text-[#1E1E1E] px-2 py-1 border border-[#1E1E1E] flex items-center gap-1">
                    <Video size={11} /> Video
                  </span>
                )}
                <span className="absolute top-3 right-3 hab-overline bg-white/90 text-[#1E1E1E] px-2 py-1 border border-[#1E1E1E]">
                  {row.page}
                </span>
              </div>
              <div className="p-4">
                <p className="font-display text-lg leading-tight text-[#1E1E1E]">{row.label}</p>
                <p className="hab-overline text-[#5A5A5A] mt-2">{row.location}</p>
                <p className="font-mono text-[10px] tracking-widest mt-3 text-[#1E1E1E]/50">slot: {row.slot_key}</p>
              </div>
            </button>
          ))}
          {visible.length === 0 && (
            <div className="col-span-full text-center py-16 hab-overline text-[#5A5A5A]" data-testid="cms-empty-state">
              No image slots match your filters.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              data-testid="cms-page-prev"
              className="hab-btn-secondary px-4 py-2 text-xs disabled:opacity-40"
            >
              Prev
            </button>
            <span className="hab-overline px-4">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              data-testid="cms-page-next"
              className="hab-btn-secondary px-4 py-2 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selected && (
        <DetailDrawer
          image={selected}
          onClose={() => setSelected(null)}
          onSaved={upsertImage}
          onDeleted={(row) => {
            upsertImage(row);
          }}
        />
      )}
    </div>
  );
}

function DetailDrawer({ image, onClose, onSaved, onDeleted }) {
  const [labelDraft, setLabelDraft] = useState(image.label);
  const [labelEditing, setLabelEditing] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const saveLabel = () => {
    if (labelDraft.trim() === image.label) {
      setLabelEditing(false);
      return;
    }
    setError("");
    const optimistic = { ...image, label: labelDraft.trim() };
    onSaved(optimistic);
    startTransition(async () => {
      const r = await renameImageAction(image.slot_key, labelDraft.trim());
      if (r.ok && r.data) {
        onSaved(r.data);
        setLabelEditing(false);
      } else {
        setError(r.error ?? "Rename failed.");
        onSaved(image);
      }
    });
  };

  const doDelete = () => {
    const mediaWord = slotAllowsVideo(image.slot_key) ? "media" : "image";
    if (!window.confirm(`Remove the ${mediaWord} from "${image.label}"? The slot will show a placeholder until you upload a new one.`)) return;
    setError("");
    const optimistic = { ...image, public_url: null, storage_path: null, original_filename: null, size_bytes: null, mime_type: null };
    onDeleted(optimistic);
    startTransition(async () => {
      const r = await deleteImageAction(image.slot_key);
      if (r.ok && r.data) onDeleted(r.data);
      else {
        setError(r.error ?? "Delete failed.");
        onSaved(image);
      }
    });
  };

  const copyUrl = async () => {
    if (!image.public_url) return;
    await navigator.clipboard.writeText(image.public_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-stretch justify-end" onClick={onClose} data-testid="cms-detail-overlay">
      <div className="w-full max-w-2xl bg-white border-l border-[#1E1E1E] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-[#1E1E1E] flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="hab-overline text-[#C9A66B]">Image slot</p>
            {labelEditing ? (
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={labelDraft}
                  onChange={(e) => setLabelDraft(e.target.value)}
                  data-testid="cms-label-input"
                  className="flex-1 border border-[#1E1E1E] px-3 py-2 font-display text-2xl focus:outline-none focus:border-[#C9A66B]"
                />
                <button onClick={saveLabel} disabled={pending} data-testid="cms-label-save" className="hab-btn-primary px-4 py-2 text-xs">
                  {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                </button>
                <button onClick={() => { setLabelDraft(image.label); setLabelEditing(false); }} className="hab-btn-secondary px-4 py-2 text-xs">Cancel</button>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-3">
                <h2 className="font-display text-3xl leading-tight text-[#1E1E1E]" data-testid="cms-detail-label">{image.label}</h2>
                <button onClick={() => setLabelEditing(true)} data-testid="cms-label-edit" className="w-9 h-9 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#C9A66B]">
                  <Pencil size={14} />
                </button>
              </div>
            )}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 hab-overline text-[#5A5A5A]">
              <p><b className="text-[#1E1E1E]/40 mr-1">Slot:</b> {image.slot_key}</p>
              <p><b className="text-[#1E1E1E]/40 mr-1">Page:</b> {image.page}</p>
              <p className="sm:col-span-2"><b className="text-[#1E1E1E]/40 mr-1">Used at:</b> {image.location}</p>
              {image.updated_at && <p className="sm:col-span-2"><b className="text-[#1E1E1E]/40 mr-1">Updated:</b> {formatDateTime(image.updated_at)}</p>}
            </div>
          </div>
          <button onClick={onClose} data-testid="cms-detail-close" aria-label="Close" className="w-11 h-11 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#C9A66B]">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative w-full h-72 border border-[#1E1E1E] bg-[#F3F2EE] overflow-hidden">
            {image.public_url ? (
              isVideoMime(image.mime_type) ? (
                <video src={image.public_url} controls muted loop playsInline className="w-full h-full object-contain" />
              ) : (
                <Image src={image.public_url} alt={image.label} fill className="object-contain" sizes="90vw" />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,#F8F7F4,#F8F7F4_12px,#F3F2EE_12px,#F3F2EE_24px)]">
                <ImageOff size={28} className="text-[#1E1E1E]/40" />
                <p className="hab-overline text-[#C9A66B]">
                  {slotAllowsVideo(image.slot_key) ? "No image or video uploaded" : "No image uploaded"}
                </p>
              </div>
            )}
          </div>

          {image.public_url && (
            <div className="border border-[#1E1E1E] p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="hab-overline text-[#5A5A5A]">Public URL</p>
                <p className="font-mono text-xs mt-1 truncate" data-testid="cms-public-url">{image.public_url}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={copyUrl} data-testid="cms-copy-url" className="hab-btn-secondary px-3 py-2 text-xs">
                  <Copy size={13} /> {copied ? "Copied" : "Copy"}
                </button>
                <a href={image.public_url} target="_blank" rel="noopener" className="hab-btn-secondary px-3 py-2 text-xs">
                  <ExternalLink size={13} /> Open
                </a>
              </div>
            </div>
          )}

          <div>
            <p className="hab-overline text-[#5A5A5A] mb-3">
              {image.public_url
                ? slotAllowsVideo(image.slot_key) ? "Replace media" : "Replace image"
                : slotAllowsVideo(image.slot_key) ? "Upload media" : "Upload image"}
            </p>
            <ImageUploader
              slotKey={image.slot_key}
              onUploaded={onSaved}
              accept={acceptForSlot(image.slot_key)}
              maxBytes={maxBytesForSlot(image.slot_key)}
              allowVideo={slotAllowsVideo(image.slot_key)}
            />
          </div>

          {image.public_url && (
            <div className="border-t border-[#E5E2DC] pt-5">
              <p className="hab-overline text-[#5A5A5A] mb-3">Danger zone</p>
              <button
                onClick={doDelete}
                disabled={pending}
                data-testid="cms-delete-btn"
                className="border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline font-bold flex items-center gap-2 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={14} /> Remove {slotAllowsVideo(image.slot_key) ? "media" : "image"} (slot reverts to placeholder)
              </button>
            </div>
          )}

          {error && (
            <div data-testid="cms-detail-error" className="border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
