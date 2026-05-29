export interface ISlug {
  az: string;
  en: string;
  ru: string;
}

export interface SubProperty {
  id: number;
  title: string;
}

export interface Gallery {
  id: number;
  image: string;
}

export interface SocialLink {
  id: number;
  icon: string;
  url: string;
}

export interface SocialLinksResponse {
  status: string;
  data: SocialLink[];
}

export interface Setting {
  id: number;
  seo_title: string;
  seo_description: string;
  logo: string;
  footer_logo: string;
  favicon: string;
}

export interface SettingResponse {
  data: Setting;
}
