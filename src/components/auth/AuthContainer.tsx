"use client";

import { useState, useEffect, useCallback } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import LoginForm from "@/app/login/LoginForm";
import RegisterForm from "@/app/register/RegisterForm";

interface AuthContainerProps {
  initialMode: "login" | "register";
  from?: string;
}

export default function AuthContainer({
  initialMode,
  from = "/",
}: AuthContainerProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  const loginHref =
    from && from !== "/"
      ? `/login?from=${encodeURIComponent(from)}`
      : "/login";

  const registerHref =
    from && from !== "/"
      ? `/register?from=${encodeURIComponent(from)}`
      : "/register";

  const switchMode = useCallback(
    (newMode: "login" | "register") => {
      if (newMode === mode) return;
      setMode(newMode);
      const targetUrl = newMode === "login" ? loginHref : registerHref;
      // Səhifəni tam yenidən yükləmədən (remount etmədən) URL-i ani və rəvan yeniləyir
      window.history.replaceState(null, "", targetUrl);
    },
    [mode, loginHref, registerHref]
  );

  // Brauzerin "Geri" və "İrəli" düymələrini rəvan dəstəkləyir
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes("/register")) {
        setMode("register");
      } else if (window.location.pathname.includes("/login")) {
        setMode("login");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Ambient arxa fon işığı */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-sky-400/10 to-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="w-full max-w-md mx-auto">
        {/* Brend Başlığı (Heç vaxt remount olmur, stabil qalır) */}
        <div className="flex flex-col items-center text-center mb-8">
          <BrandLogo size="lg" href="/" className="mb-4" />
          
          <div className="min-h-[72px] flex flex-col items-center justify-center">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight transition-all duration-200">
              {mode === "login" ? "OffByOne-a Giriş" : "Hesab Yaradın"}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed transition-all duration-200">
              {mode === "login"
                ? "Mühəndislik yazılarını idarə etmək və yeni məzmun dərc etmək üçün daxil olun."
                : "Sistem arxitekturası və mühəndislik qeydlərinizi paylaşmaq üçün qoşulun."}
            </p>
          </div>
        </div>

        {/* Vahid Auth Kartı */}
        <div className="bg-white/95 backdrop-blur-sm p-7 sm:p-9 rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/40 transition-all duration-300">
          {/* Animasiyalı Sürüşən Tab Switcher */}
          <div className="relative flex p-1 mb-6 rounded-xl bg-slate-100 text-xs font-semibold">
            {/* Rəvan sürüşən ağ həb (Animated gliding pill) */}
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm transition-all duration-300 ease-out"
              style={{
                left: mode === "login" ? "4px" : "calc(50% + 2px)",
                width: "calc(50% - 6px)",
              }}
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`relative z-10 w-1/2 py-2 text-center rounded-lg transition-colors duration-200 cursor-pointer ${
                mode === "login"
                  ? "text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              Daxil ol
            </button>

            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`relative z-10 w-1/2 py-2 text-center rounded-lg transition-colors duration-200 cursor-pointer ${
                mode === "register"
                  ? "text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              Qeydiyyat
            </button>
          </div>

          {/* Form Keçidi (Smooth Cross-fade) */}
          <div className="relative transition-all duration-300">
            {mode === "login" ? (
              <div key="login-view" className="animate-fadeIn">
                <LoginForm
                  from={from}
                  onSwitchToRegister={() => switchMode("register")}
                />
              </div>
            ) : (
              <div key="register-view" className="animate-fadeIn">
                <RegisterForm
                  from={from}
                  onSwitchToLogin={() => switchMode("login")}
                />
              </div>
            )}
          </div>
        </div>

        {/* Təhlükəsizlik və Memarlıq Qeydi */}
        <p className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Şifrələnmiş JWT Sessiyası &bull; OWASP Müdafiəsi</span>
        </p>
      </div>
    </div>
  );
}
