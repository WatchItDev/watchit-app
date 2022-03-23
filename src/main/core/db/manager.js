 /**
         * Set db attr
         * @param {Broker} Broker class object
         */
export default class Manager {
  constructor (broker) {
    this.db = broker.db
  }
}
