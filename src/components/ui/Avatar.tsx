import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  /**
   * Ölçü, forma, fallback fonu və mətn üslubu buradan gəlir (mövcud dizaynı qoruyur).
   * Məs: "h-10 w-10 rounded-full bg-slate-900 text-xs font-semibold text-white".
   */
  className?: string;
  /** `next/image` üçün `sizes` (fallback: "40px"). */
  imgSizes?: string;
}

/**
 * İstifadəçi/müəllif avatarı — şəkil varsa `next/image`, yoxdursa adın baş hərfi.
 * Server Component: navbar, məqalə müəllif bloku və müəllif kartı bunu paylaşır.
 */
export default function Avatar({ src, name, className, imgSizes = "40px" }: AvatarProps) {
  const initial = (name?.trim().charAt(0) || "?").toUpperCase();

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${
        className ?? ""
      }`}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? ""}
          fill
          sizes={imgSizes}
          className="object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
}
