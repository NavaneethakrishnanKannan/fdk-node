const app = require('./app');
const http = require('http');
const config = require('./config/app-config');
const port = config.ARGV2 || config.PORT;
const server = http.createServer();

server.listen(port, () => {
	console.log(
		`Server running on:> ${server.address().address ? server.address().address : 'localhost'
		}:${server.address().port}`
	);
});

server.on('request', app);