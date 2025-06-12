const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenBundle", function () {
  let USDC, Token, Factory;
  let usdc, token1, token2, factory, bundle;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    USDC = await ethers.getContractFactory("MockERC20");
    usdc = await USDC.deploy("USDC", "USDC", 6);
    await usdc.mint(owner.address, ethers.parseUnits("1000000", 6));
    await usdc.mint(addr1.address, ethers.parseUnits("1000", 6));
    await usdc.mint(addr2.address, ethers.parseUnits("1000", 6));

    Token = await ethers.getContractFactory("MockERC20");
    token1 = await Token.deploy("Token1", "TK1", 18);
    token2 = await Token.deploy("Token2", "TK2", 18);

    Factory = await ethers.getContractFactory("TokenBundleFactory");
    factory = await Factory.deploy();

    const tx = await factory.createBundle(
      "My Bundle",
      "MB",
      usdc.target,
      [token1.target, token2.target],
      [60, 40]
    );
    const receipt = await tx.wait();
    const event = receipt.logs.find((l) => l.eventName === "BundleCreated");
    bundle = await ethers.getContractAt("TokenBundle", event.args.bundle);
  });

  it("handles deposits and redemptions", async function () {
    await usdc.connect(addr1).approve(bundle.target, ethers.parseUnits("500", 6));
    await bundle.connect(addr1).deposit(ethers.parseUnits("500", 6));

    expect(await bundle.totalSupply()).to.equal(ethers.parseUnits("500", 6));
    expect(await usdc.balanceOf(bundle.target)).to.equal(ethers.parseUnits("500", 6));
    expect(await bundle.tokenBalances(token1.target)).to.equal(ethers.parseUnits("300", 6));
    expect(await bundle.tokenBalances(token2.target)).to.equal(ethers.parseUnits("200", 6));

    await usdc.connect(addr2).approve(bundle.target, ethers.parseUnits("500", 6));
    await bundle.connect(addr2).deposit(ethers.parseUnits("500", 6));

    expect(await bundle.totalSupply()).to.equal(ethers.parseUnits("1000", 6));
    expect(await bundle.tokenBalances(token1.target)).to.equal(ethers.parseUnits("600", 6));
    expect(await bundle.tokenBalances(token2.target)).to.equal(ethers.parseUnits("400", 6));

    await bundle.connect(addr1).redeem(ethers.parseUnits("250", 6));

    expect(await usdc.balanceOf(addr1.address)).to.equal(ethers.parseUnits("750", 6));
    expect(await bundle.totalSupply()).to.equal(ethers.parseUnits("750", 6));
  });
});
