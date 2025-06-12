"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectButton() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  if (isConnected)
    return (
      <div className="flex items-center gap-2">
        <span className="truncate">{address}</span>
        <button
          onClick={() => disconnect()}
          className="bg-gray-200 p-2"
        >
          Disconnect
        </button>
      </div>
    );

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-blue-500 text-white p-2"
    >
      Connect Wallet
    </button>
  );
}
