const fadeWindowOut = (
    _window,
    step = 0.1,
    fadeEveryXSeconds = 10,
    cb = () => {
    }
) => {
    let opacity = _window ? _window.getOpacity() : 1;
    let interval = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(interval);
            cb();
        }
        !_window.isDestroyed() &&
        _window.setOpacity(opacity);
        opacity -= step;
    }, fadeEveryXSeconds);
    return interval;
}

const fadeWindowIn = (
    _window,
    step = 0.1,
    fadeEveryXSeconds = 10,
    cb = () => {
    }
) => {
    let opacity = _window ? _window.getOpacity() : 1;
    let interval = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(interval);
            cb();
        }
        !_window.isDestroyed() &&
        _window.setOpacity(opacity);
        opacity += step;
    }, fadeEveryXSeconds);
    return interval;
}

module.exports.fadeWindowIn = fadeWindowIn
module.exports.fadeWindowOut = fadeWindowOut