//Torrent conf
module.exports = {
    // Minimum bytes loaded to open video
    STREAM_PORT: 7001,
    MAX_CACHE_REQUEST_TIMEOUT: 3600000 * 24, // Milliseconds 24h
    MAX_NUM_CONNECTIONS: 100, //Max num of peers 100
    MIN_PERCENTAGE_LOADED: 0.5, //Min % of loaded size
    MIN_SIZE_LOADED: 10 * 1024 * 1024, //Min size loaded
    MAGNET_RESOLVE_TIMEOUT: 60 * 1000, //Engine destroy timeout resolving magnet,
    TORRENT_FILE_READ_TIMEOUT: 20 * 1000,
    STUN_TURN: [
        {urls: 'stun:stun01.sipphone.com'},
        {urls: 'stun:stun.ekiga.net'},
        {urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com'}
    ],
    TORRENT_TRACKERS: [
        'http://opentracker.i2p.rocks:6969/announce',
        'http://tracker.flashtorrents.org:6969/announce',
        'https://104.28.17.69/announce',
        'http://tracker.grepler.com:6969/announce',
        'http://tracker.opentrackr.org:1337/announce',
        'http://tracker.internetwarriors.net:1337/announce',
        'http://5rt.tace.ru:60889/announce',
        'http://p4p.arenabg.com:1337/announce',
        'http://tracker2.wasabii.com.tw:6969/announce',
        'http://www.wareztorrent.com:80/announce',
        'https://open.kickasstracker.com:443/announce',
        'http://tracker.kicks-ass.net/announce',
        'http://tracker.filetracker.pl:8089/announce',
        'udp://tracker.kicks-ass.net:80/announce',
        'udp://opentracker.i2p.rocks:6969/announce',
        'udp://tracker.opentrackr.org:1337/announce',
        'udp://tracker.internetwarriors.net:1337/announce',
        'udp://3rt.tace.ru:60889/announce',
        'udp://9.rarbg.to:2710/announce',
        'udp://p4p.arenabg.ch:1337/announce',
        'udp://tracker.cyberia.is:6969/announce',
        'udp://tracker.leechers-paradise.org:6969/announce',
        'udp://www.torrent.eu.org:451/announce',
        'udp://tracker.sktorrent.net:6969/announce',
        'udp://tracker.eddie4.nl:6969/announce',
        'udp://open.demonii.com:1337/announce',
        'udp://tracker.openbittorrent.com:80',
        'udp://tracker.coppersurfer.tk:6969',
        'udp://glotorrents.pw:6969/announce',
        'udp://torrent.gresille.org:80/announce',
        'udp://p4p.arenabg.com:1337'
    ]
};
