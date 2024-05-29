const Plyr = require("plyr");
const HLS = require("hls.js");
const log = require("logplease").create("HLS");
const CONF = require("./settings");
const DEFAULT_PLAYER_CONTROLS = [
  "play-large", // The large play button in the center
  // "restart", // Restart playback
  "rewind", // Rewind by the seek time (default 10 seconds)
  "play", // Play/pause playback
  "fast-forward", // Fast forward by the seek time (default 10 seconds)
  "progress", // The progress bar and scrubber for playback and buffering
  "current-time", // The current time of playback
  "duration", // The full duration of the media
  "mute", // Toggle mute
  "quality", // Quality control
  "volume", // Volume control
  "captions", // Toggle captions
  "settings", // Settings menu
  "fullscreen", // Toggle fullscreen
];

module.exports = class HLSStreamer {
  constructor() {
    this.mime = "application/x-mpegURL";
    this.hls = null;
    this.player = null;

    // Enlazar métodos al contexto de la instancia
    this.play = this.play.bind(this);
    this.quality = this.quality.bind(this);
    this.emitError = this.emitError.bind(this);
    this.setup = this.setup.bind(this);
    this.updateQuality = this.updateQuality.bind(this);
    this.modifyQualityMenu = this.modifyQualityMenu.bind(this);
    this.modifyQualitySetting = this.modifyQualitySetting.bind(this);
    this.stop = this.stop.bind(this);
  }

  get [Symbol.toStringTag]() {
    return "HLSStreaming";
  }

  static getInstance() {
    return new HLSStreamer();
  }

  /**
   * Start HLS streaming play
   * @param {object} videoRef
   * @param {function} onReady
   */
  play(uri, { videoRef }, onReady, onError) {
    const nativeMime = "application/vnd.apple.mpegURL";
    const nativePlay = videoRef.canPlayType(nativeMime);

    if (HLS.isSupported()) {
      log.warn(`Loading manifest: ${uri}`);
      this.hls = new HLS(CONF);
      this.hls.loadSource(uri); // Add uri to HLS to process
      // When media attached then try to play streaming!!
      this.hls.on(HLS.Events.ERROR, (e, d) => this.emitError(e, d));
      this.hls.on(HLS.Events.MEDIA_ATTACHED, () => log.info("Media attached"));
      this.hls.on(HLS.Events.MANIFEST_PARSED, (e, n) => {
        log.info("m3u8 manifest loaded");
        this.hls.attachMedia(videoRef);
        // Add new qualities to option
        this.setup(videoRef, { ...this.quality(n) }, onReady);
      });
    } else if (nativePlay) {
      const newSource = document.createElement("source");
      newSource.src = uri;
      newSource.type = nativeMime;
      videoRef.append(newSource);
      this.setup(videoRef, {}, onReady);
    }

    return this;
  }

  /**
   * Process qualities to player
   * @param {object} n
   * @return {object}
   */
  quality(n) {
    const q = n.levels.map((l) => l.height).reverse();
    // Add "Auto" option
    q.unshift(-1);

    return {
      quality: {
        forced: true,
        default: q[0],
        options: q,
        onChange: (e) => this.updateQuality(e),
      },
    };
  }

  /**
   * Handle error on HLS streaming
   * @param {object} event
   * @param {object} data
   */
  emitError(event, data, onError) {
    if (data.fatal) {
      log.info(`Fail trying to play movie: ${JSON.stringify(data)}`);
      switch (data.type) {
        case HLS.ErrorTypes.MEDIA_ERROR:
          console.log("Fatal media error encountered, try to recover");
          this.hls.recoverMediaError();
          break;
        case HLS.ErrorTypes.NETWORK_ERROR:
        default:
          // cannot recover
          this.stop();
          onError(data);
          break;
      }
    }
  }

  setup(videoRef, options = {}, onReady) {
    log.info("Setting up player");
    const playerSettings = {
      ...{
        settings: ["captions", "speed", "quality"],
        controls: DEFAULT_PLAYER_CONTROLS,
      },
      ...options,
    };

    // Init player and wait until can play
    this.player = new Plyr(videoRef, playerSettings);
    this.player.on("error", (e) => onError(e));
    this.player.on("canplay", () => {
      setTimeout(this.modifyQualityMenu, 100);
      setTimeout(this.modifyQualitySetting, 100);
      onReady();
    });
  }

  updateQuality(newQuality) {
    if (newQuality === -1) {
      log.info("Auto quality selected");
      this.hls.currentLevel = -1;
    } else {
      this.hls.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          log.info(`Found quality match with ${newQuality}`);
          this.hls.currentLevel = levelIndex;
        }
      });
    }

    setTimeout(this.modifyQualityMenu, 100);
    setTimeout(this.modifyQualitySetting, 100);
  }

  modifyQualityMenu() {
    const qualityMenuButton = document.querySelector('button[data-plyr="quality"][value="-1"]');
    if (qualityMenuButton) {
      const spanElement = qualityMenuButton.querySelector('span');
      if (spanElement) {
        spanElement.textContent = "Auto";
      }
    }
  }

  modifyQualitySetting() {
    const qualitySettingButtons = document.querySelectorAll('button[data-plyr="settings"]');

    qualitySettingButtons.forEach(button => {
      const mainSpan = button.querySelector('span');
      if (mainSpan && mainSpan.textContent.includes("Quality")) {
        const valueSpan = mainSpan.querySelector('span.plyr__menu__value');
        if (valueSpan && valueSpan.textContent.trim() === "-1p") {
          valueSpan.textContent = "Auto";
        }
      }
    });
  }

  stop() {
    console.log('Stopping HLSStreamer...');
    if (this.player) {
      this.player.stop();
      this.player.destroy();
      this.player = null;
    }
    if (this.hls) {
      this.hls.stopLoad();
      this.hls.detachMedia();
      this.hls.destroy();
      this.hls = null;
    }
  }
};
