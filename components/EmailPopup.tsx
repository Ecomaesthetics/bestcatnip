"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bcn_popup_dismissed";
const DELAY_MS    = 5000;

export default function EmailPopup() {
  const [visible,  setVisible]  = useState(false);
  const [email,    setEmail]    = useState("");
  const [status,   setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg,   setErrMsg]   = useState("");

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");

    const res  = await fetch("/api/subscribe", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrMsg(data.error ?? "Something went wrong.");
      return;
    }

    setStatus("success");
    localStorage.setItem(STORAGE_KEY, "1");
    setTimeout(dismiss, 2500);
  }

  if (!visible) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-[fadeUp_0.3s_ease]">
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-ink/30 hover:text-ink transition-colors text-xl leading-none"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="text-5xl text-center mb-4">🐱</div>

        {status === "success" ? (
          <div className="text-center">
            <p className="text-2xl font-extrabold text-ink mb-2">You&apos;re in!</p>
            <p className="text-ink/60 text-sm">Thanks for joining. We&apos;ll send you our best cat picks.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-ink text-center mb-1">
              Get the Best Cat Deals
            </h2>
            <p className="text-ink/60 text-sm text-center mb-6">
              Join our list and be the first to know about top-rated catnip, toys, and deals — straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-brand transition-colors"
              />
              {errMsg && <p className="text-red-500 text-xs">{errMsg}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-brand hover:bg-brand/90 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                {status === "loading" ? "Subscribing…" : "Get Free Cat Tips 🐾"}
              </button>
            </form>

            <p className="text-center text-xs text-ink/30 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
