/**
 * Created by gmena on 04-20-17.
 */
//Crypt helper
//import setting from 'backend/settings'
import timezone from 'moment-timezone'


let Time = ({
    factory: (timezone_ = 'US/Eastern', ...params) => {
        /**
         * Return factory timezoned date
         * @param {string} timezone_
         * @param {array} ...params
         * @return {object} timezoned date
         */
        return timezone(...params)
            .tz(timezone_)
    },
    nowTimeZoned: (timezone_) => {
        /**
         * Return now datetime timezone based
         * @param {string} timezone_
         * @return {string} timezoned date
         */
        return Time.factory(timezone_)
            .format()
    }
});

export default Time;