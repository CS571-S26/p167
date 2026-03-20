import 'leaflet';

export interface Article {
    article_id: string;
    title: string;
    link: string;
    description?: string;
    image_url?: string | null;
    pubDate: string;
}

export interface APIResponse {
    status: string;
    totalResults: number;
    results: Article[];
    nextPage?: string;
}

declare module 'leaflet' {
  interface MapOptions {
    smoothWheelZoom?: boolean | string;
    smoothSensitivity?: number;
  }
}