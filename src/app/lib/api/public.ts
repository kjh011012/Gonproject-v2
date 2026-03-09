import { apiGet } from "./client";

export interface PublicServiceItem {
  id: number;
  code: string;
  publicName: string;
  seniorName: string | null;
  summaryNormal: string;
  summarySenior: string;
  descriptionNormal: string | null;
  descriptionSenior: string | null;
  icon: string | null;
  subtitle: string | null;
  items: string[];
  easyForWho: string[];
  easySteps: Array<{ title: string; desc: string }>;
  applyReasons: string[];
  color: string | null;
  coverUrl: string | null;
}

export interface PublicServicesConfig {
  hero_image: string;
  hero_image_label: string;
  hero_title: string;
  hero_title_senior: string;
  hero_subtitle: string;
  hero_subtitle_senior: string;
  hero_badge: string;
}

export interface PublicNoticeItem {
  id: number;
  title: string;
  summaryNormal: string | null;
  summarySenior: string | null;
  contentNormal: string | null;
  contentSenior: string | null;
  coverUrl: string | null;
  createdAt: string;
  isPinned: boolean;
}

export type PublicPostItem = PublicNoticeItem;

export interface PublicFaqItem {
  id: number;
  category: string;
  question: string;
  answerNormal: string;
  answerSenior: string;
}

export const publicApi = {
  services: () => apiGet<PublicServiceItem[]>("/public/services"),
  servicesConfig: () => apiGet<PublicServicesConfig>("/public/services/config"),
  notices: () => apiGet<PublicNoticeItem[]>("/public/notices"),
  events: () => apiGet<PublicPostItem[]>("/public/events"),
  mediaDocs: () => apiGet<PublicPostItem[]>("/public/media-docs"),
  photos: () => apiGet<PublicPostItem[]>("/public/photos"),
  faqs: () => apiGet<PublicFaqItem[]>("/public/faqs"),
};
