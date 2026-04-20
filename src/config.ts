import { CUSD_MAINNET, CUSD_ALFAJORES } from "./constants";

export type NetworkName = "mainnet" | "alfajores";

export type ProvaConfig = {
  network: NetworkName;
  jobRegistry: `0x${string}`;
  escrowVault: `0x${string}`;
  reputationLedger: `0x${string}`;
  arbiterPool: `0x${string}`;
  cUSD?: `0x${string}`;
  rpcUrl?: string;
};

export type ResolvedProvaConfig = Required<ProvaConfig> & {
  chainId: number;
};

const RPC_DEFAULTS: Record<NetworkName, string> = {
  mainnet: "https://forno.celo.org",
  alfajores: "https://alfajores-forno.celo-testnet.org",
};

const CHAIN_IDS: Record<NetworkName, number> = {
  mainnet: 42220,
  alfajores: 44787,
};

const CUSD_DEFAULTS: Record<NetworkName, `0x${string}`> = {
  mainnet: CUSD_MAINNET,
  alfajores: CUSD_ALFAJORES,
};

export function createProvaConfig(options: ProvaConfig): ResolvedProvaConfig {
  return {
    ...options,
    cUSD: options.cUSD ?? CUSD_DEFAULTS[options.network],
    rpcUrl: options.rpcUrl ?? RPC_DEFAULTS[options.network],
    chainId: CHAIN_IDS[options.network],
  };
}
