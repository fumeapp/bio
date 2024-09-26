declare module '#app' {
  interface RuntimeNuxtHooks {
    'api:login': (id: models.User, token: string) => HookResult
    'api:logout': (id: models.User) => HookResult
  }
  interface NuxtHooks {
    'api:login': (id: models.User, token: string) => HookResult
    'api:logout': (id: models.User) => HookResult
  }
}

declare global {
  interface Window {
    $crisp: array
    CRISP_WEBSITE_ID: string
  }
}
