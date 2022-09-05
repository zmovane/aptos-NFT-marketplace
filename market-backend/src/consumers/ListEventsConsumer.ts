import { TokenTypes } from "@martiandao/aptos-web3-bip44.js";
import { Execution } from "@prisma/client";
import { MARKET_ADDRESS } from "../config/constants";
import { aptosClient, prismaClient, walletClient } from "../config/libs";
import { ListTokenEventData } from "../types";
import { delay } from "../utils/delay";

export async function loopConsumeListEvents(listEventsExecutedSeqNum: bigint) {
  let seqNum = listEventsExecutedSeqNum;
  while (true) {
    seqNum = await consumeListEvents(seqNum + 1n);
    await delay(5000);
  }
}

async function consumeListEvents(start: bigint): Promise<bigint> {
  const listTokenEvents = await aptosClient.getEventsByEventHandle(
    MARKET_ADDRESS!,
    `${MARKET_ADDRESS}::marketplace::MarketEvents`,
    "list_token_events",
    { start, limit: 100 }
  );

  let seqNum: bigint = start;
  for (const event of listTokenEvents) {
    const transactions = [];
    const data = event.data as ListTokenEventData;
    const tokenDataId = data.token_id.token_data_id;

    const creator = tokenDataId.creator;
    const propertyVersion = BigInt(data.token_id.property_version);
    const collection = tokenDataId.collection;
    const name = tokenDataId.name;
    let token = await prismaClient.token.findUnique({
      where: {
        propertyVersion_creator_collection_name: {
          propertyVersion,
          creator,
          collection,
          name,
        },
      },
    });

    try {
      if (!token) {
        const { description, uri, maximum, supply } =
          (await walletClient.getToken(data.token_id)) as TokenTypes.TokenData;
        token = await prismaClient.token.create({
          data: {
            creator,
            propertyVersion,
            collection,
            name,
            uri,
            description,
            maximum: BigInt(maximum ?? -1),
            supply: BigInt(supply),
          },
        });
      }
    } catch (e) {
      console.error(e);
      return seqNum;
    }

    const executedSeqNum = BigInt(event.sequence_number);
    const createAt = new Date(parseInt(data.timestamp) / 1000);
    const offerId = BigInt(data.offer_id);
    const price = parseFloat(data.price);
    const seller = data.seller;

    transactions.push(
      prismaClient.execution.update({
        where: { id: 1 },
        data: {
          listEventsExecutedSeqNum: executedSeqNum,
        },
      })
    );

    transactions.push(
      prismaClient.offer.create({
        data: {
          id: offerId,
          // FIXME: use token:{connectOrCreate}
          tokenId: token.id,
          price,
          seller,
          status: "ongoing",
          tokenPropertyVersion: propertyVersion,
          tokenCreator: creator,
          tokenCollection: collection,
          tokenName: name,
          createAt,
        },
      })
    );

    try {
      const [execution] = await prismaClient.$transaction(transactions);
      seqNum = (execution as Execution).listEventsExecutedSeqNum;
    } catch (e: any) {
      console.error(e);
      return seqNum;
    }
  }
  return seqNum;
}
