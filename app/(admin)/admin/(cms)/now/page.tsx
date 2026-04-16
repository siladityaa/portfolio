import { nowContentSchema } from "@/content/schemas";
import nowJson from "@/content/now.json";
import { NowForm } from "@/components/admin/forms/NowForm";

/**
 * Now editor — Step 3. Three lists (now-playing tracks, currently-facts,
 * previously-facts) edited via RHF + useFieldArray.
 */
export default async function NowEditPage() {
  // Read the raw JSON straight (rather than the typed re-exports from
  // content/now.ts) so the form sees the canonical NowContent shape.
  const defaults = nowContentSchema.parse(nowJson);

  return (
    <div className="mx-auto max-w-[820px] px-[clamp(24px,4vw,64px)] py-[clamp(80px,12vh,160px)]">
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        04 — NOW
      </span>
      <h1 className="mt-6 max-w-[24ch] text-display-l italic text-[color:var(--surface-ink)]">
        Now block
      </h1>
      <p className="mt-6 max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
        Update the rotating tracks in the bottom-left chrome and the
        currently / previously fact lists used on the home and about pages.
      </p>

      <div className="mt-16">
        <NowForm defaultValues={defaults} />
      </div>
    </div>
  );
}
