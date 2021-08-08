// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/Compound.sol";


contract TestCompoundErc20{
    IERC20 public token;
    CErc20 public cToken;

    constructor(address _token, address _cToken){
        token = IERC20(_token);
        cToken = CErc20(_cToken); // compound token
    }

    /** Supply to compound and receive interest */
    function supply(uint _amount) external {
        // To lend the token to compound, first we trasnfer from caller to inside the contract
        token.transferFrom(msg.sender, address(this), _amount);
        // @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
        token.approve(address(cToken), _amount);
        // Transfer token from this contract into the cToken contract and mint cToken back to us
        require(cToken.mint(_amount) == 0, 'Mint failed');
    }


    // Check for ctoken returned as interest, holder of it will be this contract so we use "this"
    function getCTokenBalance() external view returns (uint){
        return cToken.balanceOf(address(this));
    }

    // Not a view tx, usually this will cost eth
    function getInfo() external returns (uint exchangeRate, uint supplyRate){
        // Amount of current exchange rate from cToken to undelying
        exchangeRate = cToken.exchangeRateCurrent();

        // Amount added to your supply balance this block
        supplyRate = cToken.supplyRatePerBlock();
    }

    // Custom impl of balanceOfUnderlying
    function estimateBalanceOfUnderlying() external returns (uint){
        uint cTokenBal = cToken.balanceOf(address(this));
        uint exchangeRate = cToken.exchangeRateCurrent();
        uint decimals = 8; // WBTC = 8 decimals
        uint cTokenDecimals = 8;

        return (cTokenBal * exchangeRate) / 10**(18 + decimals - cTokenDecimals);
    }

    // BalanceOfUnderlying
    function balanceOfUnderlying() external returns (uint){
        return cToken.balanceOfUnderlying(address(this));
    }

    function redeem(uint _cTokenAmount) external {
        require(cToken.redeem(_cTokenAmount) == 0, "redeem failed");
    }

}