import EventEmitter from 'events'

/**
 * This class is used to fallback to the default Electron IPC.
 * In this case, the IPC is an adapter for browser.
 * It extends the EventEmitter class from 'events' module.
 */
class WebIPC extends EventEmitter {
  /**
   * Sends an IPC message to the main process.
   *
   * @param {string} event - The name of the event.
   * @param {...*} rest - Additional arguments to be sent with the event.
   * @returns {void}
   */
  send (event, ...rest) {
    this.emit(event, this, ...rest)
  }

  /**
   * Replies to an IPC message from the main process.
   * This method is a shortcut for sending a message.
   *
   * @param {string} event - The name of the event.
   * @param {...*} rest - Additional arguments to be sent with the event.
   * @returns {void}
   */
  reply (event, ...rest) {
    this.send(event, ...rest)
  }
}

/**
 * An instance of the WebIPC class.
 * It is used to send and receive IPC messages.
 *
 * @type {WebIPC}
 */
const webIPC = new WebIPC()

/**
 * Exports the default instance of the WebIPC class.
 *
 * @export
 * @type {WebIPC}
 */
export default webIPC
