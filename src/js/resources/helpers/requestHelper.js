/**
 * Created by gmena on 04-20-17.
 */
//Crypt helper
import cryptHelper from './cryptHelper'

export default ({
    formDataToObj: (formdata) => {
        let _entries = formdata.entries();
        let _obj = {};

        for (let v of _entries) {
            _obj[v[0]] = v[1]
        }

        //Return consolidated object
        return _obj

    },
    jsonToQString: (ob) => {
        return encodeURI('?' + (Object.keys(ob).reduce((before, now) => {
            return (before += (now + '=' + ob[now] + '&'))
        }, '')).slice(0, -1));
    },
    generateCacheToken: (data) => {
        //The uri to request
        return cryptHelper.toBase64(
            data
        ).toUpperCase();

    }

})

