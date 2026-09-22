import { useState } from "react";

// Pinned to the same spot on every screen (landing, quiz, brewing, result,
// admin). Drop the real logo file in at public/logo.png (or update the path
// below to a .svg) and it shows up everywhere automatically — no other code
// change needed. Until that file exists this falls back to a small text
// wordmark so the corner never shows a broken-image icon.
export function BrandMark() {
  const [broken, setBroken] = useState(false);
  return (
    <div className="fixed left-4 top-4 z-[70] sm:left-6 sm:top-6">
      {broken ? (
        <span className="font-brand-serif text-base font-black tracking-tight text-brand-deep sm:text-lg">
          백다담
        </span>
      ) : (
        <img
          src="/logo.png"
          alt="백다담"
          className="h-8 w-auto object-contain drop-shadow-sm sm:h-9"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}
