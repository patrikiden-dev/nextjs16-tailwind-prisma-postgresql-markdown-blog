import "server-only";
import { prisma } from "@/lib/prisma";
import type { BlogPost, FilterOption } from "@/types/blog";

export function normalizeSearchQuery(value: string): string {
  return value.trim().replace(/[^\p{L}\p{N}\s_-]+/gu, " ").replace(/\s+/g, " ");
}

export async function getBlogFilters(): Promise<{ categories: FilterOption[]; tags: FilterOption[] }> {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { name: true, slug: true } }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, select: { name: true, slug: true } }),
  ]);
  return { categories, tags };
}

export async function getPublishedPosts(options: { query?: string; category?: string; tags?: string[]; sort?: string } = {}): Promise<BlogPost[]> {
  const query = normalizeSearchQuery(options.query ?? "");
  const category = options.category?.trim() ?? "";
  const tags = (options.tags ?? []).map((tag) => tag.trim()).filter(Boolean);

  const where = {
    status: "PUBLISHED" as const,
    ...(category ? { category: { slug: category } } : {}),
    ...(tags.length
      ? {
          tags: {
            some: {
              tag: {
                slug: { in: tags },
              },
            },
          },
        }
      : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { excerpt: { contains: query, mode: "insensitive" as const } },
            { content: { contains: query, mode: "insensitive" as const } },
            { author: { name: { contains: query, mode: "insensitive" as const } } },
            { category: { name: { contains: query, mode: "insensitive" as const } } },
            {
              tags: {
                some: {
                  tag: {
                    name: { contains: query, mode: "insensitive" as const },
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const orderBy = options.sort === "oldest"
    ? { publishedAt: "asc" as const }
    : options.sort === "title"
      ? { title: "asc" as const }
      : { publishedAt: "desc" as const };

  const posts = await prisma.post.findMany({
    where,
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
    orderBy,
  });

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category.name,
    categorySlug: post.category.slug,
    tags: post.tags.map(({ tag }) => tag.name),
    tagSlugs: post.tags.map(({ tag }) => tag.slug),
    author: post.author.name,
    date: (post.publishedAt ?? post.createdAt).toISOString(),
    readTime: post.readTime,
    imageId: post.imageId,
  }));
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
  });
  if (!post) return null;
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category.name,
    categorySlug: post.category.slug,
    tags: post.tags.map(({ tag }) => tag.name),
    tagSlugs: post.tags.map(({ tag }) => tag.slug),
    author: post.author.name,
    date: (post.publishedAt ?? post.createdAt).toISOString(),
    readTime: post.readTime,
    imageId: post.imageId,
  };
}
