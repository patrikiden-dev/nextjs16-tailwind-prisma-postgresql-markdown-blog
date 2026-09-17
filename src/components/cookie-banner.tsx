"use client";

import { useState } from "react";

type CookieConsent = "accepted" | "declined" | null;

export default function CookieBanner({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="max-w-6xl mx-auto px-10 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Icon + text */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="mt-0.5 text-base shrink-0">🍪</span>
            <div className="min-w-0">
              <p className="text-sm text-text font-medium mb-0.5"
                style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}>
                We use cookies
              </p>
              <p className="text-xs text-muted leading-relaxed">
                We use cookies to improve your experience, analyse site traffic, and personalise content.
                {" "}
                {!expanded && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="text-blue hover:underline"
                  >
                    Learn more
                  </button>
                )}
              </p>

              {expanded && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      name: "Essential",
                      desc: "Required for the site to work. Cannot be disabled.",
                      always: true,
                    },
                    {
                      name: "Analytics",
                      desc: "Help us understand how visitors interact with the site.",
                      always: false,
                    },
                    {
                      name: "Personalisation",
                      desc: "Remember your preferences and tailor content to you.",
                      always: false,
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="bg-surface border border-border rounded-sm px-3 py-2.5 flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-text"
                          style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}>
                          {item.name}
                        </span>
                        {item.always ? (
                          <span className="text-[10px] text-muted bg-border px-1.5 py-0.5 rounded-sm">
                            Always on
                          </span>
                        ) : (
                          <span className="text-[10px] text-blue bg-(--color-blue-light) px-1.5 py-0.5 rounded-sm">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              onClick={onDecline}
              className="text-xs px-4 py-2 border border-border text-muted hover:border-blue hover:text-blue transition-colors rounded-sm whitespace-nowrap"
            >
              Decline all
            </button>
            <button
              onClick={onAccept}
              className="text-xs px-4 py-2 bg-blue hover:bg-blue-dark text-white transition-colors rounded-sm whitespace-nowrap"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

