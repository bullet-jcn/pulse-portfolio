import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { arbitrum, base, mainnet, polygon } from "wagmi/chains";
import { injected } from "wagmi/connectors/injected";
import { walletConnect } from "wagmi/connectors/walletConnect";

export const supportedChains = [mainnet, base, arbitrum, polygon] as const;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const storage = createStorage({ storage: cookieStorage });
const transports = {
  [mainnet.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL),
  [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
  [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL),
  [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL),
};

export const wagmiConfig = walletConnectProjectId
  ? createConfig({
      chains: supportedChains,
      connectors: [
        injected(),
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
          metadata: {
            name: "Pulse",
            description: "Multichain portfolio and wallet intelligence platform",
            url: "http://localhost:3000",
            icons: [],
          },
        }),
      ],
      multiInjectedProviderDiscovery: true,
      ssr: true,
      storage,
      transports,
    })
  : createConfig({
      chains: supportedChains,
      connectors: [injected()],
      multiInjectedProviderDiscovery: true,
      ssr: true,
      storage,
      transports,
    });

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

export const isWalletConnectConfigured = Boolean(walletConnectProjectId);
