// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@nuxt/ui-pro"],
  modules: ["@nuxt/ui", "@prisma/nuxt", "@nuxt/eslint"],
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
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    },
    private: {
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }
  }

})