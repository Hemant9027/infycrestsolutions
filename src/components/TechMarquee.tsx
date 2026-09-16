import type { IconType } from "react-icons";
import {
  SiAngular,
  SiDocker,
  SiFirebase,
  SiFlutter,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import { TECHNOLOGIES, type Technology } from "@/data/technologies";
import { Eyebrow } from "@/components/Reveal";

const TECH_ROW_A = TECHNOLOGIES.slice(0, Math.ceil(TECHNOLOGIES.length / 2));
const TECH_ROW_B = TECHNOLOGIES.slice(Math.ceil(TECHNOLOGIES.length / 2));

const TECH_ICONS: Record<string, IconType> = {
  "Next.js": SiNextdotjs,
  React: SiReact,
  "Node.js": SiNodedotjs,
  Python: SiPython,
  "Tailwind CSS": SiTailwindcss,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Flutter: SiFlutter,
  TypeScript: SiTypescript,
  Docker: SiDocker,
  AWS: FaAws,
  Firebase: SiFirebase,
  "Vue.js": SiVuedotjs,
  Angular: SiAngular,
  PHP: SiPhp,
  Laravel: SiLaravel,
  MySQL: SiMysql,
  Supabase: SiSupabase,
  "Three.js": SiThreedotjs,
};

const TECH_COLORS: Record<string, string> = {
  "Next.js": "#111111",
  React: "#61dafb",
  "Node.js": "#5fa04e",
  Python: "#3776ab",
  "Tailwind CSS": "#06b6d4",
  PostgreSQL: "#4169e1",
  MongoDB: "#47a248",
  Flutter: "#54c5f8",
  TypeScript: "#3178c6",
  Docker: "#2496ed",
  AWS: "#ff9900",
  Firebase: "#ffca28",
  "Vue.js": "#42b883",
  Angular: "#dd0031",
  PHP: "#777bb4",
  Laravel: "#ff2d20",
  MySQL: "#4479a1",
  Supabase: "#3ecf8e",
  "Three.js": "#111111",
};

function Pill({ tech }: { tech: Technology }) {
  const Icon = TECH_ICONS[tech.name];

  return (
    <span className="mx-1.5 flex shrink-0 items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-5 py-3 text-[13.5px] font-medium text-neutral-600 transition-colors duration-300 hover:border-neutral-900 hover:text-neutral-900">
      <span className="grid size-6 place-items-center rounded-full bg-neutral-50 ring-2 ring-neutral-100">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="size-3.5"
            color={TECH_COLORS[tech.name] ?? "#171717"}
          />
        ) : (
          <span className="text-[8px] font-semibold text-neutral-900">
            {tech.mark}
          </span>
        )}
      </span>
      {tech.name}
    </span>
  );
}

function Row({
  items,
  reverse = false,
}: {
  items: Technology[];
  reverse?: boolean;
}) {
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div
        className={`flex w-max shrink-0 py-1 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {items.map((tech) => (
              <Pill key={`${copy}-${tech.name}`} tech={tech} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="group border-y border-neutral-100 bg-neutral-50/60 py-14 sm:py-16">
      <div className="mb-9 flex justify-center">
        <Eyebrow>09 / Technology</Eyebrow>
      </div>
      <div className="space-y-3">
        <Row items={TECH_ROW_A} />
        <Row items={TECH_ROW_B} reverse />
      </div>
    </section>
  );
}
