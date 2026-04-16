import type { Chapter, ChapterSection, CaseStudy } from "@/content/types";

import { ChapterHeader } from "./ChapterHeader";
import { ProseBlock } from "./ProseBlock";
import { ImageGrid } from "./ImageGrid";
import { PullQuote } from "./PullQuote";
import { BeforeAfter } from "./BeforeAfter";
import { LockedSection } from "./LockedSection";
import { TabGroup } from "./TabGroup";
import { InfoTable } from "./InfoTable";
import { CardGrid } from "./CardGrid";
import { MockupFrame } from "./MockupFrame";
import { SectionDivider } from "./SectionDivider";

/**
 * Renders a single chapter — its header + body sections.
 *
 * The wrapping `<section id={chapter.slug}>` is what `CaseStudyChrome`'s
 * IntersectionObserver watches for scroll-spy. Don't change the id wiring
 * without updating that observer too.
 */
export function ChapterContent({
  chapter,
  cs,
}: {
  chapter: Chapter;
  cs: CaseStudy;
}) {
  return (
    <section
      id={chapter.slug}
      className="scroll-mt-24 py-[clamp(80px,12vh,160px)]"
    >
      <ChapterHeader chapter={chapter} />
      <div>
        {chapter.sections.map((section, i) => (
          <SectionRenderer
            key={i}
            section={section}
            projectTitle={cs.title}
          />
        ))}
      </div>
    </section>
  );
}

function SectionRenderer({
  section,
  projectTitle,
}: {
  section: ChapterSection;
  projectTitle: string;
}) {
  switch (section.kind) {
    case "proseBlock":
      return <ProseBlock section={section} />;
    case "imageGrid":
      return <ImageGrid section={section} />;
    case "pullQuote":
      return <PullQuote section={section} />;
    case "beforeAfter":
      return <BeforeAfter section={section} />;
    case "lockedSection":
      return <LockedSection section={section} projectTitle={projectTitle} />;
    case "tabGroup":
      return <TabGroup section={section} />;
    case "infoTable":
      return <InfoTable section={section} />;
    case "cardGrid":
      return <CardGrid section={section} />;
    case "mockupFrame":
      return <MockupFrame section={section} />;
    case "divider":
      return <SectionDivider />;
    default: {
      // Exhaustive switch — TypeScript errors if a new kind is missed.
      const _exhaustive: never = section;
      return null;
    }
  }
}
