import { TransactionInterface_UNSTABLE, useRecoilTransaction_UNSTABLE } from "recoil";

export interface RecoilConduit<T> {
  readonly transform: (trans: TransactionInterface_UNSTABLE, val: T) => void;
}

// define a conduit alongside the atoms and selectors outside of a react component
export function conduit<T>(transform: (trans: TransactionInterface_UNSTABLE, val: T) => void): RecoilConduit<T> {
  return { transform };
}

// Use in a react component to get a function which pushes a val into a conduit
export function useRecoilConduit<T>({ transform }: RecoilConduit<T>): (val: T) => void {
  return useRecoilTransaction_UNSTABLE((trans) => (val: T) => transform(trans, val));
}