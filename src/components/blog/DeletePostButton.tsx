"use client";

import { useActionState, useState } from "react";
import { deletePostAction } from "@/actions/posts";

interface DeletePostButtonProps {
  postId: string;
}

/**
 * Client Component: iki mərhələli silmə.
 *
 * - JS aktivdirsə: birinci klik "silahlandırır", ikinci klik göndərir.
 * - JS yoxdursa: forma birbaşa göndərilir (server action onsuz da icazəni yoxlayır).
 * `useActionState` serverdən qayıdan xətanı göstərir; uğurlu halda
 * `deletePostAction` özü ana səhifəyə `redirect` edir.
 */
export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [armed, setArmed] = useState(false);
  const [state, formAction, isPending] = useActionState(deletePostAction, null);

  return (
    <div className="flex flex-col gap-1.5">
      <form action={formAction} className="flex items-center gap-2">
        <input type="hidden" name="postId" value={postId} />
        <button
          type="submit"
          disabled={isPending}
          onClick={(e) => {
            if (!armed) {
              e.preventDefault();
              setArmed(true);
            }
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
            armed
              ? "text-white bg-red-600 hover:bg-red-700"
              : "text-red-600 border border-red-200 bg-white hover:bg-red-50"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          <span>{isPending ? "Silinir..." : armed ? "Təsdiqlə və sil" : "Sil"}</span>
        </button>

        {armed && (
          <button
            type="button"
            onClick={() => setArmed(false)}
            disabled={isPending}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            İmtina
          </button>
        )}
      </form>

      {armed && !isPending && (
        <p className="text-[11px] text-slate-500">
          Diqqət: bu əməliyyat geri qaytarıla bilməz.
        </p>
      )}
      {state?.error && (
        <p role="alert" className="text-xs text-red-600 font-medium">
          {state.error}
        </p>
      )}
    </div>
  );
}
