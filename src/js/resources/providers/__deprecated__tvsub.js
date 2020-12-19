/**
 * Created by gmena on 12-02-15.
 */

//Request
var tvsubs = require('tv-subs');

//Export YTS
module.exports = {
    'getSubTV': function (slug, season, episode) {
        return tvsubs.search(
            "/" + slug + '/season-' + season + '/episode-' + episode + '/'
        )
    }
};
