import { faker } from "@faker-js/faker"
import prisma from "@/lib/prisma"

async function main() {
  // 1 · Create a demo user (or fetch existing one)
  const user = await prisma.user.upsert({
    where: { email: "demo@bytechat.io" },
    update: {},
    create: {
      email: "demo@bytechat.io",
      password: faker.internet.password(),
      username: "DemoUser",
    },
  })

  // 2 · Make 25 posts for that user
  const POSTS_TO_CREATE = 25
  await prisma.post.createMany({
    data: Array.from({ length: POSTS_TO_CREATE }).map(() => ({
      authorId: user.id,
      content: faker.lorem.sentences({ min: 1, max: 3 }),
      createdAt: faker.date.recent({ days: 10 }),
    })),
  })

  console.log(`Seeded ${POSTS_TO_CREATE} posts 👍`)
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
