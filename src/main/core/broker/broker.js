const EventEmitter = require("events");
const logplease = require("logplease");
const log = logplease.create("BROKER", { color: logplease.Colors.Yellow });

// Capture unhandled exceptions
process?.on("uncaughtException", (e) => {
  log.warn(e);
  log.warn("Uncaught Exception: keeping process alive");
});

module.exports = class Broker extends EventEmitter {
  constructor(ipc) {
    super();
    // ipc communicate the main and render processes
    this.ipc = ipc;
  }

  getIPC() {
    // Inter process handler
    return this.ipc;
  }

  /**
   * Remove all event listeners.
   * If we don't do this a listener leak happens.
   *
   * @param {*} ipcListeners - The list of events to remove.
   * @returns {Broker}
   */
  stopListeningIPC() {
    this.ipc.removeAllListeners("notification");
  }

  /**
   * Start listening for events from main process.
   */
  startListeningIPC() {
    this.ipc.on("notification", (...args) => {
      this.emit("notification", ...args);
    });
  }

  /**
   * Start fetching content from manifest cid.
   *
   * @param {string} cid - The manifest cid to start fetching content from.
   * @returns {Broker}
   */
  connect(cid) {
    this.ipc.send("node-start", cid);
    return this;
  }
};
