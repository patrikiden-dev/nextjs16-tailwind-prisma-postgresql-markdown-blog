"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/types/blog";
import SearchBar from "@/components/search-bar";
import CookieBanner from "@/components/cookie-banner";
import { MarkdownRenderer } from "@/components/post-card";
import Image from "next/image";

type ModalType = "login" | "signup" | null;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function ArticlePage({ post, searchPosts = [] }: { post: BlogPost; searchPosts?: BlogPost[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalType>(null);
  const [cookieConsent, setCookieConsent] = useState<"accepted" | "declined" | null>(null);

  useEffect(() => {
    try {
      setCookieConsent((localStorage.getItem("cookie-consent") as "accepted" | "declined") ?? null);
    } catch {
      setCookieConsent(null);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setCookieConsent("accepted");
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setCookieConsent("declined");
  };

  return (
    <>
      <div className="min-h-full bg-white">
        <header className="border-b border-border sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="max-w-6xl mx-auto px-10 h-14 flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm text-muted hover:text-blue transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
              <Image
                  src="/logo.svg"
                  width={148}
                  height={50}
                  alt="Logo of Tech Blog"
              />
            <div className="flex items-center gap-3">
              <SearchBar posts={searchPosts} />
            </div>
          </div>
        </header>

        <div className="w-full aspect-21/7 overflow-hidden bg-surface">
          <img
            src={`https://images.unsplash.com/${post.imageId}?w=1400&h=467&fit=crop&auto=format`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-2xl mx-auto px-6 py-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-medium uppercase tracking-widest text-blue">{post.category}</span>
            <span className="text-muted text-xs">·</span>
            <span className="text-xs text-muted">{post.readTime} min read</span>
          </div>

          <h1
            className="text-4xl leading-tight mb-4 text-text"
            style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 800 }}
          >
            {post.title}
          </h1>

          <p className="text-lg text-muted leading-relaxed mb-8 border-l-2 border-blue pl-4">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 mb-10 pb-10 border-b border-border">
            <div className="w-9 h-9 rounded-full bg-(--color-blue-light) flex items-center justify-center text-sm font-600 text-blue" style={{ fontWeight: 600 }}>
              {post.author.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="text-sm font-500 text-text" style={{ fontWeight: 500 }}>{post.author}</div>
              <div className="text-xs text-muted">{formatDate(post.date)}</div>
            </div>
          </div>

          <MarkdownRenderer content={post.content} />

          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 bg-(--color-tag-bg) text-blue rounded-sm">{tag}</span>
            ))}
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-10 flex items-center gap-2 text-sm text-blue hover:underline transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to all posts
          </button>
        </div>
      </div>

      {cookieConsent === null && <CookieBanner onAccept={acceptCookies} onDecline={declineCookies} />}
    </>
  );
}
