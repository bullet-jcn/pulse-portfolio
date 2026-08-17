"use client";

import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  LoaderCircle,
  LogOut,
  WalletCards,
  X,
} from "lucide-react";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { formatUnits, type Address, type Chain } from "viem";
import {
  useBalance,
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useSwitchChain,
  type Connector,
} from "wagmi";
import { isWalletConnectConfigured, supportedChains } from "@/config/wagmi";
import { shortenAddress } from "@/lib/address";
import { cn } from "@/lib/utils";

export function WalletControl() {
  const connection = useConnection();
  const [isOpen, setIsOpen] = useState(false);

  if (connection.isConnecting || connection.isReconnecting) {
    return (
      <WalletButton disabled>
        <LoaderCircle className="animate-spin" size={16} />
        {connection.isReconnecting ? "Restoring" : "Connecting"}
      </WalletButton>
    );
  }

  if (connection.isConnected) {
    return (
      <div className="relative">
        <WalletButton onClick={() => setIsOpen((current) => !current)}>
          <span className="size-2 rounded-full bg-[#07110e]" />
          {shortenAddress(connection.address)}
          <ChevronDown size={15} />
        </WalletButton>
        {isOpen && (
          <AccountPanel
            address={connection.address}
            chain={connection.chain}
            chainId={connection.chainId}
            connectorName={connection.connector.name}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <WalletButton onClick={() => setIsOpen(true)}>Connect wallet</WalletButton>
      {isOpen && <ConnectWalletDialog onClose={() => setIsOpen(false)} />}
    </>
  );
}

function WalletButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "bg-accent ml-auto inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-[#07110e] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-75 sm:ml-0",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function ConnectWalletDialog({ onClose }: { onClose: () => void }) {
  const connectors = useConnectors() as readonly Connector[];
  const connect = useConnect();

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal>
      <button
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label="Close wallet dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border bg-[#10151d] p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Connect a wallet</h2>
            <p className="text-muted mt-1 text-sm">Choose a wallet to continue to Pulse.</p>
          </div>
          <button className="text-muted rounded-lg p-2 hover:bg-white/5" onClick={onClose}>
            <X size={18} />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              className="flex w-full items-center gap-3 rounded-xl border bg-white/[.025] p-4 text-left transition hover:bg-white/[.06] disabled:opacity-60"
              disabled={connect.isPending}
              onClick={() => connect.mutate({ connector }, { onSuccess: onClose })}
            >
              <span className="text-accent grid size-10 place-items-center rounded-xl bg-white/[.06]">
                {connect.isPending ? (
                  <LoaderCircle className="animate-spin" size={19} />
                ) : (
                  <WalletCards size={19} />
                )}
              </span>
              <span>
                <b className="block text-sm">{connector.name}</b>
                <small className="text-muted">
                  {connector.type === "walletConnect" ? "Mobile wallet" : "Browser wallet"}
                </small>
              </span>
            </button>
          ))}

          {connectors.length === 0 && (
            <p className="rounded-xl border border-orange-300/15 bg-orange-300/[.04] p-4 text-sm text-orange-100">
              No browser wallet was detected. Install MetaMask or Rabby, then refresh the page.
            </p>
          )}
        </div>

        {!isWalletConnectConfigured && (
          <p className="text-muted mt-4 text-xs leading-5">
            Mobile wallets will be enabled after a WalletConnect Project ID is configured.
          </p>
        )}
        {connect.error && <WalletError error={connect.error} />}
      </div>
    </div>
  );
}

type AccountPanelProps = {
  address: Address;
  chain: Chain | undefined;
  chainId: number;
  connectorName: string;
  onClose: () => void;
};

