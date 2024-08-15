export default authedEventHandler(async ({ user }) => metapi().render(user))
