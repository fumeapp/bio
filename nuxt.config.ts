// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@prisma/nuxt', '@nuxt/eslint', '@nuxt/content', '@nuxt/image'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  prisma: {
    installCLI: false,
    installClient: false,
    generateClient: false,
    installStudio: true,
    autoSetupPrisma: true,
  },
  compatibilityDate: '2024-08-01',
  runtimeConfig: {
    public: {
      url: '',
      prefix: '',
      googleClientId: '',
      microsoftClientId: '',
      githubClientId: '',
    },
    googleClientSecret: '',
    microsoftClientSecret: '',
    githubClientSecret: '',
  },
  future: {
    compatibilityVersion: 4,
  },

  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.pnpm/@prisma+client@5.18.0_prisma@5.18.0/node_modules/.prisma/client/index-browser.js',
      },
    },
  },
})
