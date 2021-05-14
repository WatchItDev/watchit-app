require('chai').use(require('chai-as-promised')).should()
const Token = artifacts.require('W721Token')

contract('Token', ([owner, minter, pauser, holder1, holder2]) => {
    let token, tokenId;
    const _name = "WMediaToken"
    const _symbol = "WMT"
    const tokenUri = 'QmPXME1oRtoT627YKaDPDQ3PwA8tdP9rWuAAweLzqSwAWT/looky.png'

    beforeEach(async () => {
        token = await Token.new(_name, _symbol)
        tokenId = await token.mintToken(minter, tokenUri)
        tokenId = tokenId.logs[0].args.tokenId;
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
            const result = await token.tokenCount();
            assert.equal(result.toString(), 1)
        })

        it('mint valid token uri', async () => {
            // It should show current uri
            const result = await token.tokenURI(tokenId.toString())
            assert.equal(result.toString(), tokenUri)
        })
    })

    describe('token transfer', async () => {
        it('tranferable', async () => {
            const minterPrivateKey = '4719dd21daaf22bd01bf70dbd02ab4a2b229118c3cf70d51ffe3d2ea79ce6981'
            await token.approve(owner, tokenId)
            await token.safeTransferFrom(minter, holder2, tokenId)
            const newOwner = token.ownerOf(tokenId)
            assert.equal(newOwner.toString(), holder2)
        })
    })

})