"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "bcn_popup_dismissed";
const DELAY_MS    = 5000;

export default function EmailPopup() {
  const [visible,  setVisible]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Watch for SendFox injecting a success/error message into the form
  useEffect(() => {
    if (!visible || !formRef.current) return;
    const observer = new MutationObserver(() => {
      const el = formRef.current;
      if (!el) return;
      // SendFox appends a <p> or div with success text after submission
      const text = el.textContent ?? "";
      if (
        text.toLowerCase().includes("thank") ||
        text.toLowerCase().includes("success") ||
        text.toLowerCase().includes("subscribed") ||
        text.toLowerCase().includes("confirm")
      ) {
        setSuccess(true);
        localStorage.setItem(STORAGE_KEY, "1");
        setTimeout(dismiss, 2800);
      }
    });
    observer.observe(formRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [visible]);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Load SendFox script once */}
      <Script src="https://cdn.sendfox.com/js/form.js" strategy="lazyOnload" />

      {/* Backdrop */}
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

          {success ? (
            <div className="text-center py-4">
              <p className="text-2xl font-extrabold text-ink mb-2">You&apos;re in! 🎉</p>
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

              {/* SendFox form — styled to match our design */}
              <form
                ref={formRef}
                method="post"
                action="https://sendfox.com/form/1j2kj6/1xxvep"
                className="sendfox-form flex flex-col gap-3"
                id="1xxvep"
                data-async="true"
                data-recaptcha="true"
              >
                <input
                  type="email"
                  id="sendfox_form_email"
                  placeholder="your@email.com"
                  name="email"
                  required
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-brand transition-colors"
                />
                {/* Honeypot — do not remove */}
                <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
                  <input type="text" name="a_password" tabIndex={-1} defaultValue="" autoComplete="off" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  Get Free Cat Tips 🐾
                </button>
              </form>

              <p className="text-center text-xs text-ink/30 mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
