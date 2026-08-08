import Link from "next/link";
import { TagBadge } from "@/components/TagBadge";

export type CaseStudyItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "Live" | "Designed";
  gradient?: string;
  locked?: boolean;
  image?: string;
};

function StatusPill({ status }: { status: "Live" | "Designed" }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700">
      {status === "Live" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
      )}
      {status}
    </span>
  );
}

export function CaseStudyCard({ project }: { project: CaseStudyItem }) {
  return (
    <article className="grid items-center gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16 xl:gap-24">
      <div className="lg:py-4">
        <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h3>
        <p className="mt-5 max-w-sm text-base leading-relaxed text-gray-500 sm:text-lg">
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusPill status={project.status} />
          {project.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        {!project.locked && (
          <Link
            href={`/work#${project.id}`}
            className="mt-9 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: "#0071e3" }}
          >
            View Case Study
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>

      <div
        className="relative min-h-[400px] overflow-hidden rounded-2xl bg-[#f0f0f0]"
        style={project.gradient ? { background: project.gradient } : undefined}
      >
        {project.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt={`${project.title} preview`} className="h-full w-full object-cover" />
        )}
      </div>
    </article>
  );
}
