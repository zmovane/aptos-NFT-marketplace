import { MARKET_ADDRESS } from "../config/constants";
import { aptosClient, prismaClient, walletClient } from "../config/libs";
import { BuyTokenEventData } from "../types";
import { delay } from "../utils/delay";

export async function loopConsumeBuyEvents(buyEventsExecutedSeqNum: bigint) {
  let seqNum = buyEventsExecutedSeqNum;
  while (true) {
    seqNum = await consumeBuyEvents(seqNum + 1n);
    await delay(5000);
  }
}

async function consumeBuyEvents(start: bigint): Promise<bigint> {
  const buyTokenEvents = await aptosClient.getEventsByEventHandle(
    MARKET_ADDRESS!,
    `${MARKET_ADDRESS}::marketplace::MarketEvents`,
    "buy_token_events",
    { start, limit: 100 }
  );

  let seqNum = start;
  for (const event of buyTokenEvents) {
    const data = event.data as BuyTokenEventData;
    const tokenDataId = data.token_id.token_data_id;

    const executedSeqNum = BigInt(event.sequence_number);
    const offerId = BigInt(data.offer_id);
    const updateAt = new Date(parseInt(data.timestamp) / 1000);
    const tokenPropertyVersion = BigInt(data.token_id.property_version);
    const tokenCollection = tokenDataId.collection;
    const tokenCreator = tokenDataId.creator;
    const tokenName = tokenDataId.name;
    const price = parseFloat(data.price);
    const seller = data.seller;
    const buyer = data.buyer;

    const updateOffer = prismaClient.offer.update({
      where: {
        id: offerId,
      },
      data: {
        tokenPropertyVersion,
        tokenCollection,
        tokenCreator,
        tokenName,
        price,
        seller,
        buyer,
        updateAt,
        status: "finished",
      },
    });

    const updateSeqNum = prismaClient.execution.update({
      where: { id: 1 },
      data: {
        buyEventsExecutedSeqNum: executedSeqNum,
      },
    });
    try {
      const [_, updatedExecution] = await prismaClient.$transaction([
        updateOffer,
        updateSeqNum,
      ]);
      seqNum = updatedExecution.buyEventsExecutedSeqNum;
    } catch (e: any) {
      console.error(e);
      return seqNum;
    }
  }
  return seqNum;
}
