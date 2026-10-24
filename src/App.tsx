import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  ArrowRight,
  Boxes,
  BriefcaseBusiness,
  Cloud,
  Code2,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Heart,
  House,
  Languages as LanguagesIcon,
  Layers,
  Mail,
  Network,
  Search,
  Sparkles,
  User,
  Users,
  Webhook,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import { AnimatedCounter } from "./components/AnimatedCounter";
import { HeroSection } from "./components/HeroSection";
import { LanguageTube } from "./components/LanguageTube";
import { LiquidDock } from "./components/LiquidDock";
import { ProjectImage } from "./components/ProjectImage";

type NavItem = {
  id: string;
  label: string;
  icon: typeof House;
};

type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  image: string;
  featured: boolean;
  internalNote?: string;
  links: {
    github?: string;
    live?: string;
    appStore?: string;
    playStore?: string;
    figma?: string;
    download?: string;
  };
};

type TimelineNode = {
  id: string;
  type: string;
  title: string;
  company: string;
  subtitle: string;
  dateRange: string;
  start: string;
  end: string | null;
  bullets: string[];
  projects?: string;
  certificate?: string;
  countsTowardExperience?: boolean;
  icon: typeof BriefcaseBusiness;
};

// A skill shows either a logo/illustration from public/skills or, when no
// brand logo exists, a lucide icon. `mono` logos are black and get inverted
// in dark mode.
type Skill = {
  name: string;
  image?: string;
  icon?: typeof Code2;
  detail?: string;
  mono?: boolean;
};

type SkillCategory = {
  title: string;
  icon: typeof Code2;
  variant: "logo" | "illustration";
  items: Skill[];
};

type Certification = {
  title: string;
  org: string;
  dateRange: string;
  note?: string;
  certificateUrl?: string;
  bullets?: string[];
};

type EducationEntry = {
  degree: string;
  school: string;
  year: string;
  detail: string;
};

type LanguageEntry = {
  name: string;
  level: string;
  percent: number;
};

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: House },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "road", label: "Timeline", icon: BriefcaseBusiness },
  { id: "credentials", label: "Credentials", icon: GraduationCap },
  { id: "contact", label: "Contact Me", icon: Mail },
];

const timelineNodes: TimelineNode[] = [
  {
    id: "leaderit",
    type: "Full-time",
    title: "Associate Software Developer",
    company: "LeaderIT",
    subtitle: "LeaderIT — Trivandrum",
    dateRange: "May 2026 — Present",
    start: "2026-05-01",
    end: null,
    bullets: [
      "Working on Automax, a workflow automation platform for managing business operations, user access, and organizational structure with enterprise-grade security.",
      "Building and maintaining responsive front-end features using React.js, focused on clean, intuitive interfaces for complex operational workflows.",
      "Expanding into cross-platform mobile development with React Native, applying core React concepts to build and test mobile-friendly features alongside the web application.",
    ],
    icon: BriefcaseBusiness,
  },
  {
    id: "benjamin",
    type: "Freelance",
    title: "Freelance Web Developer",
    company: "Benjamin Portfolio Website",
    subtitle: "Benjamin Portfolio Website — Remote",
    dateRange: "May 2026 — Jul 2026",
    start: "2026-05-01",
    end: "2026-07-31",
    bullets: [
      "Designed and developed a personal portfolio website for a freelance client (a designer and video editor), translating a custom Figma UI/UX design into a fully responsive, production site — benjamincs.com.",
      "Built a parallax scrolling homepage along with a separate map-style interactive homepage, with distinct layouts and interactions for desktop and mobile.",
      "Integrated Cloudinary to dynamically fetch and display the client's art/video portfolio, using self-generating scripts to auto-generate and list media items from the Cloudinary library.",
      "Implemented a contact form using EmailJS for direct client inquiries without a backend server.",
      "Deployed the site on Vercel and configured the custom domain via Hostinger.",
    ],
    projects: "GitHub: github.com/Hishamkool/portfolio_benjamin",
    icon: Sparkles,
  },
  {
    id: "vonnue",
    type: "Internship",
    title: "Full Stack Developer Intern",
    company: "Vonnue",
    subtitle: "Vonnue — Sultan Bathery",
    dateRange: "Jul 2025 — Mar 2026",
    start: "2025-07-01",
    end: "2026-03-31",
    bullets: [
      "Engaged in a comprehensive 6-month training and internship program centered on developing scalable and efficient web applications.",
      "Gained hands-on experience with React.js, Tailwind CSS, JavaScript, HTML, and Firestore through real-world full stack development projects.",
      "Designed and implemented dynamic, responsive user interfaces with a strong emphasis on clean, intuitive UI/UX.",
    ],
    projects:
      "Recipedia, Daily Logs Calculator, Meal Cast, Dice Game, Amoled Clock, Doordash, AirBnb, Biosynthesis, Myntra (mobile view)",
    icon: GraduationCap,
  },
  {
    id: "famlaika",
    type: "Part-time",
    title: "Flutter Developer (Part-time)",
    company: "Famlaika",
    subtitle: "Famlaika — Remote",
    dateRange: "Apr 2025 — Jun 2025",
    start: "2025-04-01",
    end: "2025-06-30",
    bullets: [
      "Improved code maintainability by separating UI from business logic using Provider and clean architectural practices.",
      "Supported development workflows by introducing tools and practices that improved debugging and development efficiency.",
      "Contributed to the development and enhancement of the Family Tree module, ensuring scalable data handling and intuitive UI behavior.",
    ],
    icon: Zap,
  },
  {
    id: "grapes",
    type: "Full-time",
    title: "Junior Flutter Developer",
    company: "Grapes IDMR",
    subtitle: "Grapes IDMR — Thrissur",
    dateRange: "May 2024 — Mar 2025",
    start: "2024-05-01",
    end: "2025-03-31",
    bullets: [
      "Built and maintained cross-platform mobile apps using Flutter across healthcare, employee management, and smart control systems.",
      "Designed responsive UIs using Figma and Justinmind, implemented in Flutter based on MVC and MVVM architectures; migrated apps from GetX to Provider for improved maintainability.",
      "Integrated REST APIs, real-time updates, and Firebase Cloud Messaging (FCM).",
      "Used Git for version control and collaboration.",
    ],
    projects: "CSSD, DiaLog, Grapes Office Log, Smart Device Management, MyHRM QR, NameBoard, BSA",
    icon: BriefcaseBusiness,
  },
  {
    id: "cabin4",
    type: "Internship",
    title: "Web Developer Intern",
    company: "Cabin4",
    subtitle: "Cabin4 — Malappuram",
    dateRange: "Aug 2019 — Feb 2020",
    start: "2019-08-01",
    end: "2020-02-29",
    bullets: [
      "Gained hands-on experience in HTML, CSS, JavaScript, and basic Python programming through guided projects.",
      "Built interactive web apps including a Password Generator and a static Houseme website, among others.",
      "Practiced coding fundamentals by creating logic-based Python pattern programs, improving problem-solving and code structuring skills.",
    ],
    projects: "Password Generator, Houseme",
    certificate: "verify.cabin4.pro/v8uj",
    countsTowardExperience: false,
    icon: GraduationCap,
  },
];

