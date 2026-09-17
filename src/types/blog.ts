export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  tags: string[];
  tagSlugs: string[];
  author: string;
  date: string;
  readTime: number;
  imageId: string;
}
export interface FilterOption { name: string; slug: string; }
