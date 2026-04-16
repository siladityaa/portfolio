import { about } from "@/lib/content-about";
import { AboutForm } from "@/components/admin/forms/AboutForm";

/**
 * About editor — Step 3. Three text areas: pulled quote + personal bio +
 * professional bio.
 *
 * The /about page also renders the timeline + influences (sourced from
 * `content/timeline.json` and `content/influences.json`). Those get their
 * own editors as a Phase 6.5 follow-on; the v1 admin focuses on the
 * prose blocks that change most often.
 */
export default async function AboutEditPage() {
  return (
    <div className="mx-auto max-w-[820px] px-[clamp(24px,4vw,64px)] py-[clamp(80px,12vh,160px)]">
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        02 — ABOUT
      </span>
      <h1 className="mt-6 max-w-[24ch] text-display-l italic text-[color:var(--surface-ink)]">
        About page
      </h1>
      <p className="mt-6 max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
        Pulled quote + the two-column bio. Timeline and influences are
        edited from a follow-on screen.
      </p>

      <div className="mt-16">
        <AboutForm defaultValues={about} />
      </div>
    </div>
  );
}
