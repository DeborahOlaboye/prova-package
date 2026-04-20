import { formatUnits } from "viem";
import { JobStatus, type JobStruct } from "./types/job";
import { type ScoreStruct } from "./types/reputation";

export function formatCUSD(wei: bigint, decimals = 2): string {
  return parseFloat(formatUnits(wei, 18)).toFixed(decimals);
}

export function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatDeadline(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isExpired(deadline: number): boolean {
  return deadline * 1000 < Date.now();
}

export function daysUntil(ts: number): number {
  return Math.ceil((ts * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
}

export function ipfsToHttp(hash: string): string {
  if (!hash) return "";
  if (hash.startsWith("http")) return hash;
  const cid = hash.startsWith("ipfs://") ? hash.slice(7) : hash;
  return `https://w3s.link/ipfs/${cid}`;
}

export function celoscanTx(hash: string): string {
  return `https://celoscan.io/tx/${hash}`;
}

export function celoscanAddress(addr: string): string {
  return `https://celoscan.io/address/${addr}`;
}

// ─── Job helpers ──────────────────────────────────────────────────────────────

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  [JobStatus.OPEN]: "Open",
  [JobStatus.IN_PROGRESS]: "In Progress",
  [JobStatus.SUBMITTED]: "Under Review",
  [JobStatus.COMPLETED]: "Completed",
  [JobStatus.DISPUTED]: "Disputed",
  [JobStatus.REFUNDED]: "Refunded",
  [JobStatus.CANCELLED]: "Cancelled",
};

export function isJobActive(job: JobStruct): boolean {
  return (
    job.status === JobStatus.OPEN ||
    job.status === JobStatus.IN_PROGRESS ||
    job.status === JobStatus.SUBMITTED
  );
}

export function isJobTerminal(job: JobStruct): boolean {
  return (
    job.status === JobStatus.COMPLETED ||
    job.status === JobStatus.REFUNDED ||
    job.status === JobStatus.CANCELLED
  );
}

// ─── Reputation helpers ───────────────────────────────────────────────────────

export function completionRate(score: ScoreStruct): number {
  const total = score.jobsCompleted + score.jobsDisputed;
  if (total === 0) return 0;
  return Math.round((score.jobsCompleted / total) * 100);
}

export function starRating(avgRating: number): number {
  // avgRating is 0–100, convert to 0–5 stars (1 decimal)
  return Math.round((avgRating / 100) * 5 * 10) / 10;
}
