"use client";

import { useActionState } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import SubmitButton from "@/components/ui/SubmitButton";
import { updateAvatarAction, type AvatarActionState } from "@/actions/profile";

/**
 * Tənzimləmələr → "Profil şəkli" bölməsi.
 * Şəkil `ImageUpload` ilə birbaşa Blob-a yüklənir, "Yadda saxla" isə nəticə
 * URL-ini `updateAvatarAction` vasitəsilə `User.avatar`-a yazır.
 */
export default function AvatarSettings({ initialUrl }: { initialUrl?: string }) {
  const [state, formAction] = useActionState<AvatarActionState | null, FormData>(
    updateAvatarAction,
    null
  );

  return (
    <form action={formAction} className="mt-4 border-t border-slate-100 pt-4">
      <ImageUpload
        name="avatar"
        kind="avatar"
        label="Profil şəkli"
        initialUrl={initialUrl}
        helpText="Navbar-da və məqalələrinizin müəllif blokunda görünür. JPEG, PNG, WebP və ya GIF — maksimum 5 MB."
      />

      {state?.error && (
        <p role="alert" className="mt-3 text-xs font-medium text-rose-600">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p role="status" className="mt-3 text-xs font-medium text-emerald-600">
          Profil şəkli yeniləndi.
        </p>
      )}

      <div className="mt-4 sm:max-w-[200px]">
        <SubmitButton label="Yadda saxla" loadingLabel="Saxlanılır..." />
      </div>
    </form>
  );
}
