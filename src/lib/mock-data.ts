/** Trending topics shown in the sidebar and discovery strip */
export const TRENDING_TOPICS = [
  { tag: "#BugBounty", category: "Security", posts: "18.3K" },
  { tag: "#CTF", category: "Security", posts: "14.1K" },
  { tag: "#RustLang", category: "Technology", posts: "11.7K" },
  { tag: "#ZeroDay", category: "Security", posts: "9.4K" },
  { tag: "#HomeServer", category: "Technology", posts: "7.8K" },
  { tag: "#OpenSource", category: "Technology", posts: "22.6K" },
  { tag: "#NixOS", category: "Technology", posts: "5.2K" },
] as const

/** Suggested users shown in the sidebar and discovery strip */
export const SUGGESTED_USERS = [
  {
    name: "Sarah Chen",
    username: "@sarahbuilds",
    initials: "SC",
    bio: "Senior Frontend Engineer at Vercel",
    verified: true,
  },
  {
    name: "Alex Rivera",
    username: "@alexcodes",
    initials: "AR",
    bio: "Full-stack dev & tech blogger",
    verified: false,
  },
  {
    name: "Maya Patel",
    username: "@mayatech",
    initials: "MP",
    bio: "AI/ML Engineer, Python enthusiast",
    verified: true,
  },
  {
    name: "Jordan Kim",
    username: "@jordanux",
    initials: "JK",
    bio: "UX Designer turning code into art",
    verified: false,
  },
  {
    name: "Lena Xu",
    username: "@lenacrypto",
    initials: "LX",
    bio: "Blockchain dev & smart contract auditor",
    verified: true,
  },
  {
    name: "Omar Hasan",
    username: "@omarinfra",
    initials: "OH",
    bio: "DevOps engineer, Kubernetes evangelist",
    verified: false,
  },
  {
    name: "Priya Sharma",
    username: "@priyarust",
    initials: "PS",
    bio: "Systems programmer, Rust contributor",
    verified: true,
  },
] as const
