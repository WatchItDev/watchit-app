/**
 * Created by gmena on 05-03-17.
 */
//Storage manifest
import manifest from 'settings/storage'

const Storage = {
    __toObj: {},
    __getObj(man, cb) {
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
        }, this.__toObj);
    },
    get(parse = true, man = manifest) {
        return {
            from: this.__getObj(
                man, function (key) {
                    return localStorage.getItem(key) ?
                        (parse && JSON.parse(localStorage.getItem(key)))
                        || localStorage.getItem(key) : null;
                }
            )
        }
    },
    add(data, serialize = true, man = manifest) {
        return {
            to: this.__getObj(
                man, function (key) {
                    localStorage.setItem(
                        key, (serialize && JSON.stringify(data)) || data
                    )
                }
            )
        }
    },
    remove(man = manifest) {
        return this.__getObj(
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
    flush() {
        //Flush all localstorage
        //!Warning
        localStorage.clear();
    }
};


//Export
export default Storage;