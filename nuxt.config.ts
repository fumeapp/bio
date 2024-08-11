// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@prisma/nuxt', '@nuxt/eslint', '@nuxt/content'],
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
      url: process.env.URL ?? 'http://localhost:3000',
      prefix: process.env.PREFIX ?? 'bio',
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      microsoftClientId: process.env.MICROSOFT_CLIENT_ID,
      githubClientId: process.env.GITHUB_CLIENT_ID,
    },
    private: {
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      microsoftClientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  future: {
    compatibilityVersion: 4,
  },
})
