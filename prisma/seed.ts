import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { POSTS } from "../src/data/posts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not defined");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("Seeding Notation...");

  const authorMap = new Map<string, number>();
  for (const name of [...new Set(POSTS.map((post) => post.author))]) {
    const user = await prisma.user.upsert({
      where: { email: `${slugify(name)}@example.com` },
      update: { name },
      create: { name, email: `${slugify(name)}@example.com` },
    });
    authorMap.set(name, user.id);
  }

  const categoryMap = new Map<string, number>();
  for (const name of [...new Set(POSTS.map((post) => post.category))]) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
    categoryMap.set(name, category.id);
  }

  const tagMap = new Map<string, number>();
  for (const name of [...new Set(POSTS.flatMap((post) => post.tags))]) {
    const tag = await prisma.tag.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
    tagMap.set(name, tag.id);
  }

  for (const source of POSTS) {
    const authorId = authorMap.get(source.author)!;
    const categoryId = categoryMap.get(source.category)!;

    const post = await prisma.post.upsert({
      where: { slug: source.slug },
      update: {
        title: source.title,
        excerpt: source.excerpt,
        content: source.content,
        readTime: source.readTime,
        imageId: source.imageId,
        status: "PUBLISHED",
        publishedAt: new Date(source.date),
        authorId,
        categoryId,
      },
      create: {
        slug: source.slug,
        title: source.title,
        excerpt: source.excerpt,
        content: source.content,
        readTime: source.readTime,
        imageId: source.imageId,
        status: "PUBLISHED",
        publishedAt: new Date(source.date),
        authorId,
        categoryId,
      },
    });

    await prisma.postTag.deleteMany({ where: { postId: post.id } });
    await prisma.postTag.createMany({
      data: source.tags.map((name) => ({ postId: post.id, tagId: tagMap.get(name)! })),
      skipDuplicates: true,
    });

    console.log(`✓ ${source.title}`);
  }

  console.log(`Seed complete: ${POSTS.length} posts.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
