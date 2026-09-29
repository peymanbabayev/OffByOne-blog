"use client";

import { useActionState, useState, useTransition } from "react";
import SubmitButton from "@/components/ui/SubmitButton";
import ImageUpload from "@/components/ui/ImageUpload";
import { useFormErrors } from "@/hooks/useFormErrors";
import { POST_CATEGORIES } from "@/constants/blog";
import { generateSlug } from "@/lib/slug";
import { AI_IMAGE_MIN_CONTENT_CHARS } from "@/lib/image";
import type { PostFormState } from "@/actions/posts";
import { generateCoverImageAction, type GenerateCoverImageResult } from "@/actions/ai-image";
import type { Dictionary } from "@/i18n/types";
import { useDictionary, useLang } from "@/i18n/client";

type PostFormAction = (
  state: PostFormState | null,
  formData: FormData
) => Promise<PostFormState>;

interface PostFormProps {
  /** Bağlanmış (`.bind`) Server Action — yaratma və ya redaktə. */
  action: PostFormAction;
  submitLabel: string;
  submitLoadingLabel: string;
  /** Redaktə rejimində mövcud dəyərlər. */
  initialValues?: {
    title?: string;
    category?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
  };
  /**
   * Redaktə rejimində: məqalənin mövcud slug-ı.
   * Verildikdə redaktə oluna bilən "URL (slug)" sahəsi göstərilir; verilmədikdə
   * forma "yaratma" rejimindədir və başlıqdan canlı slug önbaxışı göstərir.
   */
  currentSlug?: string;
}

const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300";

function aiErrorMessage(dict: Dictionary, result: Extract<GenerateCoverImageResult, { ok: false }>): string {
  switch (result.code) {
    case "too_short":
      return dict.aiImage.tooShort.replace("{min}", String(result.min ?? AI_IMAGE_MIN_CONTENT_CHARS));
    case "user_limit":
      return dict.aiImage.userLimit.replace("{limit}", String(result.limit ?? ""));
    case "global_limit":
      return dict.aiImage.globalLimit;
    case "not_configured":
      return dict.aiImage.notConfigured;
    case "unauthorized":
      return dict.aiImage.unauthorized;
    default:
      return dict.aiImage.failed;
  }
}

