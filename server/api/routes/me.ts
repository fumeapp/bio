export default authedHandler(async ({ user }) => metapi().render(user))
