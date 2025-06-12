"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import ConnectButton from "@/components/ConnectButton";
import factoryAbi from "@/abi/TokenBundleFactory.json";
import bundleAbi from "@/abi/TokenBundle.json";

export default function Home() {
  const [name, setName] = useState("");
  const [tokens, setTokens] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
  const [usdcAddress, setUsdcAddress] = useState("");
  const [bundle, setBundle] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_FACTORY_ADDRESS) return;
    const list = tokens.split(",").map((t) => t.trim());
    const weights = Array(list.length).fill(100 / list.length);
    const result = await writeContractAsync({
      abi: factoryAbi,
      address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
      functionName: "createBundle",
      args: [
        name,
        name.slice(0, 3).toUpperCase(),
        usdcAddress as `0x${string}`,
        list,
        weights,
      ],
    });
    // address of new bundle is returned
    setBundle(result as unknown as string);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundle) return;
    await writeContractAsync({
      abi: bundleAbi,
      address: bundle as `0x${string}`,
      functionName: "deposit",
      args: [BigInt(usdcAmount)],
    });
  };

  return (
    <main className="p-8 flex flex-col gap-8">
      <ConnectButton />
      <div>
        <h1 className="text-2xl font-semibold mb-4">Create bundle</h1>
        <form onSubmit={handleCreate} className="flex flex-col gap-2 max-w-sm">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bundle name"
            className="border p-2"
          />
          <input
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            placeholder="Token addresses (comma separated)"
            className="border p-2"
          />
          <input
            value={usdcAddress}
            onChange={(e) => setUsdcAddress(e.target.value)}
            placeholder="USDC address"
            className="border p-2"
          />
          <button className="bg-blue-500 text-white p-2" type="submit">
            Create
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Deposit USDC</h2>
        <form onSubmit={handleDeposit} className="flex flex-col gap-2 max-w-sm">
          <input
            value={usdcAmount}
            onChange={(e) => setUsdcAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2"
          />
          <button className="bg-blue-500 text-white p-2" type="submit">
            Deposit
          </button>
        </form>
      </div>
    </main>
  );
}
