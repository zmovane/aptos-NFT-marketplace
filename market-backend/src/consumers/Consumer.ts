import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { State } from "../State";
import { Event } from "../types/events/event";

export interface Consumer<T> {
  consumeAll(state: State, events: Event<T>[]): Promise<State>;
  consume(
    state: State,
    event: Event<T>
  ): Promise<{ success: boolean; state: State }>;
}

export function dispatch<T>(
  state: State,
  events: Event<T>[],
  consumer: Consumer<T>
): Promise<State> {
  return consumer.consumeAll(state, events);
}

export function handleError(e: any) {
  if (e instanceof PrismaClientKnownRequestError) {
    const msg = `${e.code}: ${JSON.stringify(e.meta)}`;
    console.error(msg);
  } else {
    console.error(e);
  }
}
