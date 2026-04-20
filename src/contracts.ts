import { createPublicClient, http, type PublicClient } from "viem";
import { type ResolvedProvaConfig } from "./config";
import {
  JOB_REGISTRY_ABI,
  ESCROW_VAULT_ABI,
  REPUTATION_LEDGER_ABI,
  ARBITER_POOL_ABI,
} from "./abis";
import { type JobStruct, JobStatus } from "./types/job";
import { type ScoreStruct } from "./types/reputation";

function makeClient(config: ResolvedProvaConfig): PublicClient {
  return createPublicClient({
    transport: http(config.rpcUrl),
  });
}

// ─── JobRegistry reads ────────────────────────────────────────────────────────

export async function fetchJob(
  config: ResolvedProvaConfig,
  jobId: `0x${string}`
): Promise<JobStruct | null> {
  const client = makeClient(config);
  try {
    const raw = await client.readContract({
      address: config.jobRegistry,
      abi: JOB_REGISTRY_ABI,
      functionName: "getJob",
      args: [jobId],
    });
    return {
      jobId: raw.jobId as `0x${string}`,
      client: raw.client as `0x${string}`,
      freelancer: raw.freelancer as `0x${string}`,
      title: raw.title,
      criteriaIPFSHash: raw.criteriaIPFSHash,
      deliverableIPFSHash: raw.deliverableIPFSHash,
      bounty: raw.bounty,
      deadline: Number(raw.deadline),
      postedAt: Number(raw.postedAt),
      status: raw.status as JobStatus,
    };
  } catch {
    return null;
  }
}

export async function fetchOpenJobCount(config: ResolvedProvaConfig): Promise<bigint> {
  const client = makeClient(config);
  return client.readContract({
    address: config.jobRegistry,
    abi: JOB_REGISTRY_ABI,
    functionName: "getOpenJobCount",
  });
}

export async function fetchOpenJobIdAt(
  config: ResolvedProvaConfig,
  index: bigint
): Promise<`0x${string}` | null> {
  const client = makeClient(config);
  try {
    return (await client.readContract({
      address: config.jobRegistry,
      abi: JOB_REGISTRY_ABI,
      functionName: "openJobIds",
      args: [index],
    })) as `0x${string}`;
  } catch {
    return null;
  }
}

export async function fetchClientJobIds(
  config: ResolvedProvaConfig,
  address: `0x${string}`
): Promise<readonly `0x${string}`[]> {
  const client = makeClient(config);
  return client.readContract({
    address: config.jobRegistry,
    abi: JOB_REGISTRY_ABI,
    functionName: "getClientJobs",
    args: [address],
  }) as Promise<readonly `0x${string}`[]>;
}

export async function fetchFreelancerJobIds(
  config: ResolvedProvaConfig,
  address: `0x${string}`
): Promise<readonly `0x${string}`[]> {
  const client = makeClient(config);
  return client.readContract({
    address: config.jobRegistry,
    abi: JOB_REGISTRY_ABI,
    functionName: "getFreelancerJobs",
    args: [address],
  }) as Promise<readonly `0x${string}`[]>;
}

export async function fetchJobsForClient(
  config: ResolvedProvaConfig,
  address: `0x${string}`
): Promise<JobStruct[]> {
  const ids = await fetchClientJobIds(config, address);
  const results = await Promise.all(ids.map((id) => fetchJob(config, id)));
  return results.filter((j): j is JobStruct => j !== null);
}

export async function fetchJobsForFreelancer(
  config: ResolvedProvaConfig,
  address: `0x${string}`
): Promise<JobStruct[]> {
  const ids = await fetchFreelancerJobIds(config, address);
  const results = await Promise.all(ids.map((id) => fetchJob(config, id)));
  return results.filter((j): j is JobStruct => j !== null);
}

export async function fetchOpenJobsPage(
  config: ResolvedProvaConfig,
  offset: number,
  limit: number
): Promise<JobStruct[]> {
  const total = Number(await fetchOpenJobCount(config));
  const end = Math.min(offset + limit, total);
  const indices = Array.from({ length: end - offset }, (_, i) => BigInt(offset + i));
  const ids = await Promise.all(indices.map((i) => fetchOpenJobIdAt(config, i)));
  const valid = ids.filter((id): id is `0x${string}` => id !== null);
  const jobs = await Promise.all(valid.map((id) => fetchJob(config, id)));
  return jobs.filter((j): j is JobStruct => j !== null);
}

// ─── EscrowVault reads ────────────────────────────────────────────────────────

export async function fetchLockedAmount(
  config: ResolvedProvaConfig,
  jobId: `0x${string}`
): Promise<bigint> {
  const client = makeClient(config);
  return client.readContract({
    address: config.escrowVault,
    abi: ESCROW_VAULT_ABI,
    functionName: "getLockedAmount",
    args: [jobId],
  });
}

// ─── ReputationLedger reads ───────────────────────────────────────────────────

export async function fetchScore(
  config: ResolvedProvaConfig,
  freelancer: `0x${string}`
): Promise<ScoreStruct> {
  const client = makeClient(config);
  const raw = await client.readContract({
    address: config.reputationLedger,
    abi: REPUTATION_LEDGER_ABI,
    functionName: "getScore",
    args: [freelancer],
  });
  return {
    jobsCompleted: raw.jobsCompleted,
    jobsDisputed: raw.jobsDisputed,
    disputesWon: raw.disputesWon,
    avgRating: raw.avgRating,
    totalEarned: raw.totalEarned,
    memberSince: Number(raw.memberSince),
  };
}

export async function fetchCompositeScore(
  config: ResolvedProvaConfig,
  freelancer: `0x${string}`
): Promise<bigint> {
  const client = makeClient(config);
  return client.readContract({
    address: config.reputationLedger,
    abi: REPUTATION_LEDGER_ABI,
    functionName: "getCompositeScore",
    args: [freelancer],
  });
}

// ─── ArbiterPool reads ────────────────────────────────────────────────────────

export async function fetchActiveArbiterCount(config: ResolvedProvaConfig): Promise<bigint> {
  const client = makeClient(config);
  return client.readContract({
    address: config.arbiterPool,
    abi: ARBITER_POOL_ABI,
    functionName: "activeArbiterCount",
  });
}

export async function fetchPendingFees(
  config: ResolvedProvaConfig,
  arbiter: `0x${string}`
): Promise<bigint> {
  const client = makeClient(config);
  return client.readContract({
    address: config.arbiterPool,
    abi: ARBITER_POOL_ABI,
    functionName: "pendingFees",
    args: [arbiter],
  });
}

export async function fetchIsDisputed(
  config: ResolvedProvaConfig,
  disputeId: `0x${string}`
): Promise<boolean> {
  const client = makeClient(config);
  return client.readContract({
    address: config.arbiterPool,
    abi: ARBITER_POOL_ABI,
    functionName: "isDisputed",
    args: [disputeId],
  });
}
