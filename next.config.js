const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.bunnycdn.com', 'images.unsplash.com', 'via.placeholder.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  env: {
    _next_intl_trailing_slash: 'false'
  }
};

module.exports = withNextIntl(nextConfig);
