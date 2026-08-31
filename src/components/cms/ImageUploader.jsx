"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Upload, XCircle } from "lucide-react";
import { uploadImageAction } from "@/actions/images";
import { MAX_IMAGE_BYTES, formatMB } from "@/lib/media-limits";

/**
 * Reusable image (or, for video-capable slots, image/MP4) uploader.
 * Supports click-to-choose and drag-and-drop.
 * Delegates the actual write to `uploadImageAction` (Server Action).
 */
export default function ImageUploader({
  slotKey,
  onUploaded,
  compact = false,
  uploadAction = uploadImageAction,
  fieldName = "slot_key",
  accept = "image/*",
  maxBytes = MAX_IMAGE_BYTES,
  allowVideo = false,
}) {
  const inputRef = useRef(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = (file) => {
    setError("");
    const isImage = file.type.startsWith("image/");
    const isVideo = allowVideo && file.type === "video/mp4";
    if (!isImage && !isVideo) {
      setError(allowVideo ? "Only image files or MP4 video are allowed." : "Only image files are allowed.");
      return;
    }
    if (file.size > maxBytes) {
      setError(`Max size is ${formatMB(maxBytes)}.`);
      return;
    }
    const fd = new FormData();
    fd.append(fieldName, slotKey);
    fd.append("file", file);
    startTransition(async () => {
      const result = await uploadAction(fd);
      if (result.ok && result.data) {
        onUploaded(result.data);
      } else {
        setError(result.error ?? "Upload failed.");
      }
    });
  };

  const onSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) uploadFile(f);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !pending && inputRef.current?.click()}
        className={`cursor-pointer border border-dashed transition-colors ${
          dragOver ? "border-[#C9A66B] bg-[#C9A66B]/5" : "border-[#1E1E1E]/40 bg-white hover:border-[#C9A66B] hover:bg-[#C9A66B]/5"
        } ${compact ? "py-6" : "py-10"} px-6 text-center`}
        data-testid={`uploader-${slotKey}`}
        aria-disabled={pending}
      >
        <input ref={inputRef} type="file" accept={accept} hidden onChange={onSelect} data-testid={`uploader-input-${slotKey}`} />
        {pending ? (
          <div className="flex items-center justify-center gap-3 hab-overline">
            <Loader2 className="animate-spin" size={16} /> Uploading…
          </div>
        ) : (
          <>
            <Upload size={compact ? 20 : 28} className="mx-auto mb-3 text-[#C9A66B]" />
            <p className="hab-overline">
              {compact ? "Click or drop to upload" : "Click to choose, or drag & drop"}
            </p>
            {!compact && (
              <p className="hab-overline text-[#5A5A5A] mt-2">
                {allowVideo ? "PNG, JPG, WebP, GIF, SVG or MP4 video" : "PNG, JPG, WebP, GIF, SVG"} · Max {formatMB(maxBytes)}
              </p>
            )}
          </>
        )}
      </div>
      {error && (
        <p data-testid={`uploader-error-${slotKey}`} className="mt-3 flex items-center gap-2 border border-red-500 bg-red-50 text-red-700 px-3 py-2 hab-overline">
          <XCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}
