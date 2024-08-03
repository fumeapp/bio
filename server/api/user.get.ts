export default defineEventHandler(async (event) => {
  return {
    data: await prisma.user.findMany({
      include: {
        posts: true,
      }
    }),
  };
});