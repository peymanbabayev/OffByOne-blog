"use client";

import { useEffect, useState } from "react";

interface ReadingProgressBarProps {
  className?: string;
  barClassName?: string;
}

/**
 * Səhifə oxunarkən ekranın ən yuxarısında zərif scroll faizi göstərən ümumi UI komponenti
 */
export default function ReadingProgressBar({
  className = "",
  barClassName = "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (progress <= 0) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 h-1 z-50 bg-transparent ${className}`}>
      <div
        className={`h-full transition-all duration-75 ease-out ${barClassName}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
