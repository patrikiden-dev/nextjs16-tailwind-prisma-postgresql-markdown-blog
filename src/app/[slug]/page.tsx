import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "@/components/article-page";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} | Notation`, description: post.excerpt };
}

export default async function PostRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, searchPosts] = await Promise.all([
    getPublishedPostBySlug(slug),
    getPublishedPosts({ sort: "newest" }),
  ]);
  if (!post) notFound();
  return <ArticlePage post={post} searchPosts={searchPosts} />;
}