const projects: Project[] = [
  {
    slug: "benjamin-portfolio",
    title: "Benjamin Portfolio",
    category: "Freelance",
    featured: true,
    description:
      "A fully responsive freelance portfolio for a designer & video editor — a parallax scrolling homepage and a separate map-style interactive homepage, with a Cloudinary-powered media library built from a custom Figma design.",
    stack: ["React", "Tailwind CSS", "Cloudinary", "EmailJS", "Vercel"],
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/portfolio_benjamin",
      live: "https://benjamincs.com",
      figma: "https://www.figma.com/design/4SXzDdrTzOgUe91RpnbBtS/portfolio-Benjamin",
    },
  },
  {
    slug: "automax",
    title: "Automax",
    category: "React",
    featured: true,
    description:
      "Enterprise workflow automation platform for managing business operations, user access, and organizational structure with enterprise-grade security. Expanding into React Native for mobile-friendly features.",
    stack: ["React.js", "React Native", "Enterprise", "Workflow Automation"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    links: {
      live: "https://epmstg.automaxsw.com/login",
    },
  },
  {
    slug: "recipedia",
    title: "Recipedia",
    category: "React",
    featured: true,
    description:
      "A recipe discovery app with search and category browsing, built during the Vonnue full-stack internship.",
    stack: ["React", "Tailwind CSS", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    links: {
      live: "https://recipedia-five.vercel.app/",
    },
  },
  {
    slug: "daily-logs-calculator",
    title: "Daily Logs Calculator",
    category: "React",
    featured: true,
    description:
      "A utility app for tracking and calculating daily work and activity logs, with a clean, form-driven interface.",
    stack: ["React", "Tailwind CSS", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    links: {
      live: "https://vonnuedailylogs.vercel.app/",
    },
  },
  {
    slug: "meal-cast",
    title: "Meal Cast",
    category: "React",
    featured: false,
    description:
      "A meal planning and forecasting interface with a clean, card-based UI for browsing and organizing meals.",
    stack: ["React", "Tailwind CSS", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/MealCast",
      live: "https://meal-cast.vercel.app",
    },
  },
  {
    slug: "dice-game",
    title: "Dice Game",
    category: "React",
    featured: true,
    description:
      "An interactive dice game with real-time state updates and score tracking.",
    stack: ["React", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    links: {
      live: "https://dice-game-hisham.vercel.app/",
    },
  },
  {
    slug: "amoled-clock",
    title: "Amoled Clock",
    category: "React",
    featured: true,
    description:
      "A minimal, dark-themed digital clock UI optimized for AMOLED screens.",
    stack: ["React", "Tailwind CSS"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    links: {
      live: "https://amoled-clock-hisham.vercel.app/",
    },
  },
  {
    slug: "doordash-clone",
    title: "Doordash (Clone)",
    category: "React",
    featured: true,
    description:
      "A food delivery UI clone focused on responsive restaurant listings and cart flows.",
    stack: ["React", "Tailwind CSS", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    links: {
      live: "https://doordash-roan.vercel.app/",
    },
  },
  {
    slug: "airbnb-clone",
    title: "AirBnb (Clone)",
    category: "React",
    featured: true,
    description:
      "A property listing and booking UI clone with search, filters, and a responsive listing grid.",
    stack: ["React", "Tailwind CSS", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    links: {
      live: "https://airbnb-clone-hisham.vercel.app/",
    },
  },
  {
    slug: "biosynthesis",
    title: "Biosynthesis",
    category: "React",
    featured: true,
    description:
      "An educational interactive UI visualizing the biosynthesis process, built with Firestore-backed content.",
    stack: ["React", "Tailwind CSS", "Firestore"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    links: {
      live: "https://hishamkool.github.io/Progbiz-Biosynthesis/",
    },
  },
  {
    slug: "cssd",
    title: "CSSD",
    category: "Flutter",
    featured: true,
    description:
      "A Central Sterile Services Department app streamlining hospital sterilization workflow tracking.",
    stack: ["Flutter", "Dart", "Provider", "Firebase"],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/CSSD-readme",
      appStore: "https://apps.apple.com/in/app/cssd-grapes/id6759464211",
      playStore:
        "https://play.google.com/store/apps/details?id=com.grapeshms.cssdapp&pcampaignid=web_share",
    },
  },
  {
    slug: "dialog",
    title: "DiaLog",
    category: "Flutter",
    featured: true,
    description:
      "A patient health-log tracking app for recording and monitoring daily diagnostics.",
    stack: ["Flutter", "Dart", "Provider", "Firebase"],
    image:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80",
    links: {
      appStore: "https://apps.apple.com/in/app/dia-log/id6743195893",
      playStore:
        "https://play.google.com/store/apps/details?id=com.grapeshms.dialysis&pcampaignid=web_share",
    },
  },
  {
    slug: "grapes-office-log",
    title: "Grapes Office Log",
    category: "Flutter",
    featured: true,
    description:
      "An employee attendance and office activity log management app for internal operations.",
    stack: ["Flutter", "Dart", "Provider", "Firebase"],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    internalNote: "Internal App",
    links: {},
  },
  {
    slug: "smart-device-management",
    title: "Smart Device Management",
    category: "Flutter",
    featured: true,
    description:
      "An app for controlling and monitoring connected smart devices with real-time status updates.",
    stack: ["Flutter", "Dart", "Provider", "Firebase Cloud Messaging"],
    image:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80",
    internalNote: "Internal App",
    links: {},
  },
  {
    slug: "myhrm-qr",
    title: "MyHRM QR",
    category: "Flutter",
    featured: false,
    description:
      "A QR-based HR management app for employee check-in/check-out and attendance records. Superseded by the Grapes IDMR web application.",
    stack: ["Flutter", "Dart", "Provider", "REST API"],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    internalNote: "Internal App",
    links: {},
  },
  {
    slug: "nameboard",
    title: "NameBoard",
    category: "Flutter",
    featured: true,
    description:
      "A digital nameboard and smart signage display management app for kiosk-style screens.",
    stack: ["Flutter", "Dart", "MVC"],
    image:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80",
    internalNote: "Internal App",
    links: {},
  },
  {
    slug: "bsa",
    title: "BSA",
    category: "Flutter",
    featured: true,
    description:
      "Bedside Assistant — a vital-history section within Grapes' bedside assistant suite, built for patient care workflows.",
    stack: ["Flutter", "Dart", "MVVM"],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    links: {
      appStore: "https://apps.apple.com/in/app/grapes-bsa/id6471225474",
      playStore:
        "https://play.google.com/store/apps/details?id=com.grapeshms.bedsideassistant.pro&pcampaignid=web_share",
    },
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    category: "JavaScript",
    featured: true,
    description:
      "A password generator web app that creates strong random passwords, built with vanilla JavaScript during the Cabin4 internship to practice DOM manipulation and logic-building.",
    stack: ["HTML", "CSS", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/random-password-generator",
      live: "https://hishamkool.github.io/random-password-generator/",
    },
  },
  {
    slug: "houseme",
    title: "Houseme",
    category: "JavaScript",
    featured: false,
    description:
      "A static website recreated during the Cabin4 internship to practice responsive front-end layout and structure using HTML, CSS, and JavaScript.",
    stack: ["HTML", "CSS", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/Houseme",
      live: "https://hishamkool.github.io/Houseme/",
    },
  },
  {
    slug: "news-app",
    title: "News App",
    category: "Flutter",
    featured: true,
    description:
      "A news reader app fetching live articles from a public API, built while training in Flutter and REST API integration.",
    stack: ["Flutter", "Dart", "REST API"],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/newsApp_api",
      download: "https://github.com/Hishamkool/newsApp_api/releases",
    },
  },
  {
    slug: "movie-app",
    title: "Movie App",
    category: "Flutter",
    featured: true,
    description:
      "A movie browsing app for discovering films and viewing details, built with Flutter during Luminar Technolab training.",
    stack: ["Flutter", "Dart"],
    image:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/movieui_flutter",
      download: "https://github.com/Hishamkool/movieui_flutter/releases",
    },
  },
  {
    slug: "hotel-booking-app",
    title: "Hotel Booking App",
    category: "Flutter",
    featured: false,
    description:
      "A hotel booking UI for browsing rooms and making reservations, built with Flutter during Luminar Technolab training.",
    stack: ["Flutter", "Dart"],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/hotel_app_flutter",
      download: "https://github.com/Hishamkool/hotel_app_flutter/releases",
    },
  },
  {
    slug: "exotic-car-app",
    title: "Exotic Car App",
    category: "Flutter",
    featured: true,
    description:
      "An exotic car showcase app with a rich, image-driven UI, built with Flutter during Luminar Technolab training.",
    stack: ["Flutter", "Dart"],
    image:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/Car_App_Flutter",
      download: "https://github.com/Hishamkool/Car_App_Flutter/releases",
    },
  },
  {
    slug: "instagram-clone",
    title: "Instagram Clone",
    category: "Flutter",
    featured: false,
    description:
      "An Instagram UI clone practicing feed layouts, stories, and profile screens in Flutter during Luminar Technolab training.",
    stack: ["Flutter", "Dart"],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
    links: {
      github: "https://github.com/Hishamkool/instagramuiClone_flutter",
      download:
        "https://github.com/Hishamkool/instagramuiClone_flutter/releases",
    },
  },
];

const skillCategories: SkillCategory[] = [
  {
    title: "Hard Skills",
    icon: Code2,
    variant: "logo",
    items: [
      { name: "React.js", image: "react.svg" },
      { name: "React Native", image: "react.svg" },
      { name: "Tailwind CSS", image: "tailwindcss.svg" },
      { name: "JavaScript", image: "javascript.svg" },
      { name: "HTML", image: "html5.svg" },
      { name: "Flutter", image: "flutter.svg" },
      { name: "Dart", image: "dart.svg" },
      { name: "Java", image: "java.svg" },
      { name: "Python", image: "python.svg" },
      { name: "C", image: "c.svg" },
      { name: "C++", image: "cplusplus.svg" },
      { name: "Provider", icon: Layers, detail: "State Management" },
      { name: "MVC", icon: Boxes },
      { name: "MVVM", icon: Network },
      {
        name: "Firebase",
        image: "firebase.svg",
        detail: "Auth, Cloud Messaging",
      },
      { name: "REST APIs", icon: Webhook, detail: "Dio, Retrofit" },
      { name: "Cloudinary", icon: Cloud },
      { name: "EmailJS", icon: Mail },
      { name: "Git", image: "git.svg" },
      { name: "GitHub", image: "github.svg", mono: true },
      { name: "Vercel", image: "vercel.svg", mono: true },
      { name: "Android Studio", image: "androidstudio.svg" },
      { name: "VS Code", image: "vscode.svg" },
      { name: "Figma", image: "figma.svg" },
    ],
  },
  {
    title: "Soft Skills",
    icon: Users,
    variant: "illustration",
    items: [
      { name: "Attention to Detail", image: "attention.png" },
      { name: "Communication", image: "communication.png" },
      { name: "Results-Driven", image: "results.png" },
      { name: "Task Prioritization", image: "prioritization.png" },
      { name: "Continuous Improvement", image: "improvement.png" },
    ],
  },
  {
    title: "Interests",
    icon: Heart,
    variant: "illustration",
    items: [
      { name: "Travel", image: "travel.png" },
      { name: "Photography", image: "photography.png" },
      { name: "Fitness", image: "fitness.png" },
      { name: "Meditation", image: "meditation.png" },
      { name: "Singing", image: "singing.png" },
    ],
  },
];

const certifications: Certification[] = [
  {
    title: "Android Development Expert (Flutter and Java) Certification",
    org: "Luminar Technolab",
    dateRange: "Aug 2023",
    note: "Verify with: Muhammed Hisham, 34152",
    certificateUrl: "https://www.nactetindia.org/search.php",
  },
  {
    title: "Flutter Development Training",
    org: "Luminar Technolab, Calicut",
    dateRange: "May 2023 – Aug 2023",
    bullets: [
      "Focused on Dart, API integration, plugin usage, and responsive UI development using Flutter.",
      "Built real-world apps: News App, Movie App, Hotel Booking App, Exotic Car App, Instagram Clone",
    ],
  },
];

const education: EducationEntry[] = [
  {
    degree: "B.Tech in Computer Science and Engineering",
    school: "Prist University, Vallam, Thanjavur",
    year: "2023",
    detail: "GPA: 6.95",
  },
  {
    degree: "Higher Secondary Certificate (HSC), Computer Science",
    school: "Cordite Factory Hr. Sec. School, Aruvankadu",
    year: "2017",
    detail: "71.6%",
  },
  {
    degree: "Secondary School Certificate (SSC), CBSE",
    school: "Kendriya Vidyalaya, Aruvankadu",
    year: "2015",
    detail: "CGPA: 9.2",
  },
];

const languages: LanguageEntry[] = [
  { name: "English", level: "Full Professional Proficiency", percent: 95 },
  { name: "Hindi", level: "Full Professional Proficiency", percent: 95 },
  { name: "Tamil", level: "Native / Bilingual Proficiency", percent: 80 },
  { name: "Malayalam", level: "Native Proficiency", percent: 100 },
];

const easing = [0.22, 1, 0.36, 1] as const;

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

function getYearsOfExperience(nodes: TimelineNode[]): number {
  const totalMs = nodes
    .filter((node) => node.countsTowardExperience !== false)
    .reduce((sum, node) => {
      const start = new Date(node.start).getTime();
      const end = node.end ? new Date(node.end).getTime() : Date.now();
      return sum + Math.max(0, end - start);
    }, 0);
  const years = totalMs / MS_PER_YEAR;
  return Math.max(0, Math.round(years * 10) / 10);
}

// The link a project card opens when clicked, by priority.
function getPrimaryLink(project: Project): string | undefined {
  const { live, playStore, appStore, github, download } = project.links;
  return live ?? playStore ?? appStore ?? github ?? download;
}

function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`glass-panel border border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] shadow-[0_8px_32px_0_var(--shadow-glass)] ${className}`}
    >
      {children}
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [projectFilter, setProjectFilter] = useState("All");
  const [projectSearch, setProjectSearch] = useState("");
  const [searchDescriptions, setSearchDescriptions] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">(
    "down",
  );
  const lastScrollYRef = useRef(0);
  const showDockHoverLabels = true;

  const yearsOfExperience = useMemo(
    () => getYearsOfExperience(timelineNodes),
    [],
  );
  const appsShipped = projects.length;
  const flutterAppsShipped = useMemo(
    () => projects.filter((project) => project.category === "Flutter").length,
    [],
  );
  const companiesCount = useMemo(
    () => new Set(timelineNodes.map((node) => node.company)).size,
    [],
  );

  const filters = useMemo(
    () => ["All", "React", "Flutter", "JavaScript", "Freelance"],
    [],
  );

  const filteredProjects = useMemo(() => {
    const byCategory =
      projectFilter === "All"
        ? projects
        : projects.filter((project) => project.category === projectFilter);

    const query = projectSearch.trim().toLowerCase();
    if (!query) return byCategory;

    return byCategory.filter((project) => {
      const matchesTitle = project.title.toLowerCase().includes(query);
      const matchesDescription =
        searchDescriptions &&
        project.description.toLowerCase().includes(query);
      return matchesTitle || matchesDescription;
    });
  }, [projectFilter, projectSearch, searchDescriptions]);

  const hiddenProjectCount = useMemo(
    () => filteredProjects.filter((project) => !project.featured).length,
    [filteredProjects],
  );

  const visibleProjects = useMemo(
    () =>
      showAllProjects
        ? filteredProjects
        : filteredProjects.filter((project) => project.featured),
    [filteredProjects, showAllProjects],
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const preferredDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const nextTheme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : preferredDark
          ? "dark"
          : "light";
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = ({ x, y }: { x: number; y: number }) => {
    const next = theme === "light" ? "dark" : "light";
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    // Expand the new theme as a circle from the toggle button.
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
      document.documentElement.classList.toggle("dark", next === "dark");
    });
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 900,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);
    const SCROLL_OFFSET = 160;
    const DIRECTION_THRESHOLD = 4;
    lastScrollYRef.current = window.scrollY;

    const updateActiveSection = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      if (Math.abs(delta) > DIRECTION_THRESHOLD) {
        setScrollDirection(delta > 0 ? "down" : "up");
        lastScrollYRef.current = currentScrollY;
      }

      const scrollPosition = currentScrollY + SCROLL_OFFSET;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollPosition) {
          current = id;
        }
      }

      const atBottom =
        window.innerHeight + currentScrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        current = sectionIds[sectionIds.length - 1];
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page-gradient relative min-h-screen overflow-x-hidden text-(--color-text-primary)">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-8%] top-[-10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(92,124,255,0.92)_0%,_rgba(92,124,255,0.42)_18%,_rgba(92,124,255,0.1)_38%,_rgba(92,124,255,0)_65%)] blur-[120px] opacity-95" />
        <div className="absolute bottom-[-10%] left-[-8%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(140,164,255,0.3)_0%,_rgba(120,145,255,0.18)_22%,_rgba(120,145,255,0)_60%)] blur-[110px] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_60%)]" />
        <div className="noise-overlay opacity-35" />
      </div>

      <header className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easing }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface)] text-sm font-semibold text-[var(--color-text-primary)] shadow-[0_4px_16px_0_var(--shadow-card)]">
              HK
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Portfolio
              </p>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-20 px-4 pb-32 md:px-6">
        <HeroSection
          yearsOfExperience={yearsOfExperience}
          appsShipped={appsShipped}
          onNavigate={scrollToSection}
        />

        <section id="about" className="scroll-mt-28 py-12 md:py-14">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              About
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[var(--color-text-primary)] md:text-5xl">
              Professional Summary
            </h2>
          </div>

          <GlassPanel className="p-6 md:p-8">
            <p className="max-w-3xl text-lg leading-8 text-[var(--color-text-secondary)]">
              Frontend Developer with{" "}
              <AnimatedCounter
                value={yearsOfExperience}
                decimals={1}
                suffix="+"
                once={false}
              />{" "}
              years of experience building responsive web and mobile
              applications, currently focused on React.js and expanding into
              React Native. Delivered{" "}
              <AnimatedCounter
                value={flutterAppsShipped}
                suffix="+"
                once={false}
              />{" "}
              cross-platform mobile apps using Flutter across healthcare, workforce, and
              smart system domains, improving UI responsiveness by up to 60%
              through adaptive layouts for mobile, tablet, and kiosk screens.
              Skilled in building clean, maintainable interfaces using
              React.js and Tailwind CSS, with a strong foundation in state
              management (Provider), REST API integration, and real-time
              features via Firebase. Currently contributing to Automax, an
              enterprise workflow automation platform, while continuing to
              grow expertise across the React ecosystem.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Years Experience",
                  node: (
                    <AnimatedCounter
                      value={yearsOfExperience}
                      decimals={1}
                      suffix="+"
                      once={false}
                    />
                  ),
                },
                {
                  label: "Apps Shipped",
                  node: (
                    <AnimatedCounter
                      value={appsShipped}
                      suffix="+"
                      once={false}
                    />
                  ),
                },
                {
                  label: "UI Responsiveness Gain",
                  node: (
                    <AnimatedCounter value={60} suffix="%" once={false} />
                  ),
                },
                {
                  label: "Companies & Clients",
                  node: (
                    <AnimatedCounter
                      value={companiesCount}
                      suffix="+"
                      once={false}
                    />
                  ),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[var(--color-border-glass)] bg-[var(--color-surface)]/60 p-3"
                >
                  <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                    {stat.node}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </section>

        <section id="skills" className="scroll-mt-28 py-12 md:py-14">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              Toolbox
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[var(--color-text-primary)] md:text-5xl">
              Skills
            </h2>
          </div>

          <div className="space-y-14">
            {[
              skillCategories.filter((c) => c.variant === "logo"),
              skillCategories.filter((c) => c.variant === "illustration"),
            ].map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={
                  rowIndex === 1 ? "grid gap-14 lg:grid-cols-2" : undefined
                }
              >
                {row.map((category) => (
                  <div key={category.title}>
                    <div className="mb-6 flex items-center gap-3">
                      <category.icon className="h-4 w-4 text-[var(--color-accent-blue)]" />
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                        {category.title}
                      </p>
                      <span className="h-px flex-1 bg-gradient-to-r from-[var(--color-text-muted)]/30 to-transparent" />
                    </div>
                    <motion.ul
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={{
                        show: { transition: { staggerChildren: 0.035 } },
                      }}
                      className={
                        category.variant === "logo"
                          ? "grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-x-2 gap-y-7 sm:grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))]"
                          : "grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-x-2 gap-y-7 sm:grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))]"
                      }
                    >
                      {category.items.map((skill) => (
                        <motion.li
                          key={skill.name}
                          variants={{
                            hidden: { opacity: 0, y: 14, scale: 0.9 },
                            show: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: { duration: 0.4, ease: easing },
                            },
                          }}
                          title={skill.detail}
                          className="group flex flex-col items-center gap-3 text-center"
                        >
                          <div
                            className={`flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-110 ${
                              category.variant === "logo"
                                ? "h-12 w-12"
                                : "h-16 w-16"
                            }`}
                          >
                            {skill.image ? (
                              <img
                                src={`${import.meta.env.BASE_URL}skills/${skill.image}`}
                                alt=""
                                loading="lazy"
                                className={`h-full w-full object-contain drop-shadow-[0_6px_14px_var(--shadow-card)] ${
                                  skill.mono ? "skill-icon--mono" : ""
                                }`}
                              />
                            ) : skill.icon ? (
                              <skill.icon
                                className="h-10 w-10 text-[var(--color-accent-blue)]"
                                strokeWidth={1.6}
                              />
                            ) : null}
                          </div>
                          <span className="text-xs leading-snug text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-text-primary)]">
                            {skill.name}
                          </span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="scroll-mt-28 py-12 md:py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                Selected work
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[var(--color-text-primary)] md:text-5xl">
                Projects
              </h2>
            </div>
          </div>

          <GlassPanel className="mb-6 flex flex-wrap gap-2 p-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setProjectFilter(filter)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  projectFilter === filter
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {projectFilter === filter && (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface)]/80 shadow-[0_8px_20px_0_var(--shadow-card)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            ))}
          </GlassPanel>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <GlassPanel className="flex flex-1 items-center gap-2 px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={projectSearch}
                onChange={(event) => setProjectSearch(event.target.value)}
                placeholder="Search projects by name…"
                className="w-full bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
              />
              {projectSearch && (
                <button
                  type="button"
                  onClick={() => setProjectSearch("")}
                  aria-label="Clear search"
                  className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </GlassPanel>

            <button
              type="button"
              onClick={() => setSearchDescriptions((current) => !current)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                searchDescriptions
                  ? "border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)] text-white"
                  : "border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)]"
              }`}
            >
              <span
                className={`flex h-4 w-7 items-center rounded-full p-0.5 transition-colors ${
                  searchDescriptions ? "bg-white/30" : "bg-[var(--color-bg-soft)]"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`h-3 w-3 rounded-full ${
                    searchDescriptions
                      ? "ml-auto bg-white"
                      : "bg-[var(--color-text-muted)]"
                  }`}
                />
              </span>
              Include descriptions
            </button>
          </div>

          {filteredProjects.length === 0 && (
            <p className="mb-6 text-sm text-[var(--color-text-muted)]">
              No projects match “{projectSearch}”.
            </p>
          )}

          {filteredProjects.length > 0 && visibleProjects.length === 0 && (
            <p className="mb-6 text-sm text-[var(--color-text-muted)]">
              No featured projects match “{projectSearch}” — click “See more”
              below to include the rest.
            </p>
          )}

          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {visibleProjects.map((project) => {
                const primaryLink = getPrimaryLink(project);
                return (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: easing }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group relative isolate"
                  >
                    <div
                      aria-hidden
                      className="project-glow pointer-events-none absolute -inset-4 -z-10 rounded-[36px] opacity-0 blur-2xl transition-opacity duration-500"
                    />
                    <article className="project-card relative h-full overflow-hidden rounded-[24px] border border-[var(--color-border-glass)] bg-[var(--color-surface)]/70 shadow-[0_12px_30px_0_var(--shadow-card)] transition-shadow duration-500">
                      {/* Stretched link: clicking anywhere on the card opens
                          its primary link; the small links sit above it. */}
                      {primaryLink && (
                        <a
                          href={primaryLink}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${project.title}`}
                          className="absolute inset-0 z-10 rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
                        />
                      )}
                      <div className="overflow-hidden">
                        <ProjectImage
                          slug={project.slug}
                          live={project.links.live}
                          appStore={project.links.appStore}
                          fallback={project.image}
                          alt={project.title}
                          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <span className="project-tag rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                            {project.category}
                          </span>
                          <div className="relative z-20 flex flex-wrap justify-end gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                            {project.links.live && (
                              <a
                                href={project.links.live}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Live"
                                className="hover:text-[var(--color-text-primary)]"
                              >
                                Live
                              </a>
                            )}
                            {project.links.github && (
                              <a
                                href={project.links.github}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="hover:text-[var(--color-text-primary)]"
                              >
                                Code
                              </a>
                            )}
                            {project.links.appStore && (
                              <a
                                href={project.links.appStore}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="App Store"
                                className="hover:text-[var(--color-text-primary)]"
                              >
                                App Store
                              </a>
                            )}
                            {project.links.playStore && (
                              <a
                                href={project.links.playStore}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Play Store"
                                className="hover:text-[var(--color-text-primary)]"
                              >
                                Play Store
                              </a>
                            )}
                            {project.links.figma && (
                              <a
                                href={project.links.figma}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Figma"
                                className="hover:text-[var(--color-text-primary)]"
                              >
                                Figma
                              </a>
                            )}
                            {project.links.download && (
                              <a
                                href={project.links.download}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Download"
                                className="hover:text-[var(--color-text-primary)]"
                              >
                                Download
                              </a>
                            )}
                            {!Object.values(project.links).some(Boolean) &&
                              project.internalNote && (
                                <span className="normal-case tracking-normal text-[var(--color-text-muted)]">
                                  {project.internalNote}
                                </span>
                              )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                            {project.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                            {project.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {project.stack.map((item) => (
                            <span
                              key={item}
                              className="project-tag rounded-full bg-[var(--color-bg-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {hiddenProjectCount > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAllProjects((current) => !current)}
                className="text-xs font-medium text-[var(--color-text-muted)] underline-offset-4 transition-colors hover:text-[var(--color-text-primary)] hover:underline"
              >
                {showAllProjects
                  ? "See less"
                  : `See more (${hiddenProjectCount})`}
              </button>
            </div>
          )}
        </section>

        <section id="road" className="scroll-mt-28 py-12 md:py-14">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                Experience
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[var(--color-text-primary)] md:text-5xl">
                The road so far
              </h2>
            </div>
          </div>

          <div className="relative ml-2 space-y-8 before:absolute before:left-[18px] before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-[linear-gradient(to_bottom,rgba(146,160,255,0.85),rgba(146,160,255,0.05))] md:ml-4">
            {timelineNodes.map((node, index) => (
              <motion.article
                key={node.id}
                initial={{
                  opacity: 0,
                  y: scrollDirection === "down" ? 56 : -56,
                }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  ease: easing,
                  delay: Math.min(index, 3) * 0.05,
                }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface)] text-[var(--color-accent-blue)] shadow-[0_6px_20px_0_var(--shadow-card)]">
                  <node.icon className="h-4 w-4" />
                </div>
                <GlassPanel className="p-5 md:p-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                        {node.type}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
                        {node.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {node.subtitle}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface)]/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                      {node.dateRange}
                    </span>
                  </div>
                  <ul className="mt-4 max-w-2xl list-disc space-y-1.5 pl-4 text-[var(--color-text-secondary)]">
                    {node.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  {node.projects && (
                    <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                      <span className="uppercase tracking-[0.14em]">
                        Projects:
                      </span>{" "}
                      {node.projects}
                    </p>
                  )}
                  {node.certificate && (
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      <span className="uppercase tracking-[0.14em]">
                        Certificate:
                      </span>{" "}
                      <a
                        href={`https://${node.certificate}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--color-accent-blue)] hover:underline"
                      >
                        {node.certificate}
                      </a>
                    </p>
                  )}
                </GlassPanel>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="credentials" className="scroll-mt-28 py-12 md:py-14">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              Background
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[var(--color-text-primary)] md:text-5xl">
              Credentials
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <GlassPanel className="p-5 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-accent-blue)]">
                  <Award className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Certifications & Training
                </p>
              </div>
              <div className="space-y-5">
                {certifications.map((cert) => (
                  <div key={cert.title}>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      {cert.dateRange}
                    </p>
                    <h3 className="mt-1 font-semibold text-[var(--color-text-primary)]">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {cert.org}
                    </p>
                    {cert.bullets && (
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-[var(--color-text-secondary)]">
                        {cert.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                    {cert.certificateUrl && (
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                        <span className="uppercase tracking-[0.14em]">
                          Certificate:
                        </span>{" "}
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--color-accent-blue)] hover:underline"
                        >
                          {cert.certificateUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </p>
                    )}
                    {cert.note && (
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {cert.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-5 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-accent-blue)]">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Education
                </p>
              </div>
              <div className="space-y-5">
                {education.map((entry) => (
                  <div key={entry.degree}>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      {entry.year}
                    </p>
                    <h3 className="mt-1 font-semibold text-[var(--color-text-primary)]">
                      {entry.degree}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {entry.school}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {entry.detail}
                    </p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-5 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-accent-blue)]">
                  <LanguagesIcon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Languages
                </p>
              </div>
              <div className="space-y-3">
                {languages.map((language) => (
                  <div
                    key={language.name}
                    className="flex items-center gap-4 rounded-2xl border border-[var(--color-border-glass)] bg-[var(--color-surface)]/60 px-3 py-2.5"
                  >
                    <LanguageTube percent={language.percent} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {language.name}
                        </span>
                        <span className="text-xs font-medium text-[var(--color-accent-blue)]">
                          <AnimatedCounter
                            value={language.percent}
                            suffix="%"
                            once={false}
                          />
                        </span>
                      </div>
                      <p className="text-right text-xs text-[var(--color-text-secondary)]">
                        {language.level}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 pb-12 pt-12 md:pb-18">
          <GlassPanel className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                Contact
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[var(--color-text-primary)] md:text-5xl">
                Let’s build the next release.
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="https://linkedin.com/in/hisham-ka"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] backdrop-blur-xl transition-colors hover:text-[var(--color-text-primary)]"
                >
                  LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://github.com/Hishamkool"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] backdrop-blur-xl transition-colors hover:text-[var(--color-text-primary)]"
                >
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <a
              href="mailto:hishamkool@yahoo.com"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-blue)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(47,111,237,0.35)]"
            >
              hishamkool@yahoo.com
              <ArrowRight className="h-4 w-4" />
            </a>
          </GlassPanel>
        </section>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6">
        <LiquidDock
          navItems={navItems}
          activeSection={activeSection}
          onNavigate={scrollToSection}
          theme={theme}
          onToggleTheme={toggleTheme}
          showHoverLabels={showDockHoverLabels}
        />
      </div>
    </div>
  );
}

export default App;
