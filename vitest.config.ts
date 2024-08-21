// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        override: {
          runtimeConfig: {
            appEnv: 'test',
          },
        },
      },
    },
  },
})
