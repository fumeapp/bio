const create = defineEventHandler(async (event) => {
  await setUserSession(event, { user: await readBody(event) })
  return metapi().success('test session created', { headers: event.node.res.getHeader('set-cookie') })
})

export default {
  create,
}
