import { Subject } from "rxjs";

export type State = {
  listEventsExecutedSeqNum: bigint;
  buyEventsExecutedSeqNum: bigint;
  old?: State;
};

export type StateFlow = Subject<State>;
