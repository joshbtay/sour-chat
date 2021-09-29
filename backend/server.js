import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8000});
wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(data, isBinary) {
		wss.clients.forEach(function each(client) {
			if(client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(data, { binary: isBinary });
			}
		});
		console.log(data);
	});
});

