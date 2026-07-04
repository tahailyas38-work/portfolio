import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { SideProjects } from "@/components/SideProjects";
import { caseStudies } from "@/lib/data";

export const metadata = {
  title: "Work — Taha",
  description: "Case studies and side projects by Muhammad Taha Madni.",
};

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="px-6 pb-8 pt-32 lg:px-8 lg:pt-36">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted transition-opacity hover:opacity-60"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to home
            </Link>
            <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Work
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
              Case studies from enterprise and consumer products, plus side
              projects and experiments built outside the day job.
            </p>
          </div>
        </section>

        <section id="case-studies" className="px-6 py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-16 font-display text-2xl font-semibold tracking-tight sm:text-3xl lg:mb-24">
              Case Studies
            </h2>

            <div className="space-y-28 lg:space-y-40">
              {caseStudies.map((project) => (
                <div key={project.id} id={project.id}>
                  <CaseStudyCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <SideProjects />
      </main>
      <Footer />
    </>
  );
}
