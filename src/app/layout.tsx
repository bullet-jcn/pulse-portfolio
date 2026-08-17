import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { Web3Provider } from "@/components/providers/web3-provider";
import { wagmiConfig } from "@/config/wagmi";

export const metadata: Metadata = {
  title: { default: "Pulse", template: "%s · Pulse" },
  description: "Multichain portfolio and wallet intelligence platform",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookie = (await headers()).get("cookie");
  const initialState = cookieToInitialState(wagmiConfig, cookie);

  return (
    <html lang="en">
      <body>
        <Web3Provider initialState={initialState}>
          <AppShell>{children}</AppShell>
        </Web3Provider>
      </body>
    </html>
  );
}
