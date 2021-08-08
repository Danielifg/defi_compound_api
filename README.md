# Compound Protocol 

Active Defi CToken's practice

## Supply & Redeem


The mint function transfers an asset into the protocol, which begins accumulating interest based on the current Supply Rate for the asset. The user receives a quantity of cTokens equal to the underlying tokens supplied, divided by the current Exchange Rate.

The redeem function converts a specified quantity of cTokens into the underlying asset, and returns them to the user. The amount of underlying tokens received is equal to the quantity of cTokens redeemed, multiplied by the current Exchange Rate. The amount redeemed must be less than the user's Account Liquidity and the market's available liquidity.


## Borrow & Repay

The borrow function transfers an asset from the protocol to the user, and creates a borrow balance which begins accumulating interest based on the Borrow Rate for the asset. The amount borrowed must be less than the user's Account Liquidity and the market's available liquidity.

The repay function transfers an asset into the protocol, reducing the user's borrow balance


## Dependencies
  - Solidity ^0.8
  - Truffle-cli v5.3.1 (core: 5.3.1)
  - Node v14.17.0
