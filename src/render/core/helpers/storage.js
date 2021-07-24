/**
 * Created by gmena on 05-03-17.
 */
// Storage manifest
/* global localStorage */
import settings from '@settings'

const Storage = {
  __toObj: {},
  __getObj (man, cb) {
    // The manifest keys
    const _keys = Object.keys(man)

    // Reduce object
    return _keys.reduce((b, n) => {
      // Set function by index
      b[n] = () => {
        return cb(man[n])
      }

      // Return object
      return b
    }, this.__toObj)
  },
  get (parse = true, man = settings.storage) {
    return {
      from: this.__getObj(
        man, function (key) {
          return localStorage.getItem(key)
            ? parse
                ? JSON.parse(localStorage.getItem(key))
                : localStorage.getItem(key)
            : null
        }
      )
    }
  },
  add (data, serialize = true, man = settings.storage) {
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
  remove (man = settings.storage) {
    return this.__getObj(
      man, function (key) {
        // Remove item from localStorage
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key)
          return true
        }

        // Not removed
        return false
      }
    )
  },
  flush () {
    // Flush all localstorage
    //! Warning
    localStorage.clear()
  }
}

// Export
export default Storage
