export const MIN_BOUNTY = BigInt("10000000000000"); // 0.00001 cUSD in wei

export const STAKE_AMOUNT = BigInt("100000000000000"); // 0.0001 cUSD in wei
export const ARBITER_FEE = BigInt("20000000000000");  // 0.00002 cUSD in wei
export const UNSTAKE_COOLDOWN = 7 * 24 * 60 * 60;    // 7 days in seconds

export const CUSD_DECIMALS = 18;

// Celo chain IDs
export const CELO_MAINNET_CHAIN_ID = 42220;
export const CELO_ALFAJORES_CHAIN_ID = 44787;

// Well-known cUSD addresses
export const CUSD_MAINNET = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as const;
export const CUSD_ALFAJORES = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1" as const;
