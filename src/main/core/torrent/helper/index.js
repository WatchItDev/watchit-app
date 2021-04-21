const {
    MIN_SIZE_LOADED,
    MIN_PERCENTAGE_LOADED
} = require(`../settings`);

module.exports = {
    selectBiggestFile: (files) => {
        return files.reduce((biggest, file) => {
            return biggest.length > file.length ? biggest : file;
        });
    },
    requiresTranscoding: (file) => {
        return ['.mkv', '.avi', '.wmv', '.flv'].some((ext) =>
            file.name.toLowerCase().endsWith(ext)
        );
    },
    calcChunkPercent: (downloaded, total) => {
        const targetLoadedSize = MIN_SIZE_LOADED > total ? total : MIN_SIZE_LOADED;
        const targetLoadedPercent = MIN_PERCENTAGE_LOADED * total / 100.0;
        const targetLoaded = Math.max(targetLoadedPercent, targetLoadedSize);
        return (downloaded / targetLoaded * 100.0).toFixed(0);
    }
}
