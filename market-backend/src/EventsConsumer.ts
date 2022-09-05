import * as env from "dotenv";
import { prismaClient } from "./config/libs";
import { loopConsumeBuyEvents } from "./consumers/BuyEventsConsumer";
import { loopConsumeListEvents } from "./consumers/ListEventsConsumer";
env.config();

async function main() {
  const execution = await prismaClient.execution.findFirst();
  let listEventsExecutedSeqNum = execution?.listEventsExecutedSeqNum ?? -1n;
  let buyEventsExecutedSeqNum = execution?.buyEventsExecutedSeqNum ?? -1n;

  const consumeListEvents = loopConsumeListEvents(listEventsExecutedSeqNum);
  const consumeBuyEvents = loopConsumeBuyEvents(buyEventsExecutedSeqNum);

  await Promise.all([consumeListEvents, consumeBuyEvents]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
