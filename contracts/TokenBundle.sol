// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title TokenBundle - basic pool that accepts USDC and mints bundle tokens representing shares
contract TokenBundle is ERC20 {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    IERC20[] public tokens;

    constructor(
        string memory name_,
        string memory symbol_,
        IERC20 usdc_,
        IERC20[] memory tokens_
    ) ERC20(name_, symbol_) {
        usdc = usdc_;
        tokens = tokens_;
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "amount == 0");
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    function redeem(uint256 share) external {
        require(share > 0, "share == 0");
        _burn(msg.sender, share);
        usdc.safeTransfer(msg.sender, share);
    }
}
