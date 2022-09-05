import { PrismaClient } from "@prisma/client";

async function main() {
  const client = new PrismaClient();
  const result = await client.execution.upsert({
    where: { id: 1 },
    update: {
      listEventsExecutedSeqNum: -1n,
      buyEventsExecutedSeqNum: -1n,
    },
    create: {
      listEventsExecutedSeqNum: -1n,
      buyEventsExecutedSeqNum: -1n,
    },
  });
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
