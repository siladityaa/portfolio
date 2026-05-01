import jsPDF from "jspdf";

/**
 * Generate an ATS-friendly PDF of the resume.
 *
 * ATS-friendly means: real text (not images), simple formatting, standard
 * fonts, clear section headings, and no columns or tables that confuse
 * parsers. We use Helvetica (built into jsPDF / every PDF reader) for
 * maximum compatibility.
 */
export function generateResumePDF() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = 50;

  const checkPageBreak = (needed: number) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - 50) {
      doc.addPage();
      y = 50;
    }
  };

  /* ------------------------------------------------------------------ */
  /* Header                                                              */
  /* ------------------------------------------------------------------ */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(17, 17, 19);
  doc.text("Siladityaa Sharma", margin, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 107, 112);
  doc.text(
    "Senior Product Designer  ·  Meta Reality Labs  ·  Los Angeles, CA",
    margin,
    y
  );
  y += 16;

  doc.setFontSize(9);
  doc.text(
    "hi@siladityaa.com  ·  linkedin.com/in/siladityaa  ·  siladityaa.com",
    margin,
    y
  );
  y += 24;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 16;

  /* ------------------------------------------------------------------ */
  /* Summary                                                             */
  /* ------------------------------------------------------------------ */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 19);
  doc.text("SUMMARY", margin, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(45, 45, 45);
  const summary =
    "Creative technologist with user experience research and design expertise across AI, wearables, and hardware. Known for exploring future-states and creating engaging scenarios to inform design ideas from concept to shippable products. A demonstrated history in prototyping simple to complex concepts, regardless of feasibility.";
  const summaryLines = doc.splitTextToSize(summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 13 + 16;

  /* ------------------------------------------------------------------ */
  /* Experience                                                          */
  /* ------------------------------------------------------------------ */
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y - 8, pageWidth - margin, y - 8);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 19);
  doc.text("EXPERIENCE", margin, y);
  y += 18;

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
      period: "Jun 2021 — Sep 2021",
      location: "Remote",
      bullets: [
        "Contributed to early-stage AR glasses interaction design under NDA. Explored novel input paradigms for head-worn computing.",
      ],
    },
    {
      title: "UX Designer & Developer Intern",
      company: "Kley",
      period: "May 2020 — Jul 2020",
      location: "Remote",
      bullets: [
        "Designed and developed user interfaces for an early-stage startup, wearing both design and front-end engineering hats.",
      ],
    },
  ];

  for (const job of jobs) {
    checkPageBreak(80);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(17, 17, 19);
    doc.text(job.title, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(107, 107, 112);
    doc.text(job.period, pageWidth - margin, y, { align: "right" });
    y += 13;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`${job.company}  ·  ${job.location}`, margin, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(45, 45, 45);
    for (const bullet of job.bullets) {
      checkPageBreak(30);
      const lines = doc.splitTextToSize(bullet, contentWidth - 14);
      lines.forEach((line: string, i: number) => {
        doc.text(i === 0 ? `•  ${line}` : `   ${line}`, margin + 4, y);
        y += 12;
      });
    }
    y += 10;
  }

  /* ------------------------------------------------------------------ */
  /* Education                                                           */
  /* ------------------------------------------------------------------ */
  checkPageBreak(80);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y - 4, pageWidth - margin, y - 4);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 19);
  doc.text("EDUCATION", margin, y);
  y += 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ArtCenter College of Design", margin, y);
  y += 13;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text("BS Interaction Design  ·  Business Minor  ·  Pasadena, CA", margin, y);
  y += 16;

  doc.setFontSize(9.5);
  doc.setTextColor(45, 45, 45);
  const eduItems = [
    "Graduated with Honors",
    "Provost List — GPA above 3.80",
    "Interaction Design Scholarship Recipient",
  ];
  for (const item of eduItems) {
    doc.text(`•  ${item}`, margin + 4, y);
    y += 12;
  }
  y += 12;

  /* ------------------------------------------------------------------ */
  /* Skills                                                              */
  /* ------------------------------------------------------------------ */
  checkPageBreak(80);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y - 4, pageWidth - margin, y - 4);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 19);
  doc.text("SKILLS", margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(45, 45, 45);

  const skillSections = [
    {
      label: "Design",
      items:
        "Interaction Design, UX Research, Design Thinking, Human-Centered Design, UI Design, UX Design, Wireframes & Prototypes, Journey Maps & Personas, Design Systems, Prototyping",
    },
    {
      label: "Technical",
      items:
        "HTML/CSS/JavaScript, Adobe Creative Suite, Motion Graphics, Figma, Principle, After Effects",
    },
    {
      label: "Soft Skills",
      items:
        "Leadership, Communication, Cross-discipline Collaboration, Problem Solving, Mentorship",
    },
  ];

  for (const section of skillSections) {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`${section.label}:  `, margin, y);
    const labelWidth = doc.getTextWidth(`${section.label}:  `);
    doc.setFont("helvetica", "normal");
    const skillLines = doc.splitTextToSize(
      section.items,
      contentWidth - labelWidth
    );
    doc.text(skillLines[0], margin + labelWidth, y);
    if (skillLines.length > 1) {
      for (let i = 1; i < skillLines.length; i++) {
        y += 12;
        doc.text(skillLines[i], margin + labelWidth, y);
      }
    }
    y += 16;
  }

  /* ------------------------------------------------------------------ */
  /* Awards                                                              */
  /* ------------------------------------------------------------------ */
  checkPageBreak(80);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y - 4, pageWidth - margin, y - 4);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 17, 19);
  doc.text("AWARDS & RECOGNITION", margin, y);
  y += 18;

  const awards = [
    { title: "International Design Award — Silver & Bronze", year: "2020" },
    { title: "MUSE Design Awards — Gold", year: "2020" },
    { title: "Adobe Design Achievement Awards — Semifinalist", year: "2020" },
    { title: "Dutch Design Week — Featured Project", year: "2020" },
    { title: "Bradford Hall End Scholarship — Recipient", year: "2019" },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(45, 45, 45);
  for (const award of awards) {
    checkPageBreak(16);
    doc.text(`•  ${award.title}`, margin + 4, y);
    doc.setTextColor(107, 107, 112);
    doc.text(award.year, pageWidth - margin, y, { align: "right" });
    doc.setTextColor(45, 45, 45);
    y += 14;
  }

  /* ------------------------------------------------------------------ */
  /* Save                                                                */
  /* ------------------------------------------------------------------ */
  const now = new Date();
  const dateStr = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}`;
  doc.save(`Siladityaa_Sharma_Resume_${dateStr}.pdf`);
}
