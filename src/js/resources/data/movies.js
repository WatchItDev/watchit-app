/**
 * Created by gmena on 04-19-17.
 */
//Tools
import Manager from './manager'

export default class Movies extends Manager {

    search(textToSearch) {
        /***
         * Search for movies
         */
        return new Promise((res) => {
            // Filter by genres

            // Find data in collection
            const re = new RegExp(`${textToSearch}`, 'gi')
            console.log(re)
            this.db.find({title: {$regex: re}}).exec((e, r) => {
                res(r)
            })
        })
    }

    filter(filters = {}) {
        /**
         * Return filtered movies
         * @param filter
         * @param token
         */

        return new Promise((res) => {

            // Filter by genres
            let selectors = {...('genres' in filters) && {genres: {$in: [filters.genres]}}};
            let sorted_desc = Object.is(filters.order, 'desc') ? -1 : 1

            // Find data in collection
            this.db.find(selectors)
                .limit(filters.limit)
                .skip(filters.skip)
                .sort({[filters.sort_by]: sorted_desc})
                .exec((e, r) => {
                    res(r)
                })
        })

    }

    get(id) {
        /**
         * Return movie by id
         * @param id
         */
        return new Promise((res) => {
            this.db.findOne({_id: id}, (e, r) => {
                res(r)
            })
        })
    }

}