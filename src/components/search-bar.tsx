"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BlogPost } from "@/types/blog";

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-(--color-blue-light) text-blue not-italic font-medium rounded-xs px-0.5">
        {text.slice(idx, idx + query.trim().length)}
      </mark>
      {text.slice(idx + query.trim().length)}
    </>
  );
}

export default function SearchBar({ onOpenPost, posts = [] }: { onOpenPost?: (post: BlogPost) => void; posts?: BlogPost[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(urlQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(urlQuery);
    if (urlQuery) setOpen(true);
  }, [urlQuery]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    ).slice(0, 6);
  }, [query, posts]);

  const updateQuery = (value: string) => {
    setQuery(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value);
    else params.delete("q");

    if (pathname !== "/") {
      router.push(`/?${params.toString()}`);
    } else {
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  };

  const handleSelect = (post: BlogPost) => {
    if (onOpenPost) {
      onOpenPost(post);
    } else {
      router.push(`/${post.slug}`);
    }
    setOpen(false);
    setQuery("");
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      {open ? (
        <div className="relative">
          <div className="flex items-center border border-blue rounded-sm overflow-hidden bg-white shadow-sm">
            <span className="pl-3 text-muted flex items-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder="Search posts…"
              className="text-sm px-2.5 py-2 w-56 outline-none text-text bg-transparent"
            />
            <button
              onClick={handleClose}
              className="px-3 py-2 text-muted hover:text-text transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {query.trim().length > 0 && (
            <div className="absolute top-full right-0 mt-1.5 w-80 bg-white border border-border shadow-lg z-1000 rounded-sm overflow-hidden">
              {results.length === 0 ? (
                <div className="px-4 py-5 text-center">
                  <p className="text-sm text-muted">No results for "{query}"</p>
                </div>
              ) : (
                <>
                  <div className="px-3 pt-2.5 pb-1.5 border-b border-border">
                    <p className="text-[10px] uppercase tracking-widest font-medium text-muted">
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ul>
                    {results.map((post, i) => (
                      <li key={post.id}>
                        <button
                          onClick={() => handleSelect(post)}
                          className={`w-full text-left px-4 py-3.5 hover:bg-surface transition-colors group ${
                            i !== results.length - 1 ? "border-b border-border" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase tracking-widest font-medium text-blue">
                              {post.category}
                            </span>
                            <span className="text-[10px] text-muted">· {post.readTime} min</span>
                          </div>
                          <p
                            className="text-sm font-medium text-text group-hover:text-blue transition-colors leading-snug mb-1"
                            style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 600 }}
                          >
                            {highlight(post.title, query)}
                          </p>
                          <p className="text-xs text-muted leading-relaxed line-clamp-1">
                            {highlight(post.excerpt, query)}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 text-muted hover:text-blue transition-colors rounded-sm hover:bg-(--color-blue-light)"
          aria-label="Search"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
