export default defineEventHandler(async (event) => {
  const headers = {
    corssOriginOpenerPolicy: 'same-origin-allow-popups',
  }
  setHeaders(event, headers)
})
