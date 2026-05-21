/**
 * Single source of truth for résumé content.
 *
 * BOTH the visual résumé page (`app/(site)/resume`) and the generated
 * PDF (`lib/resume-pdf.ts`) read from this module. Edit here once and
 * the change shows up on the page *and* in the next downloaded PDF —
 * there is no second copy to keep in sync.
 *
 * Plain typed module (no loader / no CMS) — résumé content changes
 * rarely and is code-reviewed when it does.
 */

export interface ResumeJob {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface ResumeSkillGroup {
  title: string;
  skills: string[];
}

export interface ResumeAward {
  title: string;
  detail: string;
  year: string;
}

export interface ResumeStat {
  value: string;
  label: string;
}

export interface ResumeContactLink {
  kind: "EMAIL" | "LINKEDIN" | "PORTFOLIO";
  label: string;
  href: string;
}

export interface ResumeEducation {
  school: string;
  degree: string;
  minor: string;
  location: string;
  highlights: string[];
}

export const resume = {
  name: "Siladityaa Sharma",
  title: "Senior Product Designer",
  company: "Meta",
  location: "Los Angeles, CA",
  /** One-line role descriptor — page eyebrow + PDF header sub-line. */
  tagline: "Senior Product Designer · Meta · Los Angeles, CA",

  /** Two-paragraph summary. The page shows both; the PDF shows the first. */
  summary: {
    primary:
      "Senior product designer with 5 years of shipping consumer experiences at scale. I lead identity, account, and social-profile design across Meta's wearables ecosystem, where I balance complex platform systems with the visual craft that people actually feel when they use a product.",
    secondary:
      "Comfortable moving between strategy, storytelling, and execution, and at home with the kind of cross-surface, multi-user-type problems that account and admin experiences demand.",
  },

  stats: [
    { value: "5+", label: "Years in Tech" },
    { value: "10+", label: "Product Launches" },
    { value: "1M+", label: "Products Sold" },
    { value: "2+", label: "Years in Academia" },
  ] satisfies ResumeStat[],

  tags: ["AI", "Hardware", "Wearables"],

  contact: [
    {
      kind: "EMAIL",
      label: "hi@siladityaa.com",
      href: "mailto:hi@siladityaa.com",
    },
    {
      kind: "LINKEDIN",
      label: "linkedin.com/in/siladityaa",
      href: "https://linkedin.com/in/siladityaa",
    },
    {
      kind: "PORTFOLIO",
      label: "siladityaa.com",
      href: "https://siladityaa.com",
    },
  ] satisfies ResumeContactLink[],

  experience: [
    {
      company: "Meta",
      role: "Senior Product Designer",
      period: "Feb 2022 — Present",
      location: "Los Angeles, CA",
      bullets: [
        "Lead identity, account, and social-profile design for the new Meta AI app. Partner with PM and engineering to ship a consumer AI product that spans phone and Ray-Ban Meta glasses, including cross-surface migration logic and regional edge cases. Contributed to the design-system principles guiding the launch.",
        "Drove the Facebook to Meta account platform migration across product surfaces. Moved millions of users to the new company account system, navigated regulatory and legacy-hardware constraints, and designed the migration flow so users understood what was happening at each step.",
        "Own the authentication suite across Meta's wearables: passcodes, passive unlock from a paired phone, and emerging biometric methods. A multi-device, multi-user-type system shaped end-to-end with hardware, firmware, and product partners.",
        "Shipped the Spotify Tap integration on Ray-Ban Stories — a temple-gesture-driven music control surface that became a flagship example of hardware-first interaction design.",
        "Mentor designers on the team, contribute to design critiques, and partner with research to ground product strategy in qualitative insight. Build functional prototypes in Cursor and Figma when behavior under real data is the only way to settle a debate.",
      ],
    },
    {
      company: "ArtCenter College of Design",
      role: "Adjunct Instructor",
      period: "May 2022 — Present",
      location: "Pasadena, CA",
      bullets: [
        "Teach Interactive Prototyping 2. Mentor undergraduates from idea to multi-modal interactive prototype, with a high bar for visual craft, typography, and layout.",
      ],
    },
    {
      company: "Meta",
      role: "Product Design Intern",
      period: "Jun — Sep 2021",
      location: "Remote",
      bullets: [
        "Established design direction in an ambiguous, early-stage AR program (under NDA), exploring novel input paradigms alongside hardware, ML, and research partners.",
      ],
    },
  ] satisfies ResumeJob[],

  education: {
    school: "ArtCenter College of Design",
    degree: "BS Interaction Design",
    minor: "Business Minor",
    location: "Pasadena, CA",
    highlights: [
      "Graduated with Honors",
      "Provost List — GPA above 3.80",
      "Interaction Design Scholarship Recipient",
    ],
  } satisfies ResumeEducation,

  skills: [
    {
      title: "Product & Craft",
      skills: [
        "Account & Identity UX",
        "Design Systems",
        "Visual Design",
        "Typography",
        "Composition & Layout",
        "Interaction Design",
        "Information Architecture",
        "Prototyping",
      ],
    },
    {
      title: "Strategy & Process",
      skills: [
        "Designing for Multiple User Types",
        "Cross-functional Partnership",
        "Working with PM, Eng & Research",
        "Mentorship",
        "Design Critique",
      ],
    },
    {
      title: "Tools",
      skills: [
        "Figma",
        "Cursor",
        "HTML / CSS / JavaScript",
        "Principle",
        "After Effects",
        "Adobe Creative Suite",
      ],
    },
  ] satisfies ResumeSkillGroup[],

  awards: [
    { title: "MUSE Design Awards", detail: "Gold", year: "2020" },
    {
      title: "International Design Awards",
      detail: "Silver & Bronze",
      year: "2020",
    },
    {
      title: "Adobe Design Achievement Awards",
      detail: "Semifinalist",
      year: "2020",
    },
    { title: "Dutch Design Week", detail: "Featured Project", year: "2020" },
    {
      title: "Bradford Hall End Scholarship",
      detail: "Recipient",
      year: "2019",
    },
  ] satisfies ResumeAward[],
} as const;
