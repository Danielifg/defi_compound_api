const Compound = require('@compound-finance/compound-js'); // in Node.js
const cUsdtAddress = Compound.util.getAddress(Compound.cUSDT);


(async function(){
    const compound = new Compound('http://127.0.0.1:8545'); // HTTP provider
    console.log(compound);
})().catch(console.error);



// (async function() {

//   let supplyRatePerBlock = await Compound.eth.read(
//     cUsdtAddress,
//     'function supplyRatePerBlock() returns (uint)',
//     [], // [optional] parameters
//     {}  // [optional] call options, provider, network, ethers.js "overrides"
//   );

//   console.log('USDT supplyRatePerBlock:',
//                  supplyRatePerBlock.toString());

// })().catch(console.error);