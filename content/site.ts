export const profile = {
  name: "Atharva Waghmare",
  role: "Software engineer",
  place: "Jodhpur, India",
  email: "atharvawaghmare34@gmail.com",
  calLink: "atharva-waghmare-wlwfjn",
  github: "https://github.com/opixdown",
};

export type Job = {
  role: string;
  org: string;
  url?: string;
  period: string;
  points: string[];
};

export const work: Job[] = [
  {
    role: "Open Source Developer",
    org: "LFortran",
    url: "https://github.com/lfortran/lfortran",
    period: "Nov 2025 to now",
    points: [
      "Ship fixes and features in a large C++ compiler codebase, from parsing through runtime and code generation.",
      "Built REAL(16) support: 128-bit floats through LLVM lowering, the runtime and formatted I/O.",
      "Fixed CI failures across Linux, macOS, Windows and WebAssembly, with regression tests for each fix.",
      "Helped enable three real Fortran packages: fitpack (100%), M_strings and M_attr.",
    ],
  },
  {
    role: "Freelance",
    org: "Turing, Mercor, AfterQuery",
    period: "2 projects completed",
    points: [],
  },
];

export type Project = {
  name: string;
  tagline: string;
  description: string;
  status: "Live" | "Open source";
  tags: string[];
  live?: string;
  source?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    name: "PacketWorld",
    tagline: "See what actually happens when you open a website.",
    description:
      "Interactive simulations of DNS, TCP, TLS and HTTP. Follow every packet, break things on purpose, then work through ten short lessons.",
    status: "Live",
    tags: ["React", "TypeScript", "Vite"],
    live: "https://packetworld.vercel.app",
    source: "https://github.com/opixdown/packetworld",
    image: "/projects/packetworld.jpg",
  },
  {
    name: "wipe",
    tagline: "Clean your screen and keyboard without shutting down.",
    description:
      "A small command-line tool for Mac and Windows. It blacks out the screen and locks the keyboard until you hold the exit shortcut.",
    status: "Live",
    tags: ["Swift", "Go", "CLI"],
    live: "https://wipemode.vercel.app",
    source: "https://github.com/opixdown/wipe",
    image: "/projects/wipe.jpg",
  },
  {
    name: "EarlyFound",
    tagline: "A living page for every startup.",
    description:
      "A Python pipeline writes each company page from public sources. The founder then claims it and keeps it up to date.",
    status: "Live",
    tags: ["Next.js", "Supabase", "Python"],
    live: "https://earlyfound.vercel.app",
    image: "/projects/earlyfound.jpg",
  },
  {
    name: "CineCache",
    tagline: "A distributed movie cache simulator in C++.",
    description:
      "LRU eviction, consistent hashing and a custom FNV-1a hash layer, with O(1) cache operations. I led the team that built it.",
    status: "Open source",
    tags: ["C++", "CMake"],
    source: "https://github.com/opixdown/CineCache",
  },
  {
    name: "StatsPro",
    tagline: "Your Claude Code usage as a retro auto-battler.",
    description:
      "A VS Code sidebar game driven by your token usage. It runs entirely on your machine.",
    status: "Open source",
    tags: ["JavaScript", "VS Code"],
    source: "https://github.com/opixdown/statspro",
  },
];

export const otherOpenSource = [
  { name: "Flavor-ai", url: "https://github.com/Ayushjhawar8/Flavor-ai" },
  { name: "aiobs", url: "https://github.com/neuralis-in/aiobs" },
  { name: "blockshare", url: "https://github.com/Aradhya2708/blockshare" },
];

export const highlights = [
  { text: "Hacktoberfest Super Contributor" },
  { text: "Cleared 2 selection rounds of the Summer of Bitcoin fellowship" },
  { text: "Featured in Taper Magazine, Issue 16, with “16 anna”", url: "https://taper.badquar.to/16/16_anna.html" },
  { text: "Built 128-bit REAL(16) support into LFortran" },
  { text: "Helped 3 real Fortran packages compile, with fitpack at 100%" },
];

export const stack = [
  { group: "Languages", items: ["C++", "C", "Python", "TypeScript", "JavaScript", "Swift", "Go", "Fortran", "R"] },
  { group: "Web", items: ["React", "Next.js", "Tailwind CSS", "Vite", "Supabase", "PostgreSQL", "MongoDB"] },
  { group: "Core CS", items: ["Data structures", "Algorithms", "OOP", "Operating systems", "Caching", "Distributed systems"] },
  { group: "Systems", items: ["LLVM", "CMake", "WebAssembly", "Linux", "macOS", "Windows"] },
  { group: "AI and data", items: ["Claude API", "NumPy", "Pandas", "scikit-learn", "TensorFlow"] },
  { group: "Practices", items: ["Git", "GitHub", "CI/CD", "Code review", "Regression testing", "Vitest"] },
];

export const elsewhere = [
  { label: "github@opixdown", url: "https://github.com/opixdown" },
  { label: "x@atharva76067495", url: "https://x.com/atharva76067495" },
  { label: "linkedin@atharva-waghmare", url: "https://www.linkedin.com/in/atharva-waghmare-6203021b4/" },
  { label: "instagram@athxrv._here", url: "https://www.instagram.com/athxrv._here/" },
  { label: "discord: message me", url: "https://discord.com/users/553259429223727126" },
  { label: "atharvawaghmare34@gmail.com", url: "mailto:atharvawaghmare34@gmail.com" },
];
