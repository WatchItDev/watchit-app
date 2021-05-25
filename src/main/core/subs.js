/**
 * Created by gmena on 12-12-15.
 */
const fs = require('fs')
const path = require('path')
const srt2vtt = require('srt2vtt')
const iconv = require('iconv-lite')
const request = require('https')
const charsetDetect = require('jschardet')
const unzip = require('unzipper')
const subtitle = require('subtitle')
const { ROOT_TMP_FOLDER } = require('./settings')

module.exports = class Sub {
  static urlSrt2VttFile (url) {
    /**
     * Convert from url srt to vtt sub
     * @param {String} url
     * @return {Object}
     */
    const _filename = url.split('/').pop()
    let strFileDir = path.join(ROOT_TMP_FOLDER, _filename)
    // Append format
    if (!(~(_filename.indexOf('.zip')))) {
      strFileDir += '.zip'
    }

    // The new dir
    return new Promise(async (resolve) => {
      await Sub.__request2File(url, strFileDir)
      const unzippedSrt = await Sub.unzipSub(strFileDir)
      const vtt = await Sub.srt2vtt(unzippedSrt)
      resolve({ vtt: `file://${vtt}`, raw: vtt.replace(ROOT_TMP_FOLDER, '') })
    })
  }

  static unzipSub (fileDir) {
    /**
     * Unzip sub file
     * @param {String} fileDir
     * @param {String} desination
     */
    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(fileDir)
      fileStream.pipe(unzip.Parse()).on('entry', (entry) => {
        // Replace bad chars
        const _replaceReg = /(\[|\]|-|\.|\+|\s|'|")/g
        const _file = entry.path.replace(_replaceReg, '_')
        const _fileDir = path.join(ROOT_TMP_FOLDER, _file)

        // Make dir if needed
        if (entry.type === 'Directory') {
          // Make dir if doesn't exists
          if (!fs.existsSync(_fileDir)) {
            fs.mkdirSync(_fileDir)
          }
        }

        // If srt file
        if ((~(entry.path.indexOf('.srt')))) {
          // The result directory for srt
          const _resultFileDir = _fileDir
            .replace('_srt', '.srt')
          // Write file
          const _file = fs.createWriteStream(
            _resultFileDir, { defaultEncoding: 'ISO-8859-1' }
          )

          _file.on('open', () => {
            // Write
            entry.pipe(
              _file
            )
          }).on('finish', () => {
            // Finish to write

            _file.close() // close() is async, call cb after close completes.
            // Written
            resolve(_resultFileDir)
          }).on('error', (e) => {
            reject(e)
          })
        } else {
          // Just keep going ;)
          entry.autodrain()
        }
      })
    })
  }

  static __request2File (url, strDir) {
    return new Promise((resolve) => {
      // Read the file
      const _file = fs.createWriteStream(strDir)
      // Read and write file
      request.get(url.replace('http', 'https'), (res) => {
        res.pipe(_file)
        _file.on('finish', () => {
          _file.close(resolve) // close() is async, call cb after close completes.
        })
      })
    })
  }

  static srt2vtt (strFileDir) {
    /**
     * Parsing srt to vtt sub
     * @param {String} file_dir
     * @param {String} desination
     */
    return new Promise(function (resolve, reject) {
      // The new vtt file
      const newVttFileDir = strFileDir
        .replace('.srt', '.vtt')
      // Convert to
      const dataBuff = fs.readFileSync(strFileDir)
      const targetEncodingCharset = 'ISO-8859-1'

      // Check for encoding
      const charset = charsetDetect.detect(dataBuff)
      const detectedEncoding = charset.encoding

      // The srt to latin1 if not windows-* encoding
      const strBuffer = !detectedEncoding.startsWith('win')
        ? iconv.encode(iconv.decode(dataBuff, detectedEncoding), targetEncodingCharset)
        : dataBuff

      // Converting SRT to VTT
      srt2vtt(strBuffer, (err, vttData) => {
        if (err) reject(err)
        fs.writeFileSync(newVttFileDir, vttData)
        resolve(newVttFileDir)
      })
    })
  }

  static reSync (file, offset) {
    return new Promise((resolve, reject) => {
      const _fileDir = path.join(ROOT_TMP_FOLDER, file)
      fs.readFile(_fileDir, (e, data) => {
        if (e) return reject(new Error('Error in sync subs'))
        const _subParsed = subtitle.parse(data.toString())
        const _timedSub = subtitle.resync(_subParsed, offset)
        fs.writeFile(_fileDir, subtitle.stringify(_timedSub), resolve)
      })
    })
  }
}
