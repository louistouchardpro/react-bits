const GITHUB_REPO_API_URL = 'https://api.github.com/repos/DavidHDev/react-bits';
const STARS_REQUEST_TIMEOUT_MS = 4000;

export const getLanguage = key => {
  const languages = {
    code: 'jsx',
    usage: 'jsx',
    tailwind: 'jsx',
    presets: 'jsx',
    utility: 'jsx',
    installation: 'bash',
    css: 'css'
  };

  return languages[key];
};

const formatNumber = num => {
  if (num < 1000) return num.toString();

  const rounded = Math.ceil(num / 100) * 100;
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(rounded);
};

export const getStarsCount = async () => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), STARS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(GITHUB_REPO_API_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (typeof data?.stargazers_count !== 'number') {
      return null;
    }

    return String(formatNumber(data.stargazers_count)).toUpperCase();
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const decodeLabel = label =>
  label
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const forceChakraDarkTheme = () => {
  try {
    localStorage.setItem('chakra-ui-color-mode', 'dark');
  } catch {
    // Ignore storage access failures and continue without forcing the theme.
  }
};

export const randomHex = () =>
  `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
