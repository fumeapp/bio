// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    // '@prisma/nuxt',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/image',
    'nuxt-auth-utils',
    '@nuxt/test-utils',
    'nuxt-og-image',
    '@nuxthub/core',
  ],
  hub: {
    database: true,
  },
  /*
  nitro: {
    experimental: {
      wasm: true,
    },
  },
  */
  eslint: {
    config: {
      standalone: false,
    },
  },
  build: {
    transpile: ['shiki'],
  },
  /*
  prisma: {
    installCLI: false,
    installClient: false,
    generateClient: false,
    installStudio: true,
    autoSetupPrisma: true,
  },
  */
  compatibilityDate: '2024-08-01',
  runtimeConfig: {
    appEnv: '',
    session: {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      name: 'fumebio-session',
    },
    oauth: {
      google: {
        clientId: '',
        clientSecret: '',
        redirectURL: '',
      },
      microsoft: {
        clientId: '',
        clientSecret: '',
        tenant: '',
        redirectURL: '',
      },
      github: {
        clientId: '',
        clientSecret: '',
        redirectURL: '',
      },
    },
    public: {
      url: '',
      prefix: '',
    },
  },
  future: {
    compatibilityVersion: 4,
  },

  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.pnpm/@prisma+client@5.19.1_prisma@5.19.1/node_modules/.prisma/client/index-browser.js',
      },
    },
  },
})
