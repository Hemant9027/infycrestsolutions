"use client";

import { Settings2 } from "lucide-react";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event("infycrest:open-cookie-settings"))
      }
      className="text-sm text-neutral-400 transition-colors hover:text-white"
    >
      Cookie Settings
      <Settings2 className="ml-1.5 inline size-3.5" />
    </button>
  );
}
