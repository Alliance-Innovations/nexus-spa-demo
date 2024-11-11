export function useAnalytics() {
  const trackEvent = (type: string, element: string) => {
    const event = new CustomEvent('analytics-event', {
      detail: {
        id: Math.random().toString(36).substring(2),
        type,
        element,
        timestamp: Date.now(),
      },
    });
    window.dispatchEvent(event);
  };

  return { trackEvent };
}