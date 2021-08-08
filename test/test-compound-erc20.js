const { time } = require("@openzeppelin/test-helpers")
const assert = require("assert")
const BN = require("bn.js")
const { sendEther, pow } = require("./util")
const { DAI, DAI_WHALE, CDAI, WBTC, WBTC_WHALE, CWBTC } = require("./test_config")
const { web3 } = require("@openzeppelin/test-helpers/src/setup")


const TestCompoundErc20 = artifacts.require("TestCompoundErc20");
const IERC20 = artifacts.require("IERC20")
const CErc20 = artifacts.require("CErc20")


const cLog = (args) => console.log(args);


contract("TestCompoundErc20", (accounts) => {
    const WHALE = WBTC_WHALE;
    const TOKEN = WBTC;
    const C_TOKEN = CWBTC;

    let testCompound;
    let token;
    let cToken;

    beforeEach(async () => {
        await sendEther(web3, accounts[0], WHALE, 1);

        testCompound = await TestCompoundErc20.new(TOKEN,C_TOKEN);
        token = await IERC20.at(TOKEN);
        cToken = await CErc20.at(C_TOKEN);

        const bal = await token.balanceOf(WHALE);
        cLog(`whale balance: ${bal}`);

        // bn.js a.gte(b) - a greater than or equals b (n)
        assert(bal.gte(DEPOSIT_AMOUNT), "bal < deposit");
    })

    const snapshot = async (testCompound, token, cToken) => {

        // static call testCompound.getInfo.call(), to non view methods
        // get exchangeRate & supplyRate without sending a trx
        const { exchangeRate, supplyRate } = await testCompound.getInfo.call();

        return {
            exchangeRate,
            supplyRate,
            estimateBalance: await testCompound.estimateBalanceOfUnderlying.call(),
            balanceOfUnderlying: await testCompound.balanceOfUnderlying.call(),
            token: await token.balanceOf(testCompound.address),
            cToken: await cToken.balanceOf(testCompound.address),
        }
    }

    it("should supply & redeem", async () => {
        await token.approve(testCompound.address, DEPOSIT_AMOUNT, { from: WHALE });

        let tx = await testCompound.supply(DEPOSIT_AMOUNT, {
            from: WHALE,
        })

        let after = await snapshot(testCompound, token, cToken);

        for(const log of tx.logs){ cLog(log.event, log.args.message, log.args.val.toString());}

        cLog("--- supply ---");
        cLog(`exchange rate ${after.exchangeRate}`);
        cLog(`supply rate ${after.supplyRate}`);
        cLog(`estimate balance ${after.estimateBalance}`);
        cLog(`blance of underlying ${after.balanceOfUnderlying}`);
        cLog(`token balance ${after.token}`);
        cLog(`c token balance ${after.cToken}`);

        // accrue interest on supply
        const block = await web3.eth.getBlockNumber();
        await time.advanceBlockTo(block + 100);

        after = await snapshot(testCompound, token, cToken);

        cLog(`-- after some blocks ---`)
        cLog(`balance of underlying ${after.balanceOfUnderlying}`)

        // test redeem
        const cTokenAmount = await cToken.balanceOf(testCompound.address);
        tx = await testCompound.redeem(cTokenAmount, {
            from: WHALE
        })

        let afterSupply = await snapshot(testCompound, token, cToken);

        cLog(`-- redeem ---`)
        cLog(`blance of underlying ${afterSupply.balanceOfUnderlying}`);
        cLog(`token balance ${afterSupply.token}`);
        cLog(`c token balance ${afterSupply.cToken}`);
    })
})