const getInputClass = (hasError: boolean) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm transition-all shadow-sm focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-300 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-200"
      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
  }`;

export default function PostForm({
  action,
  submitLabel,
  submitLoadingLabel,
  initialValues,
  currentSlug,
}: PostFormProps) {
  const dict = useDictionary();
  const lang = useLang();
  const [state, formAction] = useActionState(action, null);
  const { generalError, getFieldError, clearFieldError } = useFormErrors(state);

  const isEdit = currentSlug !== undefined;

  // Server Action-dan qayıdan dəyərlər (validasiya xətası) ilkin dəyərləri üstələyir
  const [title, setTitle] = useState(state?.fields?.title ?? initialValues?.title ?? "");
  const [excerpt, setExcerpt] = useState(
    state?.fields?.excerpt ?? initialValues?.excerpt ?? ""
  );
  const [slug, setSlug] = useState(state?.fields?.slug ?? currentSlug ?? "");

  const defaultCategory =
    state?.fields?.category || initialValues?.category || POST_CATEGORIES[0];
  const [content, setContent] = useState(state?.fields?.content ?? initialValues?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(
    state?.fields?.coverImage ?? initialValues?.coverImage ?? ""
  );

  const [isGenerating, startGenerating] = useTransition();
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiRemaining, setAiRemaining] = useState<number | null>(null);
  const contentLength = content.trim().length;
  const canGenerate = title.trim().length > 0 && contentLength >= AI_IMAGE_MIN_CONTENT_CHARS;

  const handleGenerateCover = () => {
    setAiError(null);
    startGenerating(async () => {
      const result = await generateCoverImageAction({ title, content });
      if (result.ok) {
        setCoverUrl(result.url);
        setAiRemaining(result.remaining);
      } else {
        setAiError(aiErrorMessage(dict, result));
      }
    });
  };

  // Yaratma: başlıqdan; Redaktə: slug xanasından
  const slugPreview = isEdit ? generateSlug(slug) : generateSlug(title);
  const slugWillChange = isEdit && slugPreview.length > 0 && slugPreview !== currentSlug;

  const titleError = getFieldError("title");
  const slugError = getFieldError("slug");
  const categoryError = getFieldError("category");
  const excerptError = getFieldError("excerpt");
  const contentError = getFieldError("content");

  const renderFieldError = (fieldName: string) => {
    const message = getFieldError(fieldName);
    if (!message) return null;
    return (
      <p
        id={`${fieldName}-error`}
        role="alert"
        className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1 animate-fadeIn dark:text-red-400"
      >
        <svg className="w-3.5 h-3.5 shrink-0 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{message}</span>
      </p>
    );
  };

  return (
    <form action={formAction} noValidate className="space-y-6">
      <input type="hidden" name="lang" value={lang} />

      {generalError && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-2.5 animate-fadeIn dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{generalError}</span>
        </div>
      )}

      {/* 1. Məqalə Başlığı */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="title" className={labelClass}>
            {dict.postForm.titleLabel}
          </label>
          <span
            className={`text-[11px] font-mono ${
              title.length > 120
                ? "text-red-500 font-bold"
                : title.length >= 3
                ? "text-slate-500 dark:text-slate-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {title.length}/120
          </span>
        </div>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          aria-invalid={!!titleError}
          aria-describedby={titleError ? "title-error" : undefined}
          onChange={(e) => {
            setTitle(e.target.value);
            clearFieldError("title");
          }}
          placeholder={dict.postForm.titlePlaceholder}
          className={`${getInputClass(!!titleError)} font-medium`}
        />
        {renderFieldError("title")}

        {/* Yaratma rejimi: başlıqdan canlı slug önbaxışı */}
        {!isEdit && slugPreview && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-lg overflow-hidden animate-fadeIn dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
            <span className="text-slate-400 select-none dark:text-slate-500">🔗 {dict.postForm.linkPreviewLabel}</span>
            <span className="text-blue-600 font-mono font-medium truncate dark:text-blue-400">/blog/{slugPreview}</span>
          </div>
        )}
      </div>

      {/* 1b. URL (slug) — yalnız redaktə rejimində, dəyişdirilə bilər */}
      {isEdit && (
        <div>
          <label htmlFor="slug" className={`${labelClass} mb-1.5`}>
            {dict.postForm.slugLabel}
          </label>
          <div className="flex items-stretch rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 dark:border-slate-700 dark:bg-slate-900">
            <span className="flex items-center px-3 text-xs font-mono text-slate-400 bg-slate-50 border-r border-slate-200 select-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
              /blog/
            </span>
            <input
              id="slug"
              name="slug"
              type="text"
              value={slug}
              aria-invalid={!!slugError}
              aria-describedby={slugError ? "slug-error" : undefined}
              onChange={(e) => {
                setSlug(e.target.value);
                clearFieldError("slug");
              }}
              placeholder={dict.postForm.slugPlaceholder}
              className="flex-1 px-3 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
          {renderFieldError("slug")}
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            {dict.postForm.finalUrlLabel}{" "}
            <span className="font-mono text-blue-600 dark:text-blue-400">/blog/{slugPreview || "…"}</span>
            {slugWillChange && (
              <span className="text-amber-600 dark:text-amber-400">
                {" "}
                {dict.postForm.slugChangeWarning.replace("{oldSlug}", `/blog/${currentSlug}`)}
              </span>
            )}
          </p>
        </div>
      )}

      {/* 1c. Örtük şəkli (istəyə bağlı) */}
      <ImageUpload
        name="coverImage"
        kind="cover"
        label={dict.postForm.coverImageLabel}
        value={coverUrl}
        onChange={setCoverUrl}
        busy={isGenerating}
        helpText={dict.postForm.coverImageHelp}
        extraAction={
          <div className="mt-3">
            <button
              type="button"
              onClick={handleGenerateCover}
              disabled={!canGenerate || isGenerating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              {isGenerating
                ? dict.aiImage.generating
                : coverUrl
                ? dict.aiImage.regenerate
                : dict.aiImage.generate}
            </button>
            {!canGenerate && (
              <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                {dict.aiImage.needMoreText
                  .replaceAll("{min}", String(AI_IMAGE_MIN_CONTENT_CHARS))
                  .replace("{count}", String(contentLength))}
              </p>
            )}
            {aiRemaining !== null && !aiError && (
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                {dict.aiImage.remaining.replace("{count}", String(aiRemaining))}
              </p>
            )}
            {aiError && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                {aiError}
              </p>
            )}
          </div>
        }
      />

      {/* 2. Kateqoriya */}
      <div>
        <label htmlFor="category" className={`${labelClass} mb-1.5`}>
          {dict.postForm.categoryLabel}
        </label>
        <select
          key={defaultCategory}
          id="category"
          name="category"
          required
          defaultValue={defaultCategory}
          aria-invalid={!!categoryError}
          aria-describedby={categoryError ? "category-error" : undefined}
          onChange={() => clearFieldError("category")}
          className={getInputClass(!!categoryError)}
        >
          {POST_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {renderFieldError("category")}
      </div>

      {/* 3. Qısa Məzmun (Excerpt) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="excerpt" className={labelClass}>
            {dict.postForm.excerptLabel}
          </label>
          <span
            className={`text-[11px] font-mono ${
              excerpt.length > 300
                ? "text-red-500 font-bold"
                : excerpt.length >= 10
                ? "text-slate-500 dark:text-slate-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {excerpt.length}/300
          </span>
        </div>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={3}
          value={excerpt}
          aria-invalid={!!excerptError}
          aria-describedby={excerptError ? "excerpt-error" : undefined}
          onChange={(e) => {
            setExcerpt(e.target.value);
            clearFieldError("excerpt");
          }}
          placeholder={dict.postForm.excerptPlaceholder}
          className={`${getInputClass(!!excerptError)} resize-none leading-relaxed`}
        />
        {renderFieldError("excerpt")}
      </div>

      {/* 4. Ətraflı Məqalə Mətni */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="content" className={labelClass}>
            {dict.postForm.contentLabel}
          </label>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">{dict.postForm.contentHint}</span>
        </div>
        <textarea
          id="content"
          name="content"
          required
          rows={12}
          value={content}
          aria-invalid={!!contentError}
          aria-describedby={contentError ? "content-error" : undefined}
          onChange={(e) => {
            setContent(e.target.value);
            clearFieldError("content");
          }}
          placeholder={dict.postForm.contentPlaceholder}
          className={`${getInputClass(!!contentError)} leading-relaxed font-sans`}
        />
        {renderFieldError("content")}
      </div>

      {/* 5. Göndərmə Düyməsi */}
      <div className="pt-2">
        <SubmitButton label={submitLabel} loadingLabel={submitLoadingLabel} />
      </div>
    </form>
  );
}
