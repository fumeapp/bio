// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  root: './server',
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        override: {
          dotenv: '.env.test',
        },
      },
    },
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
    },
  },
})
