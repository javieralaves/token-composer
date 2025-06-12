"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [tokens, setTokens] = useState("");
  const [usdc, setUsdc] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, tokens });
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ usdc });
  };

  return (
    <main className="p-8 flex flex-col gap-8">
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
          <button className="bg-blue-500 text-white p-2" type="submit">
            Create
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Deposit USDC</h2>
        <form onSubmit={handleDeposit} className="flex flex-col gap-2 max-w-sm">
          <input
            value={usdc}
            onChange={(e) => setUsdc(e.target.value)}
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
