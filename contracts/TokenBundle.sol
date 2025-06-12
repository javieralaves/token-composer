// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title TokenBundle - pools USDC into weighted token allocations
/// @notice USDC is kept in the contract. We only track allocations by weight.
contract TokenBundle is ERC20 {
    using SafeERC20 for IERC20;

    struct WeightedToken {
        IERC20 token;
        uint32 weight; // relative weight, sum of all weights must be > 0
    }

    IERC20 public immutable usdc;
    WeightedToken[] public tokens;
    uint256 public totalWeight;

    // USDC value allocated per token
    mapping(address => uint256) public tokenBalances;

    constructor(
        string memory name_,
        string memory symbol_,
        IERC20 usdc_,
        IERC20[] memory tokenAddrs_,
        uint32[] memory weights_
    ) ERC20(name_, symbol_) {
        require(tokenAddrs_.length == weights_.length, "length mismatch");
        usdc = usdc_;
        for (uint256 i = 0; i < tokenAddrs_.length; i++) {
            tokens.push(WeightedToken({token: tokenAddrs_[i], weight: weights_[i]}));
            totalWeight += weights_[i];
        }
        require(totalWeight > 0, "total weight 0");
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "amount == 0");
        uint256 supply = totalSupply();
        uint256 assets = totalAssets();
        uint256 shares = supply == 0 ? amount : (amount * supply) / assets;
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, shares);
        _allocate(amount);
    }

    function redeem(uint256 share) external {
        require(share > 0, "share == 0");
        uint256 supply = totalSupply();
        uint256 assets = (share * totalAssets()) / supply;
        _burn(msg.sender, share);
        _deallocate(assets);
        usdc.safeTransfer(msg.sender, assets);
    }

    function totalAssets() public view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    function getTokens() external view returns (WeightedToken[] memory) {
        return tokens;
    }

    function _allocate(uint256 amount) internal {
        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 part = (amount * tokens[i].weight) / totalWeight;
            tokenBalances[address(tokens[i].token)] += part;
        }
    }

    function _deallocate(uint256 amount) internal {
        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 part = (amount * tokens[i].weight) / totalWeight;
            tokenBalances[address(tokens[i].token)] -= part;
        }
    }
}
