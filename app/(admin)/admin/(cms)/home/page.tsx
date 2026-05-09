import { getHome } from "@/lib/content-home";
import { HomeForm } from "@/components/admin/forms/HomeForm";

// Always fetch fresh in admin so saves show up immediately.
export const dynamic = "force-dynamic";

/**
 * Home editor — two-field form (hero sentence + mono subline).
 */
export default async function HomeEditPage() {
  const home = await getHome();
  return (
    <div className="mx-auto max-w-[720px] px-[clamp(24px,4vw,64px)] py-[clamp(80px,12vh,160px)]">
      <span className="text-mono-s text-[color:var(--surface-graphite)]">
        03 — HOME
      </span>
      <h1 className="mt-6 max-w-[24ch] text-display-l italic text-[color:var(--surface-ink)]">
        Home page
      </h1>
      <p className="mt-6 max-w-[55ch] text-body text-[color:var(--surface-graphite)]">
        Two fields. The hero sentence is the loudest moment on the site —
        edit with care.
      </p>

      <div className="mt-16">
        <HomeForm defaultValues={home} />
      </div>
    </div>
  );
}
