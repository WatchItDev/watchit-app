export default class Manager {
  constructor (broker) {
    /**
         * Set db attr
         * @param {Broker} Broker class object
         */
    this.db = broker.db
  }
}
