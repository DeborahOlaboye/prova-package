# prova-sdk

TypeScript SDK for interacting with [Prova](https://github.com/DeborahOlaboye/prova-package) — a decentralized freelance escrow platform on Celo. This SDK exposes the contract ABIs, read functions, utility helpers, and types as a framework-agnostic package.

## Installation

```bash
npm install prova-sdk
# or
yarn add prova-sdk
# or
pnpm add prova-sdk
```

> **Peer dependency:** `viem >= 2.0.0`

---

## Quick Start

```ts
import { createProvaConfig, fetchJob, fetchScore, formatCUSD } from "prova-sdk";

const config = createProvaConfig({
  network: "mainnet",
  jobRegistry: "0x6fb8524ac76c2f84f8d02f890593079e7858df3c",
  escrowVault: "0x68827139ecdf99d0eb39bb521e63b5f0b20d64f5",
  reputationLedger: "0x71d5c950518c567a80f2ee818fe55e641ae6836a",
  arbiterPool: "0x6051e8709c9c0002348af17d56dd4a420e0fa11e",
});

const job = await fetchJob(config, "0xabc...");
if (job) {
  console.log(job.title);
  console.log(formatCUSD(job.bounty)); // "25.00"
}
```

---

## Configuration

### `createProvaConfig(options)`

Creates a resolved config object with sensible defaults for RPC URLs and cUSD addresses.

```ts
import { createProvaConfig } from "prova-sdk";

const config = createProvaConfig({
  network: "mainnet",          // "mainnet" | "alfajores"
  jobRegistry: "0x...",
  escrowVault: "0x...",
  reputationLedger: "0x...",
  arbiterPool: "0x...",
  cUSD: "0x...",               // optional — defaults to known cUSD address
  rpcUrl: "https://...",       // optional — defaults to Forno
});
```

| Field             | Type           | Required | Default                        |
|-------------------|----------------|----------|--------------------------------|
| `network`         | `NetworkName`  | ✓        | —                              |
| `jobRegistry`     | `0x${string}`  | ✓        | —                              |
| `escrowVault`     | `0x${string}`  | ✓        | —                              |
| `reputationLedger`| `0x${string}`  | ✓        | —                              |
| `arbiterPool`     | `0x${string}`  | ✓        | —                              |
| `cUSD`            | `0x${string}`  | —        | Celo mainnet / Alfajores cUSD  |
| `rpcUrl`          | `string`       | —        | Forno mainnet / testnet        |

---

## Contract Read Functions

All read functions are async, viem-based, and framework-agnostic.

### JobRegistry

#### `fetchJob(config, jobId)`
Fetch a single job by ID. Returns `JobStruct | null`.

```ts
const job = await fetchJob(config, "0xabc...");
```

#### `fetchOpenJobCount(config)`
Returns the total number of open jobs as `bigint`.

```ts
const count = await fetchOpenJobCount(config);
```

#### `fetchOpenJobsPage(config, offset, limit)`
Paginated fetch of open jobs. Returns `JobStruct[]`.

```ts
const jobs = await fetchOpenJobsPage(config, 0, 10);
```

#### `fetchJobsForClient(config, address)`
All jobs posted by a client address. Returns `JobStruct[]`.

```ts
const jobs = await fetchJobsForClient(config, "0xclient...");
```

#### `fetchJobsForFreelancer(config, address)`
All jobs accepted by a freelancer address. Returns `JobStruct[]`.

```ts
const jobs = await fetchJobsForFreelancer(config, "0xfreelancer...");
```

#### `fetchClientJobIds(config, address)` / `fetchFreelancerJobIds(config, address)`
Returns raw `bytes32[]` job ID arrays without fetching full job data.

---

### EscrowVault

#### `fetchLockedAmount(config, jobId)`
Returns the cUSD amount (in wei) currently locked in escrow for a job.

```ts
const locked = await fetchLockedAmount(config, "0xjobId...");
console.log(formatCUSD(locked)); // "100.00"
```

---

### ReputationLedger

#### `fetchScore(config, freelancer)`
Returns the full `ScoreStruct` for a freelancer.

```ts
const score = await fetchScore(config, "0xfreelancer...");
console.log(score.jobsCompleted);
console.log(score.avgRating);
```

#### `fetchCompositeScore(config, freelancer)`
Returns the composite reputation score (0–100) as `bigint`.
Weighted formula: `completionRate×40 + disputeWinRate×20 + avgRating×25 + experience×15`.

```ts
const score = await fetchCompositeScore(config, "0xfreelancer...");
```

---

### ArbiterPool

#### `fetchActiveArbiterCount(config)`
Returns the number of currently active arbiters as `bigint`.

#### `fetchPendingFees(config, arbiter)`
Returns unclaimed arbiter fees (in wei) as `bigint`.

#### `fetchIsDisputed(config, disputeId)`
Returns `true` if a dispute has been opened for the given ID.

---

## Utility Functions

### Currency

| Function | Description |
|----------|-------------|
| `formatCUSD(wei, decimals?)` | Format wei as a cUSD string. Default 2 decimals. |

```ts
formatCUSD(25000000000000000000n) // "25.00"
formatCUSD(25000000000000000000n, 4) // "25.0000"
```

### Addresses

| Function | Description |
|----------|-------------|
| `shortAddress(addr)` | Shorten to `0x1234…abcd` format |
| `celoscanAddress(addr)` | Celoscan URL for an address |
| `celoscanTx(hash)` | Celoscan URL for a transaction |

### Dates & Deadlines

| Function | Description |
|----------|-------------|
| `formatDeadline(timestamp)` | Human-readable date e.g. `"Apr 20, 2026"` |
| `isExpired(timestamp)` | `true` if deadline has passed |
| `daysUntil(timestamp)` | Days remaining until deadline |

### IPFS

| Function | Description |
|----------|-------------|
| `ipfsToHttp(hash)` | Convert IPFS hash / `ipfs://` URI to HTTP gateway URL |

### Job Helpers

| Function | Description |
|----------|-------------|
| `isJobActive(job)` | `true` if status is OPEN, IN_PROGRESS, or SUBMITTED |
| `isJobTerminal(job)` | `true` if status is COMPLETED, REFUNDED, or CANCELLED |
| `JOB_STATUS_LABEL` | Map of `JobStatus → string` label |

### Reputation Helpers

| Function | Description |
|----------|-------------|
| `completionRate(score)` | Percentage of jobs completed vs disputed (0–100) |
| `starRating(avgRating)` | Convert 0–100 rating to 0–5 stars (1 decimal) |

---

## Types

### `JobStruct`

```ts
type JobStruct = {
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
```

### `JobStatus`

```ts
enum JobStatus {
  OPEN = 0,
  IN_PROGRESS = 1,
  SUBMITTED = 2,
  COMPLETED = 3,
  DISPUTED = 4,
  REFUNDED = 5,
  CANCELLED = 6,
}
```

### `ScoreStruct`

```ts
type ScoreStruct = {
  jobsCompleted: number;
  jobsDisputed: number;
  disputesWon: number;
  avgRating: number;      // 0–100
  totalEarned: bigint;    // cumulative cUSD in wei
  memberSince: number;    // unix timestamp
};
```

### `ArbiterStruct`

```ts
type ArbiterStruct = {
  stakedAt: bigint;
  unstakeRequestedAt: bigint;
  active: boolean;
};
```

### `Vote` / `DisputeOutcome`

```ts
enum Vote { NONE = 0, RELEASE = 1, REFUND = 2 }
enum DisputeOutcome { PENDING = 0, RELEASED = 1, REFUNDED = 2 }
```

---

## ABIs

All contract ABIs are exported as `as const` for full TypeScript type inference with viem.

```ts
import {
  JOB_REGISTRY_ABI,
  ESCROW_VAULT_ABI,
  REPUTATION_LEDGER_ABI,
  ARBITER_POOL_ABI,
  ERC20_ABI,
} from "prova-sdk";
```

---

## Constants

```ts
import {
  MIN_BOUNTY,            // 0.00001 cUSD in wei
  STAKE_AMOUNT,          // 0.0001 cUSD in wei
  ARBITER_FEE,           // 0.00002 cUSD in wei
  UNSTAKE_COOLDOWN,      // 7 days in seconds
  CUSD_DECIMALS,         // 18
  CELO_MAINNET_CHAIN_ID, // 42220
  CELO_ALFAJORES_CHAIN_ID, // 44787
  CUSD_MAINNET,
  CUSD_ALFAJORES,
} from "prova-sdk";
```

---

## Deployed Contracts (Celo Alfajores)

| Contract           | Address                                      |
|--------------------|----------------------------------------------|
| `JobRegistry`      | `0x6fb8524ac76c2f84f8d02f890593079e7858df3c` |
| `EscrowVault`      | `0x68827139ecdf99d0eb39bb521e63b5f0b20d64f5` |
| `ReputationLedger` | `0x71d5c950518c567a80f2ee818fe55e641ae6836a` |
| `ArbiterPool`      | `0x6051e8709c9c0002348af17d56dd4a420e0fa11e` |

---

## License

MIT
