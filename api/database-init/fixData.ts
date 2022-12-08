import { PrismaClient } from '@prisma/client';

const dbURL =
  'mongodb://aiim-admin:root-pass@localhost:27017/aiim-db?authSource=aiim-db&directConnection=true';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbURL,
    },
  },
});

const execute = async () => {
  const votes = await prisma.vote.findMany();
  const length = votes.length;
  let i = 0;
  const errors = [];

  for (const vote of votes) {
    console.log('Starting update of vote', vote.id);
    const start = Date.now();
    try {
      await prisma.vote.update({
        where: {
          id: vote.id,
        },
        data: {
          userId: vote.userId,
          imageId: vote.imageId,
        },
      });
      console.log(`Finished update of vote [${i}] in ${Date.now() - start}ms`);
      console.log('Percentage done: ', (i++ / length) * 100, '%');
    } catch (error) {
      console.log('Error updating vote', vote.id);
      errors.push({
        vote: vote.id,
        error,
      });
    }
  }
  console.log('Finished updating all votes');
  console.log('Errors: ', errors);
};

(async () => {
  await execute();
})();
