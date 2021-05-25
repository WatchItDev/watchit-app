/**
 * Created by gmena on 05-03-17.
 */
// eslint-disable-next-line
/* global Buffer */
export default ({
  toBase64: (data) => {
    return Buffer.from(data).toString('base64')
  },
  fromBase64: (data) => {
    return Buffer.from(data, 'base64').toString('utf-8')
  }
})
