import { ISlug } from ".";

export interface BlogItem {
  id: number;
  title: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  image: string;
  view: number;
  date: string;
  /** ISO 8601 publish date — used for <time datetime> and Article JSON-LD. */
  date_iso?: string | null;
  slug: ISlug;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface BlogsMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface BlogsLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface BlogsResponse {
  data: BlogItem[];
  links: BlogsLinks;
  meta: BlogsMeta;
}

export interface BlogDetailResponse {
  data: BlogItem;
}

export interface SimilarBlogsResponse {
  data: BlogItem[];
}
