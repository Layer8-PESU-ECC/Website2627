export type Difficulty = "Easy" | "Medium" | "Hard";

export type CtfWriteup = {
  slug: string;
  title: string;
  author: string;
  difficulty: Difficulty;
  category: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  event?: string;
};

export const WRITEUPS: CtfWriteup[] = [
  {
    slug: "rsa-graduation",
    title: "RSA Graduation",
    author: "Shubhika Pradeep",
    difficulty: "Hard",
    category: "cryptography",
    readTime: "6 min",
    tags: ["rsa", "small-exponent", "known-plaintext", "coppersmith"],
    excerpt:
      "Why a huge RSA modulus can still fail when e = 3 and nearly all of the plaintext is known.",
    event: "sudo$rm CTF 2026",
  },
  {
    slug: "base64-is-not-encryption",
    title: "Base64 Is Not Encryption",
    author: "Ianna Elizabeth Reni",
    difficulty: "Easy",
    category: "encoding",
    readTime: "3 min",
    tags: ["base64", "encoding", "data-formats", "triage"],
    excerpt:
      "A three-layer Base64 puzzle and a useful first step for any mysterious text blob.",
    event: "sudo$rm CTF 2026",
  },
  {
    slug: "pattern-in-the-numbers",
    title: "The Pattern in the Numbers",
    author: "Archita Agarwal",
    difficulty: "Medium",
    category: "cryptography",
    readTime: "4 min",
    tags: ["classical-cipher", "character-codes", "patterns", "encoding"],
    excerpt:
      "A numerical cipher solved by taking its hint literally: reverse an increasing additive shift.",
    event: "sudo$rm CTF 2026",
  },
  {
    slug: "crypto-the-basics",
    title: "Crypto: The Basics",
    author: "Chatresh Ramasai Gudi",
    difficulty: "Easy",
    category: "encoding",
    readTime: "3 min",
    tags: ["base64", "encoding", "fundamentals", "data-formats"],
    excerpt:
      "A one-string challenge that teaches how Base64 looks, why it exists, and what it cannot protect.",
    event: "sudo$rm CTF 2026",
  },
  {
    slug: "dhurandhar-3",
    title: "Project Dhurandhar 3",
    author: "Achyuth",
    difficulty: "Medium",
    category: "osint",
    readTime: "5 min",
    tags: ["osint", "caesar-cipher", "digital-footprint", "research"],
    excerpt:
      "A multi-stage OSINT exercise in moving from a small clue to a justified research hypothesis.",
    event: "sudo$rm CTF 2026",
  },
];

export const CATEGORIES = [
  "all",
  ...Array.from(new Set(WRITEUPS.map((writeup) => writeup.category))),
];

export const difficultyStyle: Record<Difficulty, string> = {
  Easy: "border-emerald-400/50 text-emerald-300",
  Medium: "border-amber-400/50 text-amber-300",
  Hard: "border-rose-400/50 text-rose-300",
};
