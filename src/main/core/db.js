const logplease = require("logplease");
const log = logplease.create("DB", { color: logplease.Colors.Yellow });

const LinvoDB = require("linvodb3");
const engine = require(process.env.RUNTIME === "web"
  ? "level-js"
  : "leveldown");

LinvoDB.defaults.store = { db: engine };
LinvoDB.defaults.autoIndexing = false;
log.info(`Using ${engine.name}`);

class DB {
  constructor() {
    // db is a collection of databases
    this.db = {};
    this.id = null;
  }

  /**
   * Set the context database to exec subsequent operations and initialize the database with the provided name.
   * If the database exist or is initialized, then return the existing.
   *
   * @param {string} id - The database identifier
   * @returns {DB} The database interface
   */
  connect(id) {
    if (!(id in this.db)) {
      log.warn(`Creating local db for ${id}`);
      this.db[id] = new LinvoDB(id);
    }

    this.id = id
    return this;
  }

  _promiseFactory(toResolve) {
    return new Promise((resolve, reject) => {
      if (!(this.id in this.db))
        return reject();
      toResolve(resolve)
    });
  }

  /**
   * Check if a database exists.
   *
   * @param {string} id - The database identifier
   * @returns {boolean} True if the database exists, false otherwise
   */
  exists(id) {
    return id in this.db;
  }

  /**
   * Delete a database.
   * 
   * @returns {Promise<boolean>} A promise that resolves to true if the database was deleted, false otherwise
   */
  delete() {
    return this._promiseFactory((resolve) => {
      this.db[this.id].remove({}, { multi: true }, (err) => {
        delete this.db[this.id];
        resolve(true);
      });
    });
  }

  /**
   * Add data to underlying db.
   *
   * @async
   * @param {*} collection - The data to store in db.
   * @returns {Promise<{status: string, db: object}>} A promise that resolves with an object containing the status and the database interface.
   */
  insert(collection) {
    return this._promiseFactory((resolve) => {
      this.db[this.id].insert(collection, () => {
        resolve(collection);
      }); // Save in local
    });
  }


  /**
   * Start a search based on regular expression in db entries
   *
   * @param {string} term - The term used to search for entries.
   * @returns {Promise<object>} A promise that will be resolved with the results.
   */
  search(term) {
    return this._promiseFactory((resolve) => {
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
    return this._promiseFactory((resolve) => {
      // Filter by genres
      const sortedDescAsc = Object.is(filters.order, "desc") ? -1 : 1;
      const selectors = {
        ...("genres" in filters && { 'meta.genres': { $in: [filters.genres] } }),
      };

      // Find data in collection
      this.db[this.id]
        .find(selectors)
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
    return this._promiseFactory((resolve) => {
      this.db[(this.id)].findOne({ _id: id }, (e, r) => {
        resolve(r);
      });
    });
  }

  /**
   * Get all data from the database.
   *
   * @returns {Promise<object[]>} A promise that resolves with all the movies.
   */
  all() {
    return this._promiseFactory((resolve) => {
      this.db[(this.id)].find({}, (err, docs) => {
        resolve(docs);
      });
    });
  }

  /**
   * Count data from the database.
   * @param {*} filters - The filter used to count.
   * @returns {Promise<object[]>} A promise that resolves with the count number.
   */
  count(filters) {
    return this._promiseFactory((resolve) => {
      this.db[(this.id)].count(filters, (err, count) => {
        resolve(count);
      });
    });
  }
}

// Construct broker with renderer
module.exports = function DBFactory() {
  return new DB();
};
