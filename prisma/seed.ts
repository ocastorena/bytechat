import { faker } from "@faker-js/faker"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

/** Mock image provider: Lorem Picsum (no API key, deterministic via seed) */
function picsum(seed: string, w = 1200, h = 900) {
  return {
    url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`,
    alt: `Mock image ${seed}`,
  }
}

/** Curated tech/hacker-themed post templates for realistic demo content */
const TECH_POSTS = [
  "Just deployed a new Kubernetes cluster with zero downtime. The future is containers.",
  "TIL about zero-knowledge proofs. Mind absolutely blown. Privacy tech is going to change everything.",
  "Hot take: Rust will replace C++ within 10 years. Fight me.",
  "Anyone else obsessed with mechanical keyboards? Just built my first custom split ergo.",
  "Spent 4 hours debugging a race condition only to find it was a missing await. Classic.",
  "Vim or Neovim? I switched to Neovim with Lua config and I'm never going back.",
  "Just open-sourced my CLI tool for managing dotfiles across machines. Link in bio.",
  "The best code is the code you never had to write. Simplicity wins every time.",
  "Pair programming with AI is wild. It's like having a junior dev who knows every API ever written.",
  "Wrote my first WebAssembly module today. The performance gains are unreal.",
  "Cybersecurity tip: if your password is 'password123', just hand over your data now and save time.",
  "Finally set up my home lab. Proxmox + TrueNAS + Pi-hole. Self-hosting everything.",
  "GraphQL vs REST is not a debate. They solve different problems. Use what fits.",
  "Functional programming changed how I think about state. Immutability is a superpower.",
  "New blog post: 'Why I migrated from AWS to bare metal and saved 80%'. Thread below.",
  "Arch Linux users: we get it, you use Arch. (I also use Arch btw)",
  "Docker compose is the most underrated tool in a developer's toolkit. Change my mind.",
  "Just finished reading 'Designing Data-Intensive Applications'. Should be required reading for all engineers.",
  "TypeScript's type system is Turing complete. This is both amazing and terrifying.",
  "The terminal is my IDE. tmux + neovim + lazygit = peak productivity.",
  "Spent the weekend contributing to open source. Merged 3 PRs. Feels great to give back.",
  "PSA: please stop storing passwords in plain text in 2026. bcrypt exists. Use it.",
  "My dotfiles repo has more commits than some of my actual projects.",
  "Learning Zig this week. Manual memory management without the C footguns. Intriguing.",
  "Unpopular opinion: monorepos are the way to go for most teams.",
  "SSH tunneling is basically magic. Port forwarding through a bastion host in one command.",
  "Just automated my entire deployment pipeline with GitHub Actions. CI/CD is beautiful.",
  "The best debugging tool is a good night's sleep. Seriously.",
  "Wrote a custom Neovim plugin in Lua over the weekend. The API is surprisingly clean.",
  "Edge computing is the next frontier. Lambda@Edge has changed how I architect APIs.",
  "Nix + home-manager for reproducible dev environments. Once you try it, there's no going back.",
  "The amount of data being collected on us is staggering. Encryption is self-defense.",
  "git rebase -i is an art form. Interactive rebasing makes your history beautiful.",
  "Built a real-time dashboard with WebSockets today. Server-sent events > polling.",
  "Tech interviews should test real-world problem solving, not LeetCode memorization.",
  "Switched to Firefox with uBlock Origin. Browsing without ads feels like a different internet.",
  "Postgres is the most versatile database. JSONB, full-text search, extensions — it does everything.",
  "The Zen of Python says 'explicit is better than implicit'. More codebases should follow this.",
  "Anyone running Tailscale for their home network? VPN mesh networking done right.",
  "My RSS reader has more feeds than I can read. Information overload is real.",
  "Systemd timers > cron jobs. Better logging, dependency management, and no crontab syntax.",
  "Watching a well-written test suite catch a regression is deeply satisfying.",
  "Just got my hands on a Raspberry Pi 5. Time for another overengineered home automation project.",
  "OAuth 2.0 flows still confuse me after all these years. PKCE makes it slightly less painful.",
  "The best config format is the one your team can actually read. TOML gang rise up.",
  "Refactored 2000 lines of spaghetti into 200 lines of clean code. DRY principle in action.",
  "Running a personal Mastodon instance. The fediverse is the future of social media.",
  "Shoutout to everyone maintaining open source projects for free. You're the real MVPs.",
]

async function main() {
  // Clean existing posts and images for idempotent re-seeding
  await prisma.image.deleteMany()
  await prisma.post.deleteMany()

  // 0) Dev account — dev@bytechat.io / password
  const devPassword = await bcrypt.hash("password", 10)
  const devUser = await prisma.user.upsert({
    where: { email: "dev@bytechat.io" },
    update: { username: "Dev" },
    create: {
      email: "dev@bytechat.io",
      password: devPassword,
      username: "Dev",
    },
  })

  const users = [
    { id: devUser.id, email: devUser.email, username: devUser.username },
  ]

  // 1) Create additional users with tech-flavored usernames
  const USERS_TO_CREATE = 29

  for (let i = 0; i < USERS_TO_CREATE; i++) {
    const adjective = faker.hacker.adjective().replace(/\s+/g, "")
    const name = faker.person.firstName()
    const username = `${adjective}${name}`.slice(0, 20)
    const email = faker.internet.email({ firstName: username, provider: "bytechat.io" }).toLowerCase()

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: faker.internet.password(),
        username
      }
    })

    users.push({ id: user.id, email, username })
  }

  // 2) Create posts for each user with 0-3 images (varied count per user)
  let totalPosts = 0

  for (const user of users) {
    const postsForUser = faker.number.int({ min: 5, max: 20 })

    for (let p = 0; p < postsForUser; p++) {
      // Pick 0 to 3 images for this post (deterministic seeds for stable URLs)
      const count = faker.number.int({ min: 0, max: 3 })
      const seeds = Array.from({ length: count }, (_, idx) => `${user.username}-${p}-${idx}`)
      const picked = seeds.map((seed) => picsum(seed))

      const createdAt = faker.date.recent({ days: 30 })

      // Mix curated tech posts with faker-generated content
      const content = faker.datatype.boolean(0.7)
        ? faker.helpers.arrayElement(TECH_POSTS)
        : faker.lorem.sentences({ min: 1, max: 3 })

      await prisma.post.create({
        data: {
          authorId: user.id,
          content,
          createdAt,
          images: picked.length
            ? {
                create: picked.map((img, idx) => ({
                  url: img.url,
                  altText: img.alt,
                  order: idx,
                }))
              }
            : undefined,
        }
      })

      totalPosts++
    }
  }

  console.log(`Seeded ${users.length} users, ${totalPosts} posts (with images). ✅`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("[SEED_ERROR]", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
