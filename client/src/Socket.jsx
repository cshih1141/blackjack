import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

function joinGame(cb) {
  socket.on('broadcast', data => {
    data.player = socket.id;
    return cb(null, data);
  });
  socket.emit('disconnect', 1000);
  // socket.on('broadcast', cb(data));
}

function subscribeToGameDetails(cb) {
  socket.on('broadcastGameStatus', data => cb(null, data));
  // socket.emit('disconnect', 1000);
  // socket.on('broadcast', cb(data));
}

function updateGameStatus(gameUpdates, alreadyCalled = false) {
  if(!alreadyCalled) {
    socket.emit('gameUpdates', { gameUpdates })
  }
}

export { subscribeToGameDetails, updateGameStatus, joinGame };

