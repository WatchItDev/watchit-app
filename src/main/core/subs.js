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
const { ROOT_TMP_FOLDER } = require(`${__dirname}/settings`)

module.exports = class Sub {
  static urlSrt2VttFile (url) {
    /**
		 * Convert from url srt to vtt sub
		 * @param {String} url
		 * @return {Object}
		 */
    const _filename = url.split('/').pop()
    let _srt_file_dir = path.join(ROOT_TMP_FOLDER, _filename)
    // Append format
    if (!(~(_filename.indexOf('.zip')))) {
      _srt_file_dir += '.zip'
    }

    // The new dir
    return new Promise(async (s) => {
      await Sub.__request2File(url, _srt_file_dir)
      const unzippedSrt = await Sub.unzipSub(_srt_file_dir)
      const vtt = await Sub.srt2vtt(unzippedSrt)
      s({ vtt: `file://${vtt}`, raw: vtt.replace(ROOT_TMP_FOLDER, '') })
    })
  }

  static unzipSub (file_dir) {
    /**
		 * Unzip sub file
		 * @param {String} file_dir
		 * @param {String} desination
		 */
    return new Promise((r, err) => {
      const fileStream = fs.createReadStream(file_dir)
      fileStream.pipe(unzip.Parse()).on('entry', (entry) => {
        // Replace bad chars
        const _replaceReg = /(\[|\]|\-|\.|\+|\s|'|")/g
        const _cleanInvalid = /[^\u0000-\u007E]/g
        const _file = entry.path.replace(_replaceReg, '_').replace(_cleanInvalid, '_')
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
          const _result_file_dir = _fileDir
            .replace('_srt', '.srt')
          // Write file
          const _file = fs.createWriteStream(
            _result_file_dir, { defaultEncoding: 'ISO-8859-1' }
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
            r(_result_file_dir)
          }).on('error', (e) => {
            err(e)
          })
        } else {
          // Just keep going ;)
          entry.autodrain()
        }
      })
    })
  }

  static __request2File (url, _srt_dir) {
    return new Promise((resolve) => {
      // Read the file
      const _file = fs.createWriteStream(_srt_dir)
      // Read and write file
      request.get(url.replace('http', 'https'), (res) => {
        res.pipe(_file)
        _file.on('finish', () => {
          _file.close(resolve) // close() is async, call cb after close completes.
        })
      })
    })
  }

  static srt2vtt (srt_file_dir) {
    /**
		 * Parsing srt to vtt sub
		 * @param {String} file_dir
		 * @param {String} desination
		 */
    return new Promise(function (r, e) {
      // The new vtt file
      const _new_vtt_file_dir = srt_file_dir
        .replace('.srt', '.vtt')
      // Convert to
      const dataBuff = fs.readFileSync(srt_file_dir)
      const targetEncodingCharset = 'ISO-8859-1'

      // Check for encoding
      const charset = charsetDetect.detect(dataBuff)
      const detectedEncoding = charset.encoding

      // The srt to latin1 if not windows-* encoding
      const _srt_buffer = !detectedEncoding.startsWith('win') && iconv.encode(
        iconv.decode(dataBuff, detectedEncoding),
        targetEncodingCharset
      ) || dataBuff

      // Converting SRT to VTT
      srt2vtt(_srt_buffer, (err, vttData) => {
        if (err) e(err)
        fs.writeFileSync(_new_vtt_file_dir, vttData)
        r(_new_vtt_file_dir)
      })
    })
  }

  static reSync (file, offset) {
    return new Promise((res, err) => {
      const _fileDir = path.join(ROOT_TMP_FOLDER, file)
      fs.readFile(_fileDir, (e, data) => {
        if (e) return err('Error in sync subs')
        const _subParsed = subtitle.parse(data.toString())
        const _timedSub = subtitle.resync(_subParsed, offset)
        fs.writeFile(_fileDir, subtitle.stringify(_timedSub), res)
      })
    })
  }
}
