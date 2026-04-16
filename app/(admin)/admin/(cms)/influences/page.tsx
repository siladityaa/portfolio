import { influencesContentSchema } from "@/content/schemas";
import influencesJson from "@/content/influences.json";
import { InfluencesForm } from "@/components/admin/forms/InfluencesForm";

/**
 * Influences editor — Phase 6.5 lite. Flat list of influences shown on
 * the /about page grid. Name, category (enum), and a short "why" blurb.
 */
export default async function InfluencesEditPage() {
  const defaults = influencesContentSchema.parse(influencesJson);

  return (
    <div className="mx-auto max-w-[820px] px-[clamp(24px,4vw,64px)] py-[clamp(80px,12vh,160px)]">
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        06 — INFLUENCES
      </span>
      <h1 className="mt-6 max-w-[24ch] text-display-l italic text-[color:var(--surface-ink)]">
        Influences
      </h1>
      <p className="mt-6 max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
        Edit the grid of brands, people, studios, and objects that shape
        the work. Each gets a short first-person note on why it sticks.
      </p>

      <div className="mt-16">
        <InfluencesForm defaultValues={defaults} />
      </div>
    </div>
  );
}
