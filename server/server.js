const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);



app.use(express.static(path.join(__dirname, '../public')));


const getRandomCard = function(min, max) {
  return min +  (Math.floor(Math.random() * Math.floor(max - min)));
}

const shuffleDeck = function(deck) {
  let tempStorage = '';
  let randomIndex;
  for(let i = 0; i < deck.length; i++) {
    randomIndex = getRandomCard(i, deck.length);
    tempStorage = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = tempStorage;
  }

  return deck;
};

const createDeck = function(numDecks) {
  let suits = ['C', 'D', 'H', 'S'];
  let cardNumberArray = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck = [];
  for(let i = 0; i < suits.length; i++) {
    for (let j = 0; j < cardNumberArray.length; j++) {
      let cardNumber;
      if(cardNumberArray[j] === 'A') {
        cardNumber = 11
      } else if (cardNumberArray[j] === 'J' || cardNumberArray[j] === 'Q' || cardNumberArray[j] === 'K') {
        cardNumber = 10;
      } else {
        cardNumber = Number(cardNumberArray[j]);
      }
      deck.push([cardNumberArray[j] + suits[i], cardNumber]);
    }
  }

  let totalDecks = [];
  for (let i = 0; i < 6; i++) {
    totalDecks = totalDecks.concat(deck);
  }

  deck = totalDecks;

  shuffleDeck(deck);

  return deck;
}

let clientNum = 0;
let deck = createDeck();
io.on('connection', (client) => {
  clientNum++;
  console.log('this is clientNum ' + clientNum);
  // socket.broadcast.to()
  io.sockets.emit('broadcast',{ player: clientNum, deck});
  client.on('disconnect', function () {
    console.log('client has left ' + clientNum);
    clientNum--;
     io.sockets.emit('broadcast',{ description: clientNum});
  });

  client.on('gameUpdates', (data) => {
    client.broadcast.emit('broadcastGameStatus', data );
    console.log(data);
 });
});




http.listen(3000);