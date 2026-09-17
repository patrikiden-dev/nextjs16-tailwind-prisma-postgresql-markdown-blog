import type { ReactNode } from "react";
import type { Post } from "@/data/posts";
import { formatDate } from "@/utils/date-format";

export default function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer flex flex-col gap-0 border border-border bg-white hover:border-blue transition-colors duration-200"
    >
      {/* header image */}
      <div className="overflow-hidden bg-surface aspect-video">
        <img
          src={`https://images.unsplash.com/${post.imageId}?w=720&h=405&fit=crop&auto=format`}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
      </div>
      {/* card body */}
      <div className="flex flex-col gap-3 p-6 flex-1">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-widest text-blue">
            {post.category}
          </span>
          <span className="text-xs text-muted">·</span>
          <span className="text-xs text-muted">{post.readTime} min read</span>
        </div>
        <h2
          className="font-display text-xl font-700 leading-snug text-text group-hover:text-blue transition-colors duration-150"
          style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700 }}
        >
          {post.title}
        </h2>
        <p className="text-sm text-muted leading-relaxed line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-(--color-tag-bg) text-blue rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* card footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <span className="text-xs text-muted">{post.author}</span>
          <span className="text-xs text-muted">{formatDate(post.date)}</span>
        </div>
      </div>
    </article>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="text-2xl font-700 mt-10 mb-4 text-text"
          style={{ fontFamily: "Urbanist, sans-serif", fontWeight: 700 }}
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("```")) {
      const lang = line.slice(3);
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={i}
          className="bg-surface border border-border rounded-sm p-4 overflow-x-auto text-sm my-5 font-mono text-text"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (line.trim() === "") {
      // skip blank lines (paragraph breaks handled by grouping)
    } else {
      // Inline code
      const parts = line.split(/(`[^`]+`)/g);
      const rendered = parts.map((part, idx) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={idx}
              className="bg-surface border border-border px-1.5 py-0.5 rounded-sm text-sm font-mono"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });
      elements.push(
        <p key={i} className="text-base leading-[1.8] text-text mb-4">
          {rendered}
        </p>
      );
    }
    i++;
  }

  return <div>{elements}</div>;
}

