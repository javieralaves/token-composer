// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TokenBundle.sol";

/// @title TokenBundleFactory - deploys new TokenBundle pools
contract TokenBundleFactory {
    TokenBundle[] public bundles;

    event BundleCreated(address bundle, address creator);

    function createBundle(
        string memory name,
        string memory symbol,
        IERC20 usdc,
        IERC20[] memory tokens,
        uint32[] memory weights
    ) external returns (TokenBundle bundle) {
        bundle = new TokenBundle(name, symbol, usdc, tokens, weights);
        bundles.push(bundle);
        emit BundleCreated(address(bundle), msg.sender);
    }

    function allBundles() external view returns (TokenBundle[] memory) {
        return bundles;
    }
}
