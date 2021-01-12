/**
 * Created by gmena on 05-03-17.
 */
//Storage manifest
import manifest from 'js/settings/storage'

let Storage = {
    __toObj: {},
    __getObj: (man, cb) => {
        //The manifest keys
        let _keys = Object.keys(man);

        //Reduce object
        return _keys.reduce((b, n) => {
            //Set function by index
            b[n] = () => {
                return cb(man[n]);
            };

            //Return object
            return b;
        }, Storage.__toObj);
    },
    get: (parse = true, man = manifest) => {
        return {
            from: Storage.__getObj(
                man, function (key) {
                    return localStorage.getItem(key) ?
                        (parse && JSON.parse(localStorage.getItem(key)))
                        || localStorage.getItem(key) : null;
                }
            )
        }
    },
    add: (data, serialize = true, man = manifest) => {
        return {
            to: Storage.__getObj(
                man, function (key) {
                    localStorage.setItem(key, (serialize && JSON.stringify(data)) || data)
                }
            )
        }
    },
    remove: (man = manifest) => {
        return Storage.__getObj(
            man, function (key) {
                //Remove item from localStorage
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    return true;
                }

                //Not removed
                return false;
            }
        )


    },
    flush: () => {
        //Flush all localstorage
        //!Warning
        localStorage.clear();
    }
};


//Export
export default Storage;