import { useAnalyticsStore } from "../store/analytics";

declare global {
  interface Window {
    nexus?: {
      track: (type: string, data: Record<string, unknown>) => void;
    };
  }
}

export function useAnalytics() {
  const addEvent = useAnalyticsStore((state) => state.addEvent);

  const trackEvent = (type: string, eventData: Record<string, unknown>) => {
    addEvent(type, eventData);

    if (window.nexus) {
      window.nexus.track(type, eventData);
    } else {
      console.warn("nexus is not loaded yet");
    }
  };

  return { trackEvent };
}
