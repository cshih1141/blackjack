import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

function subscribeToGameDetails(cb) {
  socket.on('broadcast', data => cb(null, data));
  socket.emit('disconnect', 1000);
  // socket.on('broadcast', cb(data));
}
export { subscribeToGameDetails };

