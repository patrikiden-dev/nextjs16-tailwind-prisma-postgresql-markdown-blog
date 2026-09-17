import { Suspense } from "react";
import LandingPage from "@/components/landing-page";
import { getBlogFilters, getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string | string[];
  category?: string | string[];
  tags?: string | string[];
  sort?: string | string[];
}>;

function first(value?: string | string[]) { return Array.isArray(value) ? value[0] : value; }

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = first(params.q) ?? "";
  const category = first(params.category) ?? "";
  const tags = (first(params.tags) ?? "").split(",").map((tag) => tag.trim()).filter(Boolean);
  const sort = first(params.sort) ?? "newest";

  const [posts, filters] = await Promise.all([
    getPublishedPosts({ query, category, tags, sort }),
    getBlogFilters(),
  ]);

  return (
    <Suspense fallback={null}>
      <LandingPage posts={posts} categories={filters.categories} tags={filters.tags} />
    </Suspense>
  );
}
