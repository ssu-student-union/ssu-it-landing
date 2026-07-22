declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4로 커스텀 이벤트를 보낸다. gtag가 아직 로드되지 않았으면 조용히 무시한다. */
export const trackEvent = (
  name: string,
  params?: Record<string, string | number | boolean>,
) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  window.gtag("event", name, params);
};
