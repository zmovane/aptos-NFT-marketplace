import { Subject } from "rxjs";
import { prismaClient } from "./config/libs";
import { BuyEventConsumer, dispatch, ListEventConsumer } from "./consumers";
import { StateFlow, State } from "./State";
import { events, eventStream } from "./EventStream";
import { BuyTokenEventData, ListTokenEventData, Event } from "./types";
import { delay } from "./utils/delay";

async function main() {
  const listStateFlow: StateFlow = new Subject<State>();
  const listEventstream = eventStream<ListTokenEventData>();
  listStateFlow.subscribe(async (state) => {
    await produceListEventsIfStateChange(listEventstream, { ...state });
  });
  listEventstream.subscribe(async ({ state, events }) => {
    listStateFlow.next(await dispatch(state, events, new ListEventConsumer()));
  });
  listStateFlow.next(await initialState());

  const buyStateFlow: StateFlow = new Subject<State>();
  const buyEventstream = eventStream<BuyTokenEventData>();
  buyStateFlow.subscribe(async (state) => {
    await produceBuyEventsIfStateChange(buyEventstream, { ...state });
  });
  buyEventstream.subscribe(async ({ state, events }) => {
    buyStateFlow.next(await dispatch(state, events, new BuyEventConsumer()));
  });
  buyStateFlow.next(await initialState());
}

async function produceListEventsIfStateChange(
  eventStream: Subject<{
    state: State;
    events: Event<ListTokenEventData>[];
  }>,
  state: State
) {
  if (state.listEventsExecutedSeqNum <= state.old!.listEventsExecutedSeqNum) {
    await delay(5000);
  }
  eventStream.next({
    state,
    events: await events<ListTokenEventData>(
      "list_token_events",
      state.listEventsExecutedSeqNum
    ),
  });
}

async function produceBuyEventsIfStateChange(
  eventStream: Subject<{
    state: State;
    events: Event<BuyTokenEventData>[];
  }>,
  state: State
) {
  if (state.buyEventsExecutedSeqNum <= state.old!.buyEventsExecutedSeqNum) {
    await delay(5000);
  }
  eventStream.next({
    state,
    events: await events<BuyTokenEventData>(
      "buy_token_events",
      state.buyEventsExecutedSeqNum
    ),
  });
}

async function initialState(): Promise<State> {
  const execution = await prismaClient.execution.findUnique({
    where: { id: 1 },
  });
  if (!execution) {
    throw new Error("Missing initial state");
  }
  return {
    old: {
      listEventsExecutedSeqNum: -1n,
      buyEventsExecutedSeqNum: -1n,
    },
    listEventsExecutedSeqNum: execution.listEventsExecutedSeqNum,
    buyEventsExecutedSeqNum: execution.buyEventsExecutedSeqNum,
  };
}

main();
