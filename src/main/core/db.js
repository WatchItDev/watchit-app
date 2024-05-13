const LinvoDB = require("linvodb3");
const levelJs = require("level-js");
const levelDown = require("leveldown");
const engine = process.env.RUNTIME === "web" ? levelJs : levelDown;

LinvoDB.defaults.store = { db: engine };
LinvoDB.defaults.autoIndexing = false;
log.info(`Using ${engine.name}`);

export default class DB {
  constructor() {
    // db is a collection of databases
    this.db = {};
    this.id = null;
  }
  /**
   * Set the context database to exec subsequent operations
   * @param {string} id - The id of the database
   * @returns {DB} The database interface
   */
  connect(id) {
    this.id = id;
    return this;
  }

  /**
   * Initialize the database with the provided name.
   * If the database exist or is initialized, then return the existing.
   *
   * @param {string} id - The database identifier
   * @returns {DB} The database interface
   */
  initStore(id) {
    log.warn(`Creating local db for ${id}`);
    if (id in this.db) return this.db[id];
    this.db[id] = new LinvoDB(id);
    return this;
  }

  /**
   * Add data to underlying db
   * @param {*} collection - The data to store in db
   * @returns {DB} The database interface
   */
  insert(collection) {
    if (!(this.id in this.db)) return;
    this.db[this.id].insert(collection, () => {
      this.emit("ready");
    }); // Save in local
    return this;
  }

  /**
   * Clear all database entries
   * @param {string} id - The database identifier
   * @returns {DB} The database interface
   */
  clear() {
    if (!(this.id in this.db)) return;
    // clear all the content in database
    this.db[id].remove({}, { multi: true }, (err, numRemoved) => {
      if (err) log.error(err);
      log.info("Flushed db entries: ", numRemoved);
      // communicate the event the main thread to handle the it
      this.ipc.send("node-flush");
    });

    return this;
  }

  /**
   * Start a search based on regular expression in db entries
   *
   * @param {string} term - The term used to search for entries.
   * @returns {Promise<object>} A promise that will be resolved with the results.
   */
  search(term) {
    if (!(this.id in this.db)) return;
    return new Promise((resolve) => {
      // Filter by genres

      // Find data in collection
      const re = new RegExp(`${term}`, "gi");
      this.db[this.id].find({ title: { $regex: re } }).exec((e, r) => {
        resolve(r);
      });
    });
  }

  /**
   * Return filtered entries from the database.
   *
   * @param {*} filters - The filter used during filtering process
   * @returns {Promise<object>} A promise that will be resolved with the results.
   */
  filter(filters = {}) {
    if (!(this.id in this.db)) return;
    return new Promise((resolve) => {
      // Filter by genres
      const sortedDescAsc = Object.is(filters.order, "desc") ? -1 : 1;
      // const selectors = {
      //   ...("genres" in filters && { genres: { $in: [filters.genres] } }),
      // };

      // Find data in collection
      this.db[this.id]
        .find(filters.selectors)
        .sort({ [filters.sort_by]: sortedDescAsc })
        .limit(filters.limit)
        .skip(filters.skip)
        .exec((e, r) => {
          resolve(r);
        });
    });
  }

  /**
   * Get content from id.
   * @param {*} id - The content id to retrieve from db.
   * @returns {Promise<object>} A promise that will be resolved with the result.
   */
  get(id) {
    if (!(this.id in this.db)) return;
    return new Promise((resolve) => {
      this.db[this.id].findOne({ _id: id }, (e, r) => {
        resolve(r);
      });
    });
  }
}
