"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/blog-constants";
import type { BlogPost, FilterOption } from "@/types/blog";
import PostCard from "@/components/post-card";
import SearchBar from "@/components/search-bar";
import CookieBanner from "@/components/cookie-banner";
import Image from "next/image";

function LandingContent({ posts, categories, tags }: {
  posts: BlogPost[];
  categories: FilterOption[];
  tags: FilterOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "All";
  const selectedTagSlugs = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
  const sortBy = searchParams.get("sort") || "newest";
  const query = searchParams.get("q")?.trim() ?? "";

  const [tagsOpen, setTagsOpen] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<"accepted" | "declined" | null>(null);

  useEffect(() => {
    try {
      setCookieConsent((localStorage.getItem("cookie-consent") as "accepted" | "declined") ?? null);
    } catch {
      setCookieConsent(null);
    }
  }, []);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  const toggleTag = (tagSlug: string) => {
    const next = selectedTagSlugs.includes(tagSlug)
      ? selectedTagSlugs.filter((t) => t !== tagSlug)
      : [...selectedTagSlugs, tagSlug];
    updateFilters({ tags: next.length ? next.join(",") : null });
  };

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setCookieConsent("accepted");
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setCookieConsent("declined");
  };

  const clearAll = () => updateFilters({ category: null, tags: null, sort: null, q: null });

  return (
    <>
      <div className="min-h-full bg-white">
        <header className="border-b border-border sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="max-w-6xl mx-auto px-10 h-14 flex items-center justify-between">
            <Image
                src="/logo.svg"
                width={148}
                height={50}
                alt="Logo of Tech Blog"
            />
            <nav className="flex items-center gap-3">
              <SearchBar posts={posts} />
            </nav>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-10 pt-16 pb-12 border-b border-border">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-widest text-blue mb-4">
              A blog about design, engineering & product
            </p>
            <h1
              className="text-5xl leading-[1.1] text-text mb-5"
              style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800 }}
            >
              Ideas worth
              <br />
              thinking about.
            </h1>
            <p className="text-base text-muted leading-relaxed max-w-sm">
              Long-form writing on design systems, frontend engineering, and product craft — by Lena, Jonas, and Maya.
            </p>
          </div>
        </div>

        <div className="sticky top-14 bg-white/95 backdrop-blur-sm border-b border-border z-5">
          <div className="max-w-6xl mx-auto px-10 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[{ name: "All", slug: "" }, ...categories].map((cat) => (
                <button
                  key={cat.slug || "all"}
                  onClick={() => updateFilters({ category: cat.slug || null })}
                  className={`text-xs px-3 py-1.5 rounded-sm border transition-colors duration-150 ${
                    selectedCategory === (cat.slug || "All")
                      ? "bg-blue text-white border-blue"
                      : "bg-white text-muted border-border hover:border-blue hover:text-blue"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-border hidden md:block" />

            <div className="relative">
              <button
                onClick={() => setTagsOpen((v) => !v)}
                className={`text-xs px-3 py-1.5 rounded-sm border transition-colors flex items-center gap-1.5 ${
                  selectedTagSlugs.length > 0
                    ? "border-blue text-blue"
                    : "border-border text-muted hover:border-blue hover:text-blue"
                }`}
              >
                Tags
                {selectedTagSlugs.length > 0 && (
                  <span className="bg-blue text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {selectedTagSlugs.length}
                  </span>
                )}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${tagsOpen ? "rotate-180" : ""}`}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {tagsOpen && (
                <div className="absolute top-full left-0 mt-1.5 p-3 bg-white border border-border shadow-sm rounded-sm z-20 min-w-70 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <button
                      key={tag.slug}
                      onClick={() => toggleTag(tag.slug)}
                      className={`text-xs px-2.5 py-1 rounded-sm border transition-colors ${
                        selectedTagSlugs.includes(tag.slug)
                          ? "bg-blue text-white border-blue"
                          : "bg-(--color-tag-bg) text-blue border-transparent hover:border-blue"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedTagSlugs.length > 0 && (
              <button onClick={() => updateFilters({ tags: null })} className="text-xs text-muted hover:text-text underline">
                Clear tags
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs text-muted">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => updateFilters({ sort: e.target.value === "newest" ? null : e.target.value })}
                className="text-xs border border-border rounded-sm px-2 py-1.5 bg-white text-text hover:border-blue transition-colors outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-10 py-10">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <p className="text-sm">No posts match the current filters.</p>
              <button onClick={clearAll} className="mt-3 text-sm text-blue hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted mb-6">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                {selectedTagSlugs.length > 0 && ` tagged ${selectedTagSlugs.join(", ")}`}
                {query && ` matching "${searchParams.get("q")}"`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onClick={() => router.push(`/${post.slug}`)} />
                ))}
              </div>
            </>
          )}
        </main>

        <footer className="border-t border-border mt-10">
          <div className="max-w-6xl mx-auto px-10 py-8 flex items-center justify-between">
              <Image
                  src="/logo.svg"
                  width={148}
                  height={50}
                  alt="Logo of Tech Blog"
              />
           <p className="text-xs text-muted">© 2026 · Design, engineering & product</p>
          </div>
        </footer>
      </div>

      {cookieConsent === null && <CookieBanner onAccept={acceptCookies} onDecline={declineCookies} />}
    </>
  );
}

export default function LandingPage(props: { posts: BlogPost[]; categories: FilterOption[]; tags: FilterOption[] }) {
  return (
    <Suspense fallback={null}>
      <LandingContent {...props} />
    </Suspense>
  );
}
