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
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
      thresholds: {
        lines: 60,
        branches: 60,
        functions: 60,
        statements: 60,
      },
    },
  },
})
