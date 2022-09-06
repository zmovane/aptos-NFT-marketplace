import { TokenTypes } from "@martiandao/aptos-web3-bip44.js";
import { Execution } from "@prisma/client";
import { prismaClient, walletClient } from "../config/libs";
import { State } from "../State";
import { ListTokenEventData, Event } from "../types";
import { Consumer, handleError } from "./Consumer";

export class ListEventConsumer implements Consumer<ListTokenEventData> {
  async consumeAll(
    state: State,
    events: Event<ListTokenEventData>[]
  ): Promise<State> {
    delete state.old;
    let newState = state;
    newState.old = { ...state };
    for (const event of events) {
      const { success, state } = await this.consume(newState, event);
      if (success) {
        newState.listEventsExecutedSeqNum = state.listEventsExecutedSeqNum;
      } else {
        return newState;
      }
    }
    return newState;
  }
  async consume(
    state: State,
    event: Event<ListTokenEventData>
  ): Promise<{ success: boolean; state: State }> {
    let newState = state;

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
      handleError(e);
      return { success: false, state: newState };
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
      const [execution, _] = await prismaClient.$transaction(transactions);
      newState.listEventsExecutedSeqNum = (
        execution as Execution
      ).listEventsExecutedSeqNum;
      return { success: true, state: newState };
    } catch (e: any) {
      handleError(e);
      return { success: false, state: newState };
    }
  }
}
