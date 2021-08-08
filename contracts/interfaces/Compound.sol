// SPDX-License-Identifier: MIT
pragma solidity ^0.8;


interface CErc20 {
    function balanceOf(address owner) external view returns (uint);
    function mint(uint mintAmount) external returns (uint);
    function exchangeRateCurrent() external returns (uint);
    function supplyRatePerBlock() external returns (uint);
    function balanceOfUnderlying(address) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
}


interface CEth {
    function balanceOf(address owner) external view returns (uint);
    function mint(uint mintAmount) external returns (uint);
    function exchangeRateCurrent() external returns (uint);
    function supplyRatePerBlock() external returns (uint);
    function balanceOfUnderlying(address) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
}
