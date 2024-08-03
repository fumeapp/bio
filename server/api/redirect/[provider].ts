export default defineEventHandler(async (event) => {
  const provider = oauthProvider(event.context.params?.provider, useRuntimeConfig(event))
  if (!provider) return metapi.init().error(event, 'Provider not supported')
  return await sendRedirect(event, oauthClient(provider).authorizationUrl({ scope: provider.scope }), 302)
})
