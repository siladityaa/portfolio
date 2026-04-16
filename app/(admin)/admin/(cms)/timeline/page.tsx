import { timelineContentSchema } from "@/content/schemas";
import timelineJson from "@/content/timeline.json";
import { TimelineForm } from "@/components/admin/forms/TimelineForm";

/**
 * Timeline editor — Phase 6.5 lite. Work history + education + awards
 * surfaced on /about. Three useFieldArrays, no nesting beyond one level.
 */
export default async function TimelineEditPage() {
  const defaults = timelineContentSchema.parse(timelineJson);

  return (
    <div className="mx-auto max-w-[820px] px-[clamp(24px,4vw,64px)] py-[clamp(80px,12vh,160px)]">
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        05 — TIMELINE
      </span>
      <h1 className="mt-6 max-w-[24ch] text-display-l italic text-[color:var(--surface-ink)]">
        Timeline
      </h1>
      <p className="mt-6 max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
        Edit the work history, education, and awards lists rendered on the
        /about page. Dates use <code>YYYY-MM</code>, or the literal string
        <code> present </code>for the current role.
      </p>

      <div className="mt-16">
        <TimelineForm defaultValues={defaults} />
      </div>
    </div>
  );
}
