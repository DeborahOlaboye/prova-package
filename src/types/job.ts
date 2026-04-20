export enum JobStatus {
  OPEN = 0,
  IN_PROGRESS = 1,
  SUBMITTED = 2,
  COMPLETED = 3,
  DISPUTED = 4,
  REFUNDED = 5,
  CANCELLED = 6,
}

export type JobStruct = {
  jobId: `0x${string}`;
  client: `0x${string}`;
  freelancer: `0x${string}`;
  title: string;
  criteriaIPFSHash: string;
  deliverableIPFSHash: string;
  bounty: bigint;
  deadline: number;
  postedAt: number;
  status: JobStatus;
};
