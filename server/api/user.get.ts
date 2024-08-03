export default defineEventHandler(async (event) => {
  return {
    data: await prisma.user.findMany({
      include: {
        providers: true,
      }
    }),
  };
});