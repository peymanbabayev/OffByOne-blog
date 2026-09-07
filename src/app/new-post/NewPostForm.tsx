"use client";

import { useActionState } from "react";
import { createPostAction } from "@/actions/posts";
import SubmitButton from "@/components/ui/SubmitButton";
import { useFormErrors } from "@/hooks/useFormErrors";
import { POST_CATEGORIES } from "@/constants/blog";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2";

export default function NewPostForm() {
  const [state, formAction] = useActionState(createPostAction, null);
  const { generalError, getFieldError, clearFieldError } = useFormErrors(state);

  const fieldError = (name: string) => {
    const message = getFieldError(name);
    if (!message) return null;
    return (
      <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
        {message}
      </p>
    );
  };

  return (
    <form action={formAction} noValidate className="space-y-6">
      {generalError && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-2.5">
          <svg
            className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{generalError}</span>
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Məqalə Başlığı
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          onChange={() => clearFieldError("title")}
          placeholder="Məsələn: Next.js 16 ilə Təhlükəsiz Autentifikasiya"
          className={`${inputClass} font-medium`}
        />
        {fieldError("title")}
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Kateqoriya
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={POST_CATEGORIES[0]}
          onChange={() => clearFieldError("category")}
          className={inputClass}
        >
          {POST_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {fieldError("category")}
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>
          Qısa Məzmun (Excerpt)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          onChange={() => clearFieldError("excerpt")}
          placeholder="Yazının ana səhifədə görünəcək qısa icmalı (ən azı 10 simvol)..."
          className={`${inputClass} resize-none`}
        />
        {fieldError("excerpt")}
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>
          Ətraflı Məqalə Mətni
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          onChange={() => clearFieldError("content")}
          placeholder="Məqalənizin tam mətnini buraya daxil edin..."
          className={`${inputClass} leading-relaxed`}
        />
        {fieldError("content")}
      </div>

      <div className="pt-2">
        <SubmitButton label="Məqaləni Dərc Et" loadingLabel="Dərc edilir..." />
      </div>
    </form>
  );
}
