
export interface Article {
  article_id: string;
  title: string;
  link: string;
  description?: string;
  image_url?: string | null;
  pubDate: string;
  source_name: string;
  category: string[];
}

export interface NewsSource {
  id: string | null; 
  name: string;
}

export interface NewsAPIArticle {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: NewsSource;
  title: string;
  url: string | null;
  urlToImage: string | null;
}

export interface APIResponse {
  status: string;
  totalResults: number;
  results: Article[];
  nextPage?: string;
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
  nextPage?: string;
}