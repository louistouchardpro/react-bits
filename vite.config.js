import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import safeParser from 'postcss-safe-parser';

import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = {
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

const manualChunkGroups = {
  'react-vendor': ['react', 'react-dom', 'react-router-dom', 'nuqs'],
  'ui-vendor': ['@chakra-ui', '@emotion', 'lucide-react', 'react-icons', 'sonner', 'motion'],
  'graphics-vendor': [
    'three',
    '@react-three',
    'postprocessing',
    'ogl',
    'gsap',
    '@use-gesture',
    'matter-js',
    'meshline',
    'maath',
    'mathjs',
    'face-api.js',
    'react-virtualized'
  ],
  'code-vendor': ['react-syntax-highlighter']
};

const getManualChunk = id => {
  if (!id.includes('node_modules')) {
    return undefined;
  }

  const normalizedId = id.split('node_modules/').pop() ?? id;

  for (const [chunkName, packages] of Object.entries(manualChunkGroups)) {
    if (packages.some(pkg => normalizedId.includes(pkg))) {
      return chunkName;
    }
  }

  return 'vendor';
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: true,
    headers: securityHeaders
  },
  preview: {
    headers: securityHeaders
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@content': path.resolve(__dirname, 'src/content'),
      '@tailwind': path.resolve(__dirname, 'src/tailwind'),
      '@ts-default': path.resolve(__dirname, 'src/ts-default'),
      '@ts-tailwind': path.resolve(__dirname, 'src/ts-tailwind'),
      'react-virtualized': 'react-virtualized/dist/commonjs'
    }
  },
  css: {
    postcss: {
      parser: safeParser
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: getManualChunk
      }
    }
  },
  assetsInclude: ['**/*.glb']
});
