//Torrent conf
module.exports = {
    // Minimum bytes loaded to open video
    MAX_CACHE_REQUEST_TIMEOUT: 3600000 * 24, // Milliseconds 24h
    MAX_NUM_CONNECTIONS: 100, //Max num of peers 100
    MIN_PERCENTAGE_LOADED: 0.5, //Min % of loaded size
    MIN_SIZE_LOADED: 10 * 1024 * 1024, //Min size loaded
    MAGNET_RESOLVE_TIMEOUT: 60 * 1000, //Engine destroy timeout resolving magnet,
    TORRENT_FILE_READ_TIMEOUT: 20 * 1000,
    TORRENT_TRACKERS: [
        'udp://opentracker.i2p.rocks:6969/announce',
        'http://opentracker.i2p.rocks:6969/announce',
        'udp://tracker.opentrackr.org:1337/announce',
        'http://tracker.opentrackr.org:1337/announce',
        'udp://tracker.internetwarriors.net:1337/announce',
        'http://tracker.internetwarriors.net:1337/announce',
        'udp://3rt.tace.ru:60889/announce',
        'http://5rt.tace.ru:60889/announce',
        'udp://9.rarbg.to:2710/announce',
        'udp://p4p.arenabg.ch:1337/announce',
        'http://p4p.arenabg.com:1337/announce',
        'udp://tracker.cyberia.is:6969/announce',
        'udp://www.torrent.eu.org:451/announce',
        'http://tracker2.wasabii.com.tw:6969/announce',
        'udp://tracker.sktorrent.net:6969/announce',
        'http://www.wareztorrent.com:80/announce',
        'udp://tracker.eddie4.nl:6969/announce',
        'https://open.kickasstracker.com:443/announce',
        'udp://tracker.kicks-ass.net:80/announce'
    ]
};
