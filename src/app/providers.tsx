"use client";

import { WagmiProvider } from "wagmi";
import { ReactNode } from "react";
import { config } from "@/lib/wagmi";

export default function Providers({ children }: { children: ReactNode }) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
