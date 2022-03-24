/**
 * Created by gmena on 04-19-17.
 */
// Tools
import Manager from './manager'

export default class Movies extends Manager {
  
  /**
     * Search for movies
  */
  search (textToSearch) {
    return new Promise((resolve) => {
      // Filter by genres

      // Find data in collection
      const re = new RegExp(`${textToSearch}`, 'gi')
      this.db.find({ title: { $regex: re } }).exec((e, r) => {
        resolve(r)
      })
    })
  }

  /**
     * Return filtered movies
     * @param filter
     * @param token
  */
  filter (filters = {}) {
    return new Promise((resolve) => {
      // Filter by genres
      const selectors = { ...('genres' in filters) && { genres: { $in: [filters.genres] } } }
      const sortedDescAsc = Object.is(filters.order, 'desc') ? -1 : 1

      // Find data in collection
      this.db.find(selectors)
        .sort({ [filters.sort_by]: sortedDescAsc })
        .limit(filters.limit)
        .skip(filters.skip)
        .exec((e, r) => {
          resolve(r)
        })
    })
  }

  /**
     * Return movie by id
     * @param id
  */
  get (id) {
    return new Promise((resolve) => {
      this.db.findOne({ _id: id }, (e, r) => {
        resolve(r)
      })
    })
  }
}
