declare global {
  interface Window {
    nexus?: {
      track: (type: string, data: Record<string, unknown>) => void;
    }
  }
}

export function useAnalytics() {
  const trackEvent = (type: string, eventData: Record<string, unknown>) => {
    // Create a custom event for other parts of the app if needed
    const customEvent = new CustomEvent('analytics-event', {
      detail: {
        id: Math.random().toString(36).substring(2),
        type,
        eventData,
        timestamp: Date.now(),
      },
    });
    window.dispatchEvent(customEvent);
    if (window.nexus) {
      window.nexus.track(type, eventData);
    } else {
      console.warn("nexus is not loaded yet");
    }
  };

  return { trackEvent };
}
