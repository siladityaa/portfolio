import jsPDF from "jspdf";

/**
 * Generate an ATS-friendly, single-page PDF of the resume.
 *
 * ATS-friendly means: real text (not images), simple formatting, standard
 * fonts, clear section headings, and no columns or tables that confuse
 * parsers. We use Helvetica (built into jsPDF / every PDF reader) for
 * maximum compatibility.
 *
 * Letter size = 612 × 792 pt. With 36pt margins we get 720pt of vertical
 * space — every pixel counts.
 */
export function generateResumePDF() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const m = 40; // margin
  const w = pageWidth - m * 2; // content width
  let y = 38;

  /* ---- helper: section divider ---- */
  const divider = () => {
    doc.setDrawColor(195, 195, 195);
    doc.setLineWidth(0.4);
    doc.line(m, y, pageWidth - m, y);
    y += 10;
  };

  /* ================================================================== */
  /* Header                                                              */
  /* ================================================================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(17, 17, 19);
  doc.text("Siladityaa Sharma", m, y);
  y += 15;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Senior Product Designer  |  Meta Reality Labs  |  Los Angeles, CA",
    m,
    y
  );
  y += 11;

  doc.setFontSize(8);
  doc.text(
    "hi@siladityaa.com  |  linkedin.com/in/siladityaa  |  siladityaa.com",
    m,
    y
  );
  y += 12;

  divider();

  /* ================================================================== */
  /* Summary                                                             */
  /* ================================================================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 19);
  doc.text("SUMMARY", m, y);
  y += 11;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  const summary =
    "Creative technologist with UX research and design expertise across AI, wearables, and hardware. Known for exploring future-states and creating engaging scenarios to inform design ideas from concept to shippable products.";
  const sLines = doc.splitTextToSize(summary, w);
  doc.text(sLines, m, y);
  y += sLines.length * 10 + 8;

  divider();

  /* ================================================================== */
  /* Experience                                                          */
  /* ================================================================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 19);
  doc.text("EXPERIENCE", m, y);
  y += 13;

  const jobs = [
    {
      title: "Senior Product Designer",
      company: "Meta Reality Labs",
      period: "Feb 2022 — Present",
      location: "Los Angeles, CA",
      bullets: [
        "Lead design for AI-powered experiences on Ray-Ban Meta smart glasses, defining interaction patterns for camera, audio, and multimodal AI features used by millions.",
        "Drove the Facebook to Meta product migration across surfaces, ensuring brand coherence during the company's largest rebrand.",
        "Designed and shipped the Spotify Tap integration for Ray-Ban Stories, enabling seamless music control through temple gestures.",
      ],
    },
    {
      title: "Adjunct Instructor",
      company: "ArtCenter College of Design",
      period: "May 2022 — Apr 2023",
      location: "Pasadena, CA",
      bullets: [
        "Taught interaction design and prototyping to undergraduate students, bridging industry practice with academic rigor.",
      ],
    },
    {
      title: "Product Design Intern",
      company: "Meta",
      period: "Jun — Sep 2021",
      location: "Remote",
      bullets: [
        "Contributed to early-stage AR glasses interaction design under NDA. Explored novel input paradigms for head-worn computing.",
      ],
    },
    {
      title: "UX Designer & Developer Intern",
      company: "Kley",
      period: "May — Jul 2020",
      location: "Remote",
      bullets: [
        "Designed and developed user interfaces for an early-stage startup, wearing both design and front-end engineering hats.",
      ],
    },
  ];

  for (let j = 0; j < jobs.length; j++) {
    const job = jobs[j];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(17, 17, 19);
    doc.text(job.title, m, y);

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
      lines.forEach((line: string, i: number) => {
        doc.text(i === 0 ? `•  ${line}` : `   ${line}`, m + 4, y);
        y += 10;
      });
    }
    y += j < jobs.length - 1 ? 6 : 8;
  }

  divider();

  /* ================================================================== */
  /* Education                                                           */
  /* ================================================================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 19);
  doc.text("EDUCATION", m, y);
  y += 13;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("ArtCenter College of Design", m, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Pasadena, CA", pageWidth - m, y, { align: "right" });
  y += 11;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(
    "BS Interaction Design  ·  Business Minor  ·  Graduated with Honors  ·  Provost List (GPA 3.80+)",
    m,
    y
  );
  y += 14;

  divider();

  /* ================================================================== */
  /* Skills                                                              */
  /* ================================================================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 19);
  doc.text("SKILLS", m, y);
  y += 13;

  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);

  const skillSections = [
    {
      label: "Design:",
      items:
        "Interaction Design, UX Research, Design Thinking, Human-Centered Design, UI Design, UX Design, Wireframes & Prototypes, Design Systems, Prototyping",
    },
    {
      label: "Technical:",
      items:
        "HTML/CSS/JavaScript, Adobe Creative Suite, Motion Graphics, Figma, Principle, After Effects",
    },
    {
      label: "Soft Skills:",
      items:
        "Leadership, Communication, Cross-discipline Collaboration, Problem Solving, Mentorship",
    },
  ];

  for (const section of skillSections) {
    doc.setFont("helvetica", "bold");
    doc.text(section.label + " ", m, y);
    const lw = doc.getTextWidth(section.label + " ");
    doc.setFont("helvetica", "normal");
    const skLines = doc.splitTextToSize(section.items, w - lw);
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
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 19);
  doc.text("AWARDS", m, y);
  y += 13;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);

  const awards = [
    { title: "International Design Award — Silver & Bronze", year: "2020" },
    { title: "MUSE Design Awards — Gold", year: "2020" },
    { title: "Adobe Design Achievement Awards — Semifinalist", year: "2020" },
    { title: "Dutch Design Week — Featured Project", year: "2020" },
    { title: "Bradford Hall End Scholarship — Recipient", year: "2019" },
  ];

  for (const award of awards) {
    doc.text(`•  ${award.title}`, m + 4, y);
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
