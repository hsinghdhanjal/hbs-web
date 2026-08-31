"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Plus, Pencil, Trash2, X, Save, Star, ArrowUp, ArrowDown, Loader2, EyeOff, Eye } from "lucide-react";
import {
  createReviewAction,
  deleteReviewAction,
  moveReviewAction,
  updateReviewAction,
} from "@/actions/reviews";

export default function ReviewsDashboardClient({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [moving, startMove] = useTransition();

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    if (!needle) return reviews;
    return reviews.filter(
      (r) =>
        r.author.toLowerCase().includes(needle) ||
        (r.role ?? "").toLowerCase().includes(needle) ||
        r.quote.toLowerCase().includes(needle),
    );
  }, [reviews, q]);

  const upsert = (row) => {
    setReviews((prev) => {
      const exists = prev.some((r) => r.id === row.id);
      return exists ? prev.map((r) => (r.id === row.id ? row : r)) : [...prev, row];
    });
  };

  const remove = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const move = (id, direction) => {
    setError("");
    setReviews((prev) => {
      const sorted = [...prev].sort((a, b) => a.sort_order - b.sort_order);
      const idx = sorted.findIndex((r) => r.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[swapIdx];
      const aOrder = a.sort_order;
      return prev.map((r) => {
        if (r.id === a.id) return { ...r, sort_order: b.sort_order };
        if (r.id === b.id) return { ...r, sort_order: aOrder };
        return r;
      });
    });
    startMove(async () => {
      const r = await moveReviewAction(id, direction);
      if (!r.ok) setError(r.error ?? "Failed to reorder.");
    });
  };

  const sortedFiltered = useMemo(() => [...filtered].sort((a, b) => a.sort_order - b.sort_order), [filtered]);

  return (
    <div className="min-h-[85vh] bg-[#F8F7F4] py-10">
      <div className="hab-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#1E1E1E] pb-6">
          <div>
            <p className="hab-overline text-[#C9A66B]">Content management</p>
            <h1 className="font-display text-5xl md:text-6xl mt-2 leading-none text-[#1E1E1E]">Reviews</h1>
            <p className="hab-overline mt-3 text-[#5A5A5A]">
              {reviews.filter((r) => r.published).length} of {reviews.length} live on the home page
            </p>
          </div>
          <button onClick={() => setEditing("new")} data-testid="reviews-add-btn" className="hab-btn-primary">
            <Plus size={14} /> Add Review
          </button>
        </div>

        <div className="mt-8 flex items-center gap-3 border border-[#1E1E1E] bg-white px-4 py-3">
          <Search size={18} />
          <input
            data-testid="reviews-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by author, role, quote…"
            className="flex-1 outline-none font-body bg-transparent"
          />
        </div>

        {error && (
          <div data-testid="reviews-error" className="mt-6 border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {sortedFiltered.length === 0 && (
            <div className="text-center py-16 hab-overline text-[#5A5A5A] border border-[#1E1E1E] bg-white" data-testid="reviews-empty-state">
              No reviews match. Add one to feature it on the home page.
            </div>
          )}
          {sortedFiltered.map((r, i) => (
            <div key={r.id} className="border border-[#1E1E1E] bg-white p-5 flex gap-4" data-testid={`reviews-row-${r.id}`}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => move(r.id, "up")}
                  disabled={moving || i === 0}
                  data-testid={`reviews-move-up-${r.id}`}
                  className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#C9A66B] disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => move(r.id, "down")}
                  disabled={moving || i === sortedFiltered.length - 1}
                  data-testid={`reviews-move-down-${r.id}`}
                  className="w-8 h-8 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#C9A66B] disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl leading-tight text-[#1E1E1E]">{r.author}</p>
                    {r.role && <p className="hab-overline text-[#C9A66B] mt-1">{r.role}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      data-testid={`reviews-published-${r.id}`}
                      className={`px-2 py-1 hab-overline text-[10px] flex items-center gap-1 ${
                        r.published ? "bg-[#1E1E1E] text-[#F8F7F4]" : "bg-[#C9A66B]/20 text-[#1E1E1E]/60"
                      }`}
                    >
                      {r.published ? <Eye size={11} /> : <EyeOff size={11} />}
                      {r.published ? "Live" : "Hidden"}
                    </span>
                  </div>
                </div>
                <p className="font-body text-sm mt-3 line-clamp-2 text-[#1E1E1E]/80">&ldquo;{r.quote}&rdquo;</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={14} className={s < r.rating ? "fill-[#C9A66B] text-[#C9A66B]" : "text-[#1E1E1E]/20"} />
                    ))}
                  </div>
                  <button onClick={() => setEditing(r)} data-testid={`reviews-edit-${r.id}`} className="hab-btn-secondary px-4 py-2 text-xs">
                    <Pencil size={13} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <ReviewDrawer
          review={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(row) => {
            upsert(row);
            setEditing(null);
          }}
          onDeleted={(id) => {
            remove(id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ReviewDrawer({ review, onClose, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    author: review?.author ?? "",
    role: review?.role ?? "",
    quote: review?.quote ?? "",
    rating: review?.rating ?? 5,
  });
  const [published, setPublished] = useState(review?.published ?? true);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const isNew = !review;

  const save = () => {
    if (!form.author.trim() || !form.quote.trim()) {
      setError("Author and review text are required.");
      return;
    }
    setError("");
    startTransition(async () => {
      if (isNew) {
        const r = await createReviewAction({ ...form, published });
        if (r.ok && r.data) onSaved(r.data);
        else setError(r.error ?? "Failed to create review.");
      } else {
        const r = await updateReviewAction(review.id, { ...form, role: form.role || null, published });
        if (r.ok && r.data) onSaved(r.data);
        else setError(r.error ?? "Failed to save review.");
      }
    });
  };

  const doDelete = () => {
    if (!review) return;
    if (!window.confirm(`Delete the review from "${review.author}" permanently?`)) return;
    setError("");
    startTransition(async () => {
      const r = await deleteReviewAction(review.id);
      if (r.ok) onDeleted(review.id);
      else setError(r.error ?? "Failed to delete review.");
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-stretch justify-end" onClick={onClose} data-testid="reviews-drawer-overlay">
      <div className="w-full max-w-xl bg-white border-l border-[#1E1E1E] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-[#1E1E1E] flex items-start justify-between">
          <div>
            <p className="hab-overline text-[#C9A66B]">{isNew ? "New review" : "Edit review"}</p>
            <h2 className="font-display text-3xl mt-2 leading-tight text-[#1E1E1E]">{isNew ? "Add a review" : review.author}</h2>
          </div>
          <button onClick={onClose} data-testid="reviews-drawer-close" aria-label="Close" className="w-11 h-11 border border-[#1E1E1E] flex items-center justify-center hover:bg-[#C9A66B]">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <label className="flex flex-col gap-2">
            <span className="hab-overline font-bold">Author *</span>
            <input
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              data-testid="reviews-input-author"
              className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B]"
              placeholder="e.g. Priya M."
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="hab-overline font-bold">Role / project (optional)</span>
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              data-testid="reviews-input-role"
              className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B]"
              placeholder="e.g. Private Residence · Gurdaspur"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="hab-overline font-bold">Review text *</span>
            <textarea
              rows={5}
              value={form.quote}
              onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
              data-testid="reviews-input-quote"
              className="border border-[#1E1E1E]/30 bg-white px-4 py-3 focus:outline-none focus:border-[#C9A66B] resize-y"
              placeholder="What the client said…"
            />
          </label>

          <div>
            <span className="hab-overline font-bold">Rating</span>
            <div className="flex gap-1 mt-2" data-testid="reviews-input-rating">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: value }))}
                    data-testid={`reviews-rating-star-${value}`}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    className="p-1"
                  >
                    <Star size={22} className={value <= form.rating ? "fill-[#C9A66B] text-[#C9A66B]" : "text-[#1E1E1E]/20"} />
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-3 border border-[#1E1E1E] p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              data-testid="reviews-input-published"
              className="w-4 h-4"
            />
            <span className="hab-overline">
              {published ? "Published — visible on the home page" : "Hidden — kept in admin only"}
            </span>
          </label>

          {error && (
            <div data-testid="reviews-drawer-error" className="border border-red-500 bg-red-50 text-red-700 px-4 py-3 hab-overline">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#E5E2DC] pt-6">
            {!isNew ? (
              <button
                onClick={doDelete}
                disabled={pending}
                data-testid="reviews-delete-btn"
                className="border border-red-800 bg-red-600 text-white px-4 py-3 hab-overline flex items-center gap-2 hover:bg-red-700"
              >
                <Trash2 size={14} /> Delete
              </button>
            ) : (
              <span />
            )}
            <button onClick={save} disabled={pending} data-testid="reviews-save-btn" className="hab-btn-primary px-6 py-3 text-xs">
              {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
