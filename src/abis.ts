export const JOB_REGISTRY_ABI = [
  {
    type: "function",
    name: "postJob",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title", type: "string" },
      { name: "criteriaIPFSHash", type: "string" },
      { name: "bounty", type: "uint256" },
      { name: "deadline", type: "uint40" },
    ],
    outputs: [{ name: "jobId", type: "bytes32" }],
  },
  {
    type: "function",
    name: "acceptJob",
    stateMutability: "nonpayable",
    inputs: [{ name: "jobId", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "submitWork",
    stateMutability: "nonpayable",
    inputs: [
      { name: "jobId", type: "bytes32" },
      { name: "deliverableIPFSHash", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "cancelJob",
    stateMutability: "nonpayable",
    inputs: [{ name: "jobId", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getJob",
    stateMutability: "view",
    inputs: [{ name: "jobId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "jobId", type: "bytes32" },
          { name: "client", type: "address" },
          { name: "freelancer", type: "address" },
          { name: "title", type: "string" },
          { name: "criteriaIPFSHash", type: "string" },
          { name: "deliverableIPFSHash", type: "string" },
          { name: "bounty", type: "uint256" },
          { name: "deadline", type: "uint40" },
          { name: "postedAt", type: "uint40" },
          { name: "status", type: "uint8" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getClientJobs",
    stateMutability: "view",
    inputs: [{ name: "client", type: "address" }],
    outputs: [{ name: "", type: "bytes32[]" }],
  },
  {
    type: "function",
    name: "getFreelancerJobs",
    stateMutability: "view",
    inputs: [{ name: "freelancer", type: "address" }],
    outputs: [{ name: "", type: "bytes32[]" }],
  },
  {
    type: "function",
    name: "getOpenJobCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "openJobIds",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "event",
    name: "JobPosted",
    inputs: [
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "client", type: "address", indexed: true },
      { name: "bounty", type: "uint256", indexed: false },
      { name: "deadline", type: "uint40", indexed: false },
    ],
  },
  {
    type: "event",
    name: "JobAccepted",
    inputs: [
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "freelancer", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "WorkSubmitted",
    inputs: [
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "deliverableIPFSHash", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "JobCompleted",
    inputs: [{ name: "jobId", type: "bytes32", indexed: true }],
  },
  {
    type: "event",
    name: "JobDisputed",
    inputs: [
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "raisedBy", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "JobRefunded",
    inputs: [{ name: "jobId", type: "bytes32", indexed: true }],
  },
  {
    type: "event",
    name: "JobCancelled",
    inputs: [{ name: "jobId", type: "bytes32", indexed: true }],
  },
] as const;

export const ESCROW_VAULT_ABI = [
  {
    type: "function",
    name: "getLockedAmount",
    stateMutability: "view",
    inputs: [{ name: "jobId", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "lockedFunds",
    stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "FundsLocked",
    inputs: [
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "FundsReleased",
    inputs: [
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "recipient", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "FundsRefunded",
    inputs: [
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "client", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

export const REPUTATION_LEDGER_ABI = [
  {
    type: "function",
    name: "getScore",
    stateMutability: "view",
    inputs: [{ name: "freelancer", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "jobsCompleted", type: "uint32" },
          { name: "jobsDisputed", type: "uint32" },
          { name: "disputesWon", type: "uint32" },
          { name: "avgRating", type: "uint32" },
          { name: "totalEarned", type: "uint256" },
          { name: "memberSince", type: "uint40" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getCompositeScore",
    stateMutability: "view",
    inputs: [{ name: "freelancer", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "CompletionRecorded",
    inputs: [
      { name: "freelancer", type: "address", indexed: true },
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "clientRating", type: "uint32", indexed: false },
      { name: "amountEarned", type: "uint256", indexed: false },
    ],
  },
] as const;

export const ARBITER_POOL_ABI = [
  {
    type: "function",
    name: "stake",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "requestUnstake",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "unstake",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "submitVote",
    stateMutability: "nonpayable",
    inputs: [
      { name: "disputeId", type: "bytes32" },
      { name: "vote", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "claimFee",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "arbiters",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "stakedAt", type: "uint256" },
      { name: "unstakeRequestedAt", type: "uint256" },
      { name: "active", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "pendingFees",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "activeArbiterCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getDisputeOutcome",
    stateMutability: "view",
    inputs: [{ name: "disputeId", type: "bytes32" }],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "isDisputed",
    stateMutability: "view",
    inputs: [{ name: "disputeId", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "STAKE_AMOUNT",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "ARBITER_FEE",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "ArbiterJoined",
    inputs: [{ name: "arbiter", type: "address", indexed: true }],
  },
  {
    type: "event",
    name: "DisputeOpened",
    inputs: [
      { name: "disputeId", type: "bytes32", indexed: true },
      { name: "jobId", type: "bytes32", indexed: true },
    ],
  },
  {
    type: "event",
    name: "VoteCast",
    inputs: [
      { name: "disputeId", type: "bytes32", indexed: true },
      { name: "arbiter", type: "address", indexed: true },
      { name: "vote", type: "uint8", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DisputeResolved",
    inputs: [
      { name: "disputeId", type: "bytes32", indexed: true },
      { name: "outcome", type: "uint8", indexed: false },
    ],
  },
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
