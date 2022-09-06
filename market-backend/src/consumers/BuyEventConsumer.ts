import { prismaClient } from "../config/libs";
import { State } from "../State";
import { BuyTokenEventData, Event } from "../types";
import { Consumer, handleError } from "./Consumer";

export class BuyEventConsumer implements Consumer<BuyTokenEventData> {
  async consumeAll(
    state: State,
    events: Event<BuyTokenEventData>[]
  ): Promise<State> {
    delete state.old;
    let newState = state;
    newState.old = { ...state };
    for (const event of events) {
      const { success, state } = await this.consume(newState, event);
      if (success) {
        newState.buyEventsExecutedSeqNum = state.buyEventsExecutedSeqNum;
      } else {
        return newState;
      }
    }
    return newState;
  }

  async consume(
    state: State,
    event: Event<BuyTokenEventData>
  ): Promise<{ success: boolean; state: State }> {
    let newState = state;
    const data = event.data;
    const executedSeqNum = BigInt(event.sequence_number);
    const tokenDataId = data.token_id.token_data_id;

    const tokenCollection = tokenDataId.collection;
    const tokenCreator = tokenDataId.creator;
    const tokenName = tokenDataId.name;

    const tokenPropertyVersion = BigInt(data.token_id.property_version);
    const offerId = BigInt(data.offer_id);
    const updateAt = new Date(parseInt(data.timestamp) / 1000);
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
      const [_, state] = await prismaClient.$transaction([
        updateOffer,
        updateSeqNum,
      ]);
      newState.buyEventsExecutedSeqNum = state.buyEventsExecutedSeqNum;
      return { success: true, state: newState };
    } catch (e: any) {
      handleError(e);
      return { success: false, state: newState };
    }
  }
}
