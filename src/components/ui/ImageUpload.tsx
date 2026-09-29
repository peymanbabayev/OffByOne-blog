"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
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
import ImagePreviewModal from "@/components/ui/ImagePreviewModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface ImageUploadProps {
  /** Gizli input adı — forma göndərişində Server Action bu sahəni oxuyur. */
  name: string;
  kind: ImageKind;
  /** Redaktə rejimində mövcud şəkil URL-i. */
  initialUrl?: string;
  label: string;
  helpText?: string;
  /** Verilərsə komponent idarə olunan rejimdə işləyir (URL valideyndə saxlanılır). */
  value?: string;
  onChange?: (url: string) => void;
  /** Xarici əməliyyat (məs. AI generasiyası) davam edərkən yükləməni bloklayır. */
  busy?: boolean;
  /** Fayl seçiminin altında göstərilən əlavə əməliyyat (məs. AI düyməsi). */
  extraAction?: ReactNode;
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
  value,
  onChange,
  busy = false,
  extraAction,
}: ImageUploadProps) {
  const dict = useDictionary();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalUrl, setInternalUrl] = useState(initialUrl ?? "");
  const isControlled = value !== undefined;
  const url = isControlled ? value : internalUrl;
  const setUrl = useCallback(
    (next: string) => {
      if (!isControlled) setInternalUrl(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );
  const [status, setStatus] = useState<Status>("idle");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const closePreview = useCallback(() => setIsPreviewOpen(false), []);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const closeConfirm = useCallback(() => setIsConfirmOpen(false), []);
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
        setStatus("idle");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : dict.imageUpload.genericError);
      }
    },
    [kind, dict, setUrl]
  );

  const handleRemove = () => {
    setIsConfirmOpen(false);
    setUrl("");
    setError(null);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isUploading = status === "uploading";
  const isBlocked = isUploading || busy;
  const hasImage = url.length > 0;

  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input type="hidden" name={name} value={url} />

      <div className="mt-2 flex items-start gap-4">
        <div
          className={`group relative shrink-0 overflow-hidden border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 ${
            isAvatar ? "h-20 w-20 rounded-full" : "h-28 w-44 rounded-xl"
          }`}
        >
          {hasImage ? (
            <>
              <Image
                src={url}
                alt=""
                fill
                sizes={isAvatar ? "80px" : "176px"}
                className="object-cover"
                unoptimized
              />
              {!isBlocked && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/45 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100 pointer-coarse:opacity-100">
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    aria-label={dict.imageUpload.previewOpen}
                    title={dict.imageUpload.previewOpen}
                    className="rounded-full bg-white/90 p-1.5 text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmOpen(true)}
                    aria-label={dict.imageUpload.removeImage}
                    title={dict.imageUpload.removeImage}
                    className="rounded-full bg-white/90 p-1.5 text-rose-600 shadow-sm transition hover:bg-white hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              )}
            </>
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

          {busy && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-600 dark:border-t-blue-400" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={ACCEPT}
            disabled={isBlocked}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
            className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 disabled:opacity-60 dark:text-slate-400 dark:file:bg-slate-800 dark:file:text-slate-300 dark:hover:file:bg-slate-700"
          />

          <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            {helpText ?? dict.imageUpload.defaultHelp.replace("{size}", MAX_IMAGE_LABEL)}
          </p>

          {extraAction}

          {error && (
            <p role="alert" className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>

      {isPreviewOpen && hasImage && (
        <ImagePreviewModal
          src={url}
          alt={label}
          closeLabel={dict.imageUpload.previewClose}
          onClose={closePreview}
        />
      )}

      {isConfirmOpen && hasImage && (
        <ConfirmDialog
          title={dict.imageUpload.removeConfirmTitle}
          message={dict.imageUpload.removeConfirmMessage}
          confirmLabel={dict.imageUpload.removeConfirm}
          cancelLabel={dict.imageUpload.removeCancel}
          onConfirm={handleRemove}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
}
