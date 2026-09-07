"use client";

import { useState } from "react";

/**
 * Client Component (CSR):
 * Faylın başında "use client" direktivi yazılır.
 * Bu komponent daxilində:
 * 1. useState (vəziyyəti saxlamaq üçün)
 * 2. onClick (istifadəçi qarşılıqlı əlaqəsi üçün)
 * istifadə edə bilirik. Bu kod brauzerdə işləyəcək.
 */
export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button
      onClick={(e) => {
        // Kartın özünün linkinə kliklənməsinin qarşısını alırıq
        e.preventDefault();
        setLikes((prev) => prev + 1);
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
    >
      <span>❤️</span>
      <span>{likes > 0 ? likes : "Bəyən"}</span>
    </button>
  );
}
