"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import {
  IMAGE_CONTENT_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_LABEL,
  buildUploadPath,
  type ImageKind,
} from "@/lib/image";
import { useDictionary } from "@/i18n/client";

interface ImageUploadProps {
  /** Gizli input adı — forma göndərişində Server Action bu sahəni oxuyur. */
  name: string;
  kind: ImageKind;
  /** Redaktə rejimində mövcud şəkil URL-i. */
  initialUrl?: string;
  label: string;
  helpText?: string;
}

const ACCEPT = IMAGE_CONTENT_TYPES.join(",");

type Status = "idle" | "uploading" | "error";

/**
 * Client-upload komponenti (post örtük şəkli + avatar).
 *
 * Fayl brauzerdən birbaşa Vercel Blob-a gedir (`upload()` → `/api/blob/upload`
 * token verir). Nəticə URL-i gizli `<input>`-a yazılır və formanın öz Server
 * Action-ı onu adi mətn sahəsi kimi saxlayır — bu komponent DB-yə toxunmur.
 */
export default function ImageUpload({
  name,
  kind,
  initialUrl,
  label,
  helpText,
}: ImageUploadProps) {
  const dict = useDictionary();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [previewSrc, setPreviewSrc] = useState(initialUrl ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isAvatar = kind === "avatar";

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!IMAGE_CONTENT_TYPES.includes(file.type as (typeof IMAGE_CONTENT_TYPES)[number])) {
        setError(dict.imageUpload.invalidType);
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError(dict.imageUpload.tooLarge.replace("{size}", MAX_IMAGE_LABEL));
        return;
      }

      setStatus("uploading");
      setProgress(0);

      try {
        const result = await upload(buildUploadPath(kind, file.name), file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          clientPayload: kind,
          onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
        });
        setUrl(result.url);
        setPreviewSrc(result.url);
        setStatus("idle");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : dict.imageUpload.genericError);
      }
    },
    [kind, dict]
  );

  const handleRemove = () => {
    setUrl("");
    setPreviewSrc("");
    setError(null);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isUploading = status === "uploading";
  const hasImage = previewSrc.length > 0;

  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input type="hidden" name={name} value={url} />

      <div className="mt-2 flex items-start gap-4">
        <div
          className={`relative shrink-0 overflow-hidden border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 ${
            isAvatar ? "h-20 w-20 rounded-full" : "h-28 w-44 rounded-xl"
          }`}
        >
          {hasImage ? (
            <Image
              src={previewSrc}
              alt=""
              fill
              sizes={isAvatar ? "80px" : "176px"}
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-600">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[11px] font-semibold text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
              {progress}%
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={ACCEPT}
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
            className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 disabled:opacity-60 dark:text-slate-400 dark:file:bg-slate-800 dark:file:text-slate-300 dark:hover:file:bg-slate-700"
          />

          <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            {helpText ?? dict.imageUpload.defaultHelp.replace("{size}", MAX_IMAGE_LABEL)}
          </p>

          {hasImage && !isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-2 text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              {dict.imageUpload.removeImage}
            </button>
          )}

          {error && (
            <p role="alert" className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
