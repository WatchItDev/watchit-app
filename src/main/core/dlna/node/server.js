const {ROOT_TMP_FOLDER} = require('../../settings');
const log = require('electron-log')
const http = require('http');
const fs = require('fs');
const PORT = 9990;

module.exports = (localIp) => {
	log.info('Starting server');
	const server = http.createServer((request, response) => {
		let fileSub = request.url.split('/').slice(-1)[0];
		let readStream = fs.createReadStream(`${ROOT_TMP_FOLDER}/${fileSub}`);
		// Write headers
		response.writeHead(200, {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'text/srt;charset=utf8'
		})
		// Stream file via pipe
		readStream.pipe(response)
	}).listen(PORT, localIp);
	
	// Check if in use and try to listen again
	server.on('error', (e) => {
		if (e.code === 'EADDRINUSE') {
			log.error('Address in use, retrying...');
			setTimeout(() => {
				server.close();
				server.listen(PORT, localIp);
			}, 1000);
		}
	})
	
	server.on('close', () =>
		log.warn('Server closed')
	)
	
	return server
}

	
