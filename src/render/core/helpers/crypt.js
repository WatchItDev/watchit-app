/**
 * Created by gmena on 05-03-17.
 */
export default ({
    toBase64: (data)=> {
        return ((
            new Buffer(data || '', 'utf8')
        ).toString('base64'))
    },
    fromBase64: (data)=> {
        return new Buffer(
            data, 'base64'
        ).toString()

    }

})