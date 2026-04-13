const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js';
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
let analyticsInitialized = false;

const ensureDataLayer = () => {
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args) {
      window.dataLayer.push(args);
    };
  }

  return window.gtag;
};

export const initializeAnalytics = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined' || analyticsInitialized || !measurementId) {
    return;
  }

  analyticsInitialized = true;

  const scriptId = 'react-bits-analytics';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `${GTAG_SRC}?id=${encodeURIComponent(measurementId)}`;
    script.crossOrigin = 'anonymous';
    script.onerror = () => {
      analyticsInitialized = false;
    };
    document.head.appendChild(script);
  }

  const gtag = ensureDataLayer();
  gtag('js', new Date());
  gtag('config', measurementId, {
    anonymize_ip: true
  });
};
