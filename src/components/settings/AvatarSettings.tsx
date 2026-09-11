"use client";

import { useActionState } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import SubmitButton from "@/components/ui/SubmitButton";
import { updateAvatarAction, type AvatarActionState } from "@/actions/profile";
import { useDictionary, useLang } from "@/i18n/client";

/**
 * Tənzimləmələr → "Profil şəkli" bölməsi.
 * Şəkil `ImageUpload` ilə birbaşa Blob-a yüklənir, "Yadda saxla" isə nəticə
 * URL-ini `updateAvatarAction` vasitəsilə `User.avatar`-a yazır.
 */
export default function AvatarSettings({ initialUrl }: { initialUrl?: string }) {
  const dict = useDictionary();
  const lang = useLang();
  const [state, formAction] = useActionState<AvatarActionState | null, FormData>(
    updateAvatarAction,
    null
  );

  return (
    <form action={formAction} className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
      <input type="hidden" name="lang" value={lang} />
      <ImageUpload
        name="avatar"
        kind="avatar"
        label={dict.avatarSettings.label}
        initialUrl={initialUrl}
        helpText={dict.avatarSettings.helpText}
      />

      {state?.error && (
        <p role="alert" className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p role="status" className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {dict.avatarSettings.updated}
        </p>
      )}

      <div className="mt-4 sm:max-w-[200px]">
        <SubmitButton label={dict.avatarSettings.save} loadingLabel={dict.avatarSettings.saving} />
      </div>
    </form>
  );
}
