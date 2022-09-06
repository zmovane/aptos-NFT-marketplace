export interface Event<T>{
  key: string;
  sequence_number: string;
  type: string;
  data: T;
}