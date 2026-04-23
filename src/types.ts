import 'leaflet';

export * from './news-types';

declare module 'leaflet' {
  interface MapOptions {
    smoothWheelZoom?: boolean | string;
    smoothSensitivity?: number;
  }
}