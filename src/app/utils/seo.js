const SEO_CONTENT = {
  ko: {
    title: "HAN BI SCHEDULE | 비행 일정 관리 · 배경화면 생성 앱",
    description:
      "월별 비행 일정 관리와 스케줄 배경화면 생성을 한 번에 할 수 있는 HAN BI SCHEDULE 앱입니다.",
    ogLocale: "ko_KR",
  },
  en: {
    title: "HAN BI SCHEDULE | Flight Schedule Wallpaper App",
    description:
      "HAN BI SCHEDULE helps you organize monthly flight schedules and generate wallpaper images from them.",
    ogLocale: "en_US",
  },
};

const upsertMeta = (selector, attribute, value) => {
  const element = document.head.querySelector(selector);

  if (!element) {
    return;
  }

  element.setAttribute(attribute, value);
};

export const syncDocumentSeo = (language = "ko") => {
  if (typeof document === "undefined") {
    return;
  }

  const { title, description, ogLocale } =
    SEO_CONTENT[language] ?? SEO_CONTENT.ko;

  document.title = title;
  document.documentElement.lang = language;

  upsertMeta('meta[name="description"]', "content", description);
  upsertMeta('meta[property="og:title"]', "content", title);
  upsertMeta('meta[property="og:description"]', "content", description);
  upsertMeta('meta[property="og:locale"]', "content", ogLocale);
  upsertMeta('meta[name="twitter:title"]', "content", title);
  upsertMeta('meta[name="twitter:description"]', "content", description);

  const canonicalLink = document.head.querySelector('link[rel="canonical"]');

  if (canonicalLink && typeof window !== "undefined") {
    canonicalLink.setAttribute("href", window.location.href);
  }
};
