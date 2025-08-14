import { faker } from "@faker-js/faker"
import prisma from "@/lib/prisma"

// Mock image provider: Lorem Picsum (no API key, deterministic via seed)
function picsum(seed: string, w = 1200, h = 900) {
  return {
    url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`,
    alt: `Mock image ${seed}`,
  }
}

async function main() {
  // 1) Create multiple users
  const USERS_TO_CREATE = 6
  const users = [] as { id: string; email: string; username: string }[]

  for (let i = 0; i < USERS_TO_CREATE; i++) {
    const username = faker.internet.userName().slice(0, 20)
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

  // 2) Create posts for each user with 0-3 images
  const POSTS_PER_USER = 10

  for (const user of users) {
    for (let p = 0; p < POSTS_PER_USER; p++) {
      // Pick 0 to 3 images for this post (deterministic seeds for stable URLs)
      const count = faker.number.int({ min: 0, max: 3 })
      const seeds = Array.from({ length: count }, (_, idx) => `${user.username}-${p}-${idx}`)
      const picked = seeds.map((seed) => picsum(seed))

      const createdAt = faker.date.recent({ days: 14 })

      await prisma.post.create({
        data: {
          authorId: user.id,
          content: faker.lorem.sentences({ min: 1, max: 3 }),
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
    }
  }

  console.log(`Seeded ${users.length} users × ${POSTS_PER_USER} posts each = ${users.length * POSTS_PER_USER} posts (with images). ✅`)
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
