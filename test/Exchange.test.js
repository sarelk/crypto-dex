import { tokens, ether, ETHER_ADDRESS, EVM_REVERT } from './helpers'
const Token = artifacts.require('./Token');
const Exchange = artifacts.require('./Exchange');

require('chai').use(require('chai-as-promised')).should()

contract('Exchange', ([deployer, feeAccount, user1]) => {
    let token
    let exchange
    const feePrecent = 10

    beforeEach(async () => {
        token = await Token.new()
        token.transfer(user1, tokens(100), {from:deployer})
        exchange = await Exchange.new(feeAccount, feePrecent)
    })
    describe('deployment', () => {
        it('tracks the fee account', async () => {
            const result = await exchange.feeAccount()
            result.should.equal(feeAccount)
        })
        it('tracks the fee precent', async () => {
            const result = await exchange.feePrecent()
            result.toString().should.equal(feePrecent.toString())
        })
    })

    // describe('fallback', ()=> {
    //     it('revertes when Ether is sent', async () =>{
    //         await exchange.sendTransaction({value: ether(1).toString(), from: user1 }.should.be.rejectedWith(EVM_REVERT))
    //     })
    // })

    describe('depositing Ether', async () => {
        let result
        let amount

        beforeEach(async () =>{
            amount = ether(1)
            result = await exchange.depositEther({from: user1, value: amount})
        })

        it('tracks the Ether deposit', async ()=>{
            const balance = await exchange.tokens(ETHER_ADDRESS, user1)
            balance.toString().should.equal(amount.toString())
        })
        it('emits a Deposit event', async () => {
            const log = result.logs[0]
            log.event.should.equal('Deposit')
            const event = log.args
            event.token.toString().should.equal(ETHER_ADDRESS, 'from is correct')
            event.user.toString().should.equal(user1, 'from is correct')
            event.amount.toString().should.equal(amount.toString(), 'receiver is correct')
            event.balance.toString().should.equal(amount.toString(), 'value is correct')
        })
    })

    describe('withdrawing Ether', async () => {
        let result
        let amount
        amount = ether(1)
        beforeEach(async () =>{
            await exchange.depositEther({from: user1, value: amount})
        })

        describe('success', async () =>{
            beforeEach(async () => {
                result = await exchange.withdrawEther(amount, {from:user1})
            })

            it('withdraw Ether funds', async () =>{
                const balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.equal('0')
            })
            it('emits a Withdraw event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Withdraw')
                const event = log.args
                event.token.toString().should.equal(ETHER_ADDRESS, 'from is correct')
                event.user.toString().should.equal(user1, 'from is correct')
                event.amount.toString().should.equal(amount.toString(), 'receiver is correct')
                event.balance.toString().should.equal('0')
            })
        })

        describe('failure', async () =>{
            it('rejects withdraws for insufficient balances', async() =>{
                await exchange.withdrawEther(ether(100), {from:user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('depositing tokens', () => {
        let result
        let amount

        describe('success', ()=>{
            beforeEach(async () =>{
                amount= tokens(10)
                await token.approve(exchange.address, amount, {from:user1})
                result = await exchange.depositToken(token.address, amount, {from:user1})
            })
            it('tracks the token deposit', async () => {
                let balance
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(amount.toString())
                // Check the tokens on exchange
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal(amount.toString())
            })
            it('emits a Deposit event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Deposit')
                const event = log.args
                event.token.toString().should.equal(token.address, 'from is correct')
                event.user.toString().should.equal(user1, 'from is correct')
                event.amount.toString().should.equal(amount.toString(), 'receiver is correct')
                event.balance.toString().should.equal(amount.toString(), 'value is correct')
            })
        })
        describe('failure', ()=>{
            it('rejects Ether deposits', async () => {
                await exchange.depositToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })

            it('fails when no token are approved', async () => {
                await exchange.depositToken(token.address, tokens(10), {from:user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('withdrawing tokens', async () => {
        let result
        let amount
        amount = ether(1)
        beforeEach(async () =>{
            await token.approve(exchange.address, amount, {from: user1})
            await exchange.depositToken(token.address, amount, {from: user1})
        })

        describe('success', async () =>{
            beforeEach(async () => {
                result = await exchange.withdrawToken(token.address, amount, {from:user1})
            })

            it('withdraw token funds', async () =>{
                const balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal('0')
            })
            it('emits a Withdraw event', async () => {
                const log = result.logs[0]
                log.event.should.equal('Withdraw')
                const event = log.args
                event.token.toString().should.equal(token.address, 'from is correct')
                event.user.toString().should.equal(user1, 'from is correct')
                event.amount.toString().should.equal(amount.toString(), 'receiver is correct')
                event.balance.toString().should.equal('0')
            })
        })

        describe('failure', async () =>{
            it('rejects withdraws for ETHER ADDRESS', async() =>{
                await exchange.withdrawToken(ETHER_ADDRESS, ether(100), {from:user1}).should.be.rejectedWith(EVM_REVERT)
            })
            it('rejects withdraws for insufficient balances', async() =>{
                await exchange.withdrawToken(token.address, ether(100), {from:user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('checking user balance', async () =>{
        beforeEach(async() =>{
            await exchange.depositEther({from: user1, value: ether(1)})
        })
        it('returns user balance', async() =>{
            let result = await exchange.balanceOf(ETHER_ADDRESS, user1)
            result.toString().should.equal(ether(1).toString())
        })
    })
});