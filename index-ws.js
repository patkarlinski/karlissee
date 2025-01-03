const express = require('express');
const server = require('http').createServer();
const app = express();

//basic road 
app.get('/', function(req, res){
    //wskazujemy index html 
    res.sendFile('index.html', {root: __dirname});

});

server.on('request', app);
server.listen(3000, function() { console.log('server started on port 3000');});

/** Begin websocket */
const WebSocketServer = require('ws').Server;
//server:server we say connect this server to the epxress server
const wss = new WebSocketServer({server: server});

//listner
/* The function is passed the connected web socket connection, not the whole library*/
wss.on('connection', function connection(ws){ 
    const numClients = wss.clients.size;
    console.log('Clients connected', numClients);

    //wyslanuie do wszystkich polaczanoych
    wss.broaadcast(`Current visitor: ${numClients}`);

    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to my server');
    }

    ws.on('close', function close() {
        wss.broaadcast(`Current visitor: ${numClients}`);
        console.log('A client has dissconnected')
    })
});


wss.broaadcast = function broaadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data)
    });
}