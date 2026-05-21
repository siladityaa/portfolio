import jsPDF from "jspdf";

import { resume } from "@/content/resume";

/**
 * Generate an ATS-friendly PDF of the résumé — built fresh on every
 * download click, straight from `content/resume.ts`.
 *
 * Because the résumé page and this generator both read that one module,
 * the downloaded PDF is always identical in content to the live page.
 * There is no stored PDF file and no second copy of the data to drift.
 *
 * ATS-friendly means: real selectable text (not images), standard fonts
 * (Helvetica, built into every PDF reader), clear section headings, and
 * no multi-column layouts or tables that resume parsers choke on.
 *
 * Letter size = 612 × 792 pt. Content flows top-to-bottom and paginates
 * automatically — `ensureSpace()` adds a page before any block that
 * wouldn't fit, so rich content never gets clipped.
 */
export function generateResumePDF() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const m = 40; // margin
  const w = pageWidth - m * 2; // content width
  const bottom = pageHeight - m; // last usable y
  let y = 38;

  /** Add a page + reset the cursor if `needed` pt won't fit below `y`. */
  const ensureSpace = (needed: number) => {
    if (y + needed > bottom) {
      doc.addPage();
      y = 38;
    }
  };

  /** Section divider hairline. */
  const divider = () => {
    doc.setDrawColor(195, 195, 195);
    doc.setLineWidth(0.4);
    doc.line(m, y, pageWidth - m, y);
    y += 10;
  };

  /** Section heading — bold 9pt label, with a page-break guard. */
  const sectionHeading = (label: string) => {
    ensureSpace(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(17, 17, 19);
    doc.text(label, m, y);
    y += 13;
  };

  /* ================================================================== */
  /* Header                                                              */
  /* ================================================================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(17, 17, 19);
  doc.text(resume.name, m, y);
  y += 15;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text(resume.tagline, m, y);
  y += 11;

  doc.setFontSize(8);
  const contactLine = resume.contact.map((c) => c.label).join("  |  ");
  doc.text(contactLine, m, y);
  y += 12;

  divider();

  /* ================================================================== */
  /* Summary                                                             */
  /* ================================================================== */
  sectionHeading("SUMMARY");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  for (const para of [resume.summary.primary, resume.summary.secondary]) {
    const lines = doc.splitTextToSize(para, w);
    ensureSpace(lines.length * 10);
    doc.text(lines, m, y);
    y += lines.length * 10 + 4;
  }
  y += 4;

  divider();

  /* ================================================================== */
  /* Experience                                                          */
  /* ================================================================== */
  sectionHeading("EXPERIENCE");

  for (let j = 0; j < resume.experience.length; j++) {
    const job = resume.experience[j];

    // Keep the job header + first bullet line together on one page.
    ensureSpace(40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(17, 17, 19);
    doc.text(job.role, m, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(job.period, pageWidth - m, y, { align: "right" });
    y += 11;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(`${job.company}  ·  ${job.location}`, m, y);
    y += 11;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    for (const bullet of job.bullets) {
      const lines = doc.splitTextToSize(bullet, w - 12);
      ensureSpace(lines.length * 10);
      lines.forEach((line: string, i: number) => {
        doc.text(i === 0 ? `•  ${line}` : `   ${line}`, m + 4, y);
        y += 10;
      });
    }
    y += j < resume.experience.length - 1 ? 6 : 8;
  }

  divider();

  /* ================================================================== */
  /* Education                                                           */
  /* ================================================================== */
  sectionHeading("EDUCATION");

  ensureSpace(36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 19);
  doc.text(resume.education.school, m, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(resume.education.location, pageWidth - m, y, { align: "right" });
  y += 11;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const eduLine = [
    resume.education.degree,
    resume.education.minor,
    ...resume.education.highlights,
  ].join("  ·  ");
  const eduLines = doc.splitTextToSize(eduLine, w);
  doc.text(eduLines, m, y);
  y += eduLines.length * 10 + 6;

  divider();

  /* ================================================================== */
  /* Skills                                                              */
  /* ================================================================== */
  sectionHeading("SKILLS");

  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);

  for (const group of resume.skills) {
    const label = `${group.title}: `;
    const items = group.skills.join(", ");
    doc.setFont("helvetica", "bold");
    const lw = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    const skLines = doc.splitTextToSize(items, w - lw);
    ensureSpace(skLines.length * 10 + 3);

    doc.setFont("helvetica", "bold");
    doc.text(label, m, y);
    doc.setFont("helvetica", "normal");
    doc.text(skLines[0], m + lw, y);
    for (let i = 1; i < skLines.length; i++) {
      y += 10;
      doc.text(skLines[i], m + lw, y);
    }
    y += 13;
  }

  y -= 3;
  divider();

  /* ================================================================== */
  /* Awards                                                              */
  /* ================================================================== */
  sectionHeading("AWARDS");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);

  for (const award of resume.awards) {
    ensureSpace(12);
    doc.text(`•  ${award.title} — ${award.detail}`, m + 4, y);
    doc.setTextColor(100, 100, 100);
    doc.text(award.year, pageWidth - m, y, { align: "right" });
    doc.setTextColor(40, 40, 40);
    y += 11;
  }

  /* ================================================================== */
  /* Save                                                                */
  /* ================================================================== */
  const now = new Date();
  const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}`;
  doc.save(`Siladityaa_Sharma_Resume_${dateStr}.pdf`);
}
