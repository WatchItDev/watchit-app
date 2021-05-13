require('chai').use(require('chai-as-promised')).should()
const Token = artifacts.require('W721Token')

contract('Token', ([owner, minter, pauser, holder1, holder2]) => {
    let token, tokenId;
    const _name = "WMediaToken"
    const _symbol = "WMT"
    const tokenUri = 'QmPXME1oRtoT627YKaDPDQ3PwA8tdP9rWuAAweLzqSwAWT/looky.png'

    beforeEach(async () => {
        token = await Token.new(_name, _symbol)
    })

    describe('token attributes', async () => {

        it('has the correct name', async () => {
            const name = await token.name()
            name.should.equal(_name)
        })

        it('has the correct symbol', async () => {
            const symbol = await token.symbol()
            symbol.should.equal(_symbol)
        })
    })

    describe('token minting', async () => {

        it('mints tokens', async () => {
            // It should increase the total supply
            await token.mintToken(holder1, tokenUri)
            const result = await token.tokenCount();
            assert.equal(result.toString(), 1)
        })

        it('mint valid token uri', async () => {
            // It should show current uri
            let tokenId = await token.mintToken(holder1, tokenUri)
            tokenId = tokenId.logs[0].args.tokenId;
            const result = await token.tokenURI(tokenId.toString())
            assert.equal(result.toString(), tokenUri)
        })
    })

    describe('token transfer', async () => {
        it('tranferable', async () => {

        })
    })

})