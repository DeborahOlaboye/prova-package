export enum Vote {
  NONE = 0,
  RELEASE = 1,
  REFUND = 2,
}

export enum DisputeOutcome {
  PENDING = 0,
  RELEASED = 1,
  REFUNDED = 2,
}

export type ArbiterStruct = {
  stakedAt: bigint;
  unstakeRequestedAt: bigint;
  active: boolean;
};
