/**
 * Created by gmena on 12-02-15.
 */

//Request
var os = os = require('os'),
    path = require('path'),
    http = require('http'),
    request = require('request'),
    setting = require(path.resolve() + '/js/backend/settings');

////Caching requests
//request = require('cached-request')(request);
//request.setCacheDirectory(path.join(os.tmpDir(), 'watchIT'));

//Export YTS
module.exports = {
    'retryInterval': null,
    'retryCount': 0,
    'prepareEpisodes': function (episodes, curr) {

        //Prepare episodes for template
        var _episodes = {};
        episodes = episodes || [];
        episodes.forEach(function (v, i) {
            if (!(v.season in _episodes)) {
                _episodes[v.season] = {
                    id: v.season,
                    episodes: []
                };
            }

            //Handle response keys
            v.torrents = Object.keys(v.torrents).map(function (key, i) {
                v.torrents[key].label = key;
                v.torrents[key].avoid = key == '0';
                v.torrents[key].default = key != '0' && i == 1;
                return v.torrents[key];
            });

            //Ordering
            v.torrents = v.torrents.sort(function (a, b) {
                return parseInt(a.label) - parseInt(b.label)
            });

            //Imdb for episode
            v.season_imdb_code = curr.imdb_id;
            v.season_slug = curr.slug;

            //Group episodes by season
            _episodes[v.season]['episodes'].push(v)
        });

        //Episodes
        return _episodes;

    },
    'cleanMovies': function (tv) {

        //Clear interval if exist
        if (this.retryInterval) {
            this.retryCount = 0;
            clearTimeout(this.retryInterval);
        }

        //Map movies
        return tv.map(function (curr, index, arr) {
            //Normalize percentage
            curr.rating.percentage = curr.rating.percentage / 10;
            curr.episodes = this.prepareEpisodes(
                curr.episodes, curr
            );

            //Generate
            return {
                id: curr._id,
                title: curr.title,
                imdb_code: curr.imdb_id,
                rating: curr.rating,
                year: curr.year,
                runtime: curr.runtime,
                genres: curr.genres,
                description_full: curr.synopsis,
                torrents: curr.torrents,
                images: curr.images,
                air_date: curr.air_day + ' ' + curr.air_time,
                network: curr.network,
                country: curr.country,
                season: curr.episodes
            };
        }.bind(this))

    },

    '__retry': function (callback, err) {
        //Count intervals
        ++this.retryCount;
        //Clean interval
        if (this.retryInterval) {
            clearTimeout(this.retryInterval);
            //If overhead retry
            if (this.retryCount > setting.tvAPI.max_retry) {
                this.retryCount = 0;
                return err();
            }
        }

        console.log('Retrying...' + this.retryCount);
        //Create interval
        this.retryInterval = setTimeout(
            callback, setting.tvAPI.max_retry_interval
        );
    },

    '__request': function (req, success, error) {
        //var agent = new http.Agent();
        //agent.maxSockets = 1000000;
        //http.request({agent:agent});

        //Cache timeout
        req['gzip'] = true;
        req['jar'] = true;
        req['json'] = true;
        req['forever'] = true;
        req['pool'] = {
            maxSockets: 10000
        };
        //req['followRedirect'] = true;
        //req['maxRedirect'] = 10;
        //Request
        request(req, function (err, res, data) {
            if (!err && res.statusCode == 200) {
                //Needed incoming data
                if (!data) {
                    //Retry get movies
                    this.__retry(function () {
                        this.__request(req, success, error);
                    }.bind(this), error);
                    return;
                }

                //Resolve, movies clean
                success(data);
            } else {
                //Retry get movies
                this.__retry(function () {
                    this.__request(req, success, error);
                }.bind(this), error);
            }
        }.bind(this))
    },

    /** Return list of movies filtered
     *
     * @param {Object} page
     * @returns {Object}
     */
    'getTV': function (page) {
        //Api YTS URL
        var req = {
            uri: setting.tvAPI.listTv + page,
            timeout: setting.tvAPI.timeout
        };

        return new Promise(function (resolve, error) {
            //Handle request
            this.__request(req, function (data) {
                resolve(this.cleanMovies(data));
            }.bind(this), error);

        }.bind(this));

    },

    'getTVbyID': function (id) {
        var req = {
            uri: setting.tvAPI.listTvDetails + id,
            timeout: setting.tvAPI.timeout
        };

        var _prev = (new Date()).getTime();
        return new Promise(function (resolve, error) {
            //Handle request
            this.__request(req, function (data) {
                console.log('request complete after: ' + (((new Date()).getTime() - _prev) / 60) + ' segundos');
                resolve(this.cleanMovies([data]).pop());
            }.bind(this), error);
        }.bind(this));

    }
};
