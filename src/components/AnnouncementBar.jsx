import { useState } from "react";

/* ============================================================================
   ANNOUNCEMENT BAR
   ----------------------------------------------------------------------------
   The thin strip above the header. To change the wording or turn it off,
   edit MESSAGE below — set it to an empty string to hide the bar entirely.

   ⚠️ The $60 here is a marketing claim, not the rule that gets applied.
   The real threshold lives in DELIVERY_RULES in the backend's
   routes/deliveryRoutes.js. If that changes, change this text too or the
   site will promise something it doesn't do.
   ========================================================================== */
const MESSAGE = "Free Islandwide Delivery For Orders $60 and Above";

const AnnouncementBar = () => {
  const [dismissed, setDismissed] = useState(false);

  if (!MESSAGE || dismissed) return null;

  return (
    <div className="w-full bg-[#1E3A8A] text-white">
      <div className="relative max-w-7xl mx-auto px-8 py-2">
        <p className="text-center text-[11px] sm:text-xs font-medium tracking-wide">
          {MESSAGE}
        </p>

        {/* Small target, low contrast — present but not competing with the
            message itself. */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/60 hover:text-white transition"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M1 1l10 10M11 1L1 11" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;