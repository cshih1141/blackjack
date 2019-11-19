const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);



app.use(express.static(path.join(__dirname, '../public')));


let clientNum = 0;
io.on('connection', (client) => {
  clientNum++;
  // socket.broadcast.to()
  io.sockets.emit('broadcast',{ player: clientNum});
  client.on('disconnect', function () {
    clientNum--;
    //  io.sockets.emit('broadcast',{ description: clientNum});
  });
});

http.listen(3000);