function AccountPanel({ address, chain, chainId, connectorName, onClose }: AccountPanelProps) {
  const supportedChain = supportedChains.find((candidate) => candidate.id === chainId);
  const balance = useBalance({ address, chainId: supportedChain?.id });
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const [copied, setCopied] = useState(false);
  const explorerUrl = chain?.blockExplorers?.default.url;

  async function copyAddress() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  }

  return (
    <div className="absolute top-12 right-0 z-40 w-[min(360px,calc(100vw-2rem))] rounded-2xl border bg-[#10151d] p-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted text-xs">Connected with {connectorName}</p>
          <p className="mt-1 font-medium">{shortenAddress(address, 6)}</p>
        </div>
        <button className="text-muted rounded-lg p-2 hover:bg-white/5" onClick={onClose}>
          <X size={17} />
          <span className="sr-only">Close account menu</span>
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-white/[.035] p-4">
        <p className="text-muted text-xs">Native balance</p>
        <p className="mt-1 text-xl font-semibold">{formatBalance(balance)}</p>
        {balance.isError && (
          <button className="text-accent mt-2 text-xs" onClick={() => balance.refetch()}>
            Retry balance
          </button>
        )}
      </div>

      {!supportedChain && (
        <p className="mt-3 rounded-xl bg-orange-300/[.06] p-3 text-xs text-orange-100">
          This network is not supported. Select a Pulse network below.
        </p>
      )}

      <div className="mt-4">
        <p className="text-muted mb-2 text-xs">Network</p>
        <div className="grid grid-cols-2 gap-2">
          {supportedChains.map((chain) => (
            <button
              key={chain.id}
              disabled={switchChain.isPending}
              onClick={() => switchChain.mutate({ chainId: chain.id })}
              className={cn(
                "flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition hover:bg-white/5",
                chainId === chain.id && "border-accent/40 bg-accent/[.06]",
              )}
            >
              {chain.name}
              {chainId === chain.id && <Check size={14} className="text-accent" />}
            </button>
          ))}
        </div>
        {switchChain.error && <WalletError error={switchChain.error} compact />}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4">
        <AccountAction onClick={copyAddress} icon={copied ? <Check /> : <Copy />}>
          {copied ? "Copied" : "Copy"}
        </AccountAction>
        {explorerUrl ? (
          <a
            className="text-muted flex flex-col items-center gap-1.5 rounded-lg p-2 text-[11px] transition hover:bg-white/5 hover:text-white"
            href={`${explorerUrl}/address/${address}`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={16} /> Explorer
          </a>
        ) : (
          <span />
        )}
        <AccountAction
          className="text-red-300"
          onClick={() => disconnect.mutate(undefined, { onSuccess: onClose })}
          icon={<LogOut />}
        >
          Disconnect
        </AccountAction>
      </div>
    </div>
  );
}

type AccountActionProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon: ReactNode };

function AccountAction({ icon, children, className, ...props }: AccountActionProps) {
  return (
    <button
      className={cn(
        "text-muted flex flex-col items-center gap-1.5 rounded-lg p-2 text-[11px] transition hover:bg-white/5 hover:text-white",
        className,
      )}
      {...props}
    >
      <span className="[&>svg]:size-4">{icon}</span>
      {children}
    </button>
  );
}

function WalletError({ error, compact = false }: { error: Error; compact?: boolean }) {
  const message = error.message.toLowerCase();
  const friendlyMessage =
    message.includes("rejected") || message.includes("denied")
      ? "The request was cancelled in your wallet."
      : "The wallet request could not be completed. Please try again.";

  return (
    <p role="alert" className={cn("text-red-300", compact ? "mt-2 text-xs" : "mt-4 text-sm")}>
      {friendlyMessage}
    </p>
  );
}

type BalanceView = {
  isPending: boolean;
  isError: boolean;
  data?: { decimals: number; symbol: string; value: bigint };
};

function formatBalance(balance: BalanceView) {
  if (balance.isPending) return "Loading…";
  if (balance.isError) return "Unavailable";
  const formatted = balance.data ? formatUnits(balance.data.value, balance.data.decimals) : "0";
  const value = Number(formatted).toLocaleString(undefined, {
    maximumFractionDigits: 5,
  });
  return `${value} ${balance.data?.symbol ?? ""}`;
}
