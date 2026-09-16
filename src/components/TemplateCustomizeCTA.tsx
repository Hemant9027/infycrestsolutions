"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Demo } from "@/data/demos";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { trackEvent } from "@/components/AnalyticsTracker";
import ProjectRequestModal from "@/components/ProjectRequestModal";

export default function TemplateCustomizeCTA({ demo }: { demo: Demo }) {
  const [open, setOpen] = useState(false);

  function selectTemplate() {
    trackEvent(ANALYTICS_EVENTS.TEMPLATE_CUSTOMIZE_CLICK, {
      templateSlug: demo.slug,
      templateName: demo.name,
      category: demo.category,
    });
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={selectTemplate}
        aria-label={`Customize ${demo.name} template`}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black"
      >
        Customize This Template <ArrowUpRight className="size-4" />
      </button>
      <ProjectRequestModal
        demo={demo}
        open={open}
        templateMode
        onClose={() => setOpen(false)}
      />
    </>
  );
}
