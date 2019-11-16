import React from 'react';
import Card from './Card';

//TODO: update deck to take in x cards (6 deck 8 deck, double deck)
//display wizard of odds table
//maybe pop up per hand to show ideal thing.
//write down different situations - split hands, double down hands etc
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suits: ['C', 'D', 'H', 'S'],
      cardNumber: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      deck: [],
      currPlayer: [0,0],
      playersCards: [[[]]],
      dealerCards: [],
      playerXTranslations:[[[80]]],
      playerYTranslations:[[[0]]],
    }

    this.createDeck = this.createDeck.bind(this);
    this.completeTurn = this.completeTurn.bind(this);
    this.dealCard = this.dealCard.bind(this);
    this.getRandomCard = this.getRandomCard.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.handleHandPossibilities = this.handleHandPossibilities.bind(this);
  }


  //need to make it so theres a setInterval after last player stays for when
  //dealers turn to hit. will keep going until they need to stay or bust.
  //change this to deal from deck instead of making a random card each time
  //TODO: end the shoe when there's only x% left.
  //possibly chance currPlayer to indexes of 2d array. first index is player, which player hand (if split)
  dealCard() {
    // debugger;
    let playerCards;
    let translateX;
    let translateY;
    if (this.state.currPlayer === -1) { //dealer
      playerCards = this.state.dealerCards.slice(0);
    } else { //player
      playerCards = this.state.playersCards[this.state.currPlayer[0]][this.state.currPlayer[1]].slice(0);
      translateX = this.state.playerXTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]] - 90;
      translateY = this.state.playerYTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]] - 40;
    }

    let deck = this.state.deck.slice(0);
    playerCards.push(deck.pop());



    if(this.state.currPlayer === -1) {
      this.setState({
        dealerCards: playerCards,
        deck
      });
    } else {
      let playersCards = this.state.playersCards.slice(0);
      playersCards[this.state.currPlayer[0]][this.state.currPlayer[1]] = playerCards;

      let playerXTranslations = this.state.playerXTranslations.slice(0);
      let playerYTranslations = this.state.playerYTranslations.slice(0);
      playerXTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]] = translateX;
      playerYTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]] = translateY;
  
      this.setState({
        playersCards,
        playerXTranslations,
        playerYTranslations,
        deck
      });
    }
  }
  // dealCard() {
  //   let playerType = this.state.currPlayer === 'player1' ? 'player1Cards' : 'dealerCards';
  //   let playerTranslateX = this.state.currPlayer === 'player1' ? 'player1TranslateX' : 'dealerTranslateX';
  //   let playerTranslateY = this.state.currPlayer === 'player1' ? 'player1TranslateY' : 'dealerTranslateY';
  //   let playerCards;
  //   let translateX = 0;
  //   let translateY = 0;
  //   if (this.state.currPlayer === -1) { //dealer
  //     playerCards = this.state.dealerCards.slice(0);
  //   } else { //player
  //     playerCards = this.state.player1Cards.slice(0);
  //     translateX = this.state.player1TranslateX - 90;
  //     translateY = this.state.player1TranslateY -40;
  //   }

  //   let deck = this.state.deck.slice(0);
  //   playerCards.push(deck.pop());
  //   this.setState({
  //     [playerType] : playerCards,
  //     [playerTranslateX] : translateX,
  //     [playerTranslateY] : translateY,
  //     deck
  //   });
  // }

  //split hands
  //double down hands (any hand, but can't hit again after double)
  //two aces can only get one card each on split
  //soft hands (ace hands)
  //maybe look at wizard of odds, 
  handleHandPossibilities() {
    // if ()
  }
  

  completeTurn() {

    // currPlayer: [0,0],
    // playersCards: [[]],

    // debugger;
    let currPlayer;
    if(this.state.currPlayer === -1) { //dealer
      currPlayer = [0,0]; //need to change so it ends the round.
    } else {
      currPlayer = this.state.currPlayer.slice(0);
      if(this.state.playersCards[currPlayer[0]][currPlayer[1] + 1]) {
        currPlayer = [currPlayer[0], currPlayer[1] + 1];
      } else if (!this.state.playersCards[currPlayer[0] + 1]) { //switch to dealer
        currPlayer = -1; //dealer
      } else {
        currPlayer = [currPlayer[0] + 1, 0];
      }
    }

    this.setState({
      currPlayer
    }, () => console.log(this.state.currPlayer));
  }

  getRandomCard(min, max) {
    return min +  (Math.floor(Math.random() * Math.floor(max - min)));
  }

  shuffleDeck(deck) {
    let tempStorage = '';
    let randomIndex;
    for(let i = 0; i < deck.length; i++) {
      randomIndex = this.getRandomCard(i, deck.length);
      tempStorage = deck[i];
      deck[i] = deck[randomIndex];
      deck[randomIndex] = tempStorage;
    }
  
    return deck;
  };

  createDeck(numDecks) {
    let deck = [];
    for(let i = 0; i < this.state.suits.length; i++) {
      for (let j = 0; j < this.state.cardNumber.length; j++) {
        let cardNumber;
        if(this.state.cardNumber === 'A') {
          cardNumber = 11
        } else if (this.state.cardNumber === 'J' || this.state.cardNumber === 'Q' || this.state.cardNumber === 'K') {
          cardNumber = 10;
        } else {
          cardNumber = Number(this.state.cardNumber[j]);
        }
        deck.push([this.state.cardNumber[j] + this.state.suits[i], cardNumber]);
      }
    }

    let totalDecks = [];
    for (let i = 0; i < 6; i++) {
      totalDecks = totalDecks.concat(deck);
    }

    deck = totalDecks;

    this.shuffleDeck(deck);

    this.setState({
      deck
    }, () => console.log(deck));
  }

  componentDidMount() {
    this.createDeck();
  }

  render() {
    return (
      <div>
        <div className="Cards DealerCards">
          {this.state.dealerCards.map((card, key) => <Card card={card}
                                                    key={key} 
                                                    index={key} 
                                                    currPlayer={this.state.currPlayer}/>)}
        </div>
        <div className="Cards PlayerCards">
          {this.state.currPlayer === -1 
            ? this.state.playersCards[0][0].map((card, key) => <Card card={card}
                                                    key={key} 
                                                    index={key} 
                                                    currPlayer={this.state.currPlayer}
                                                    playerTranslateX={this.state.playerXTranslations[0][0]}
                                                    playerTranslateY={this.state.playerYTranslations[0][0]}/>) 
            : this.state.playersCards[0][0].map((card, key) => <Card card={card}
                                                    key={key} 
                                                    index={key} 
                                                    currPlayer={this.state.currPlayer}
                                                    playerTranslateX={this.state.playerXTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]]}
                                                    playerTranslateY={this.state.playerYTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]]}/>)
          }
        </div>
        <div>
          <button id="hit" onClick={this.dealCard}>hit</button>
        </div>
        <div>
          <button id="stay" onClick={this.completeTurn}>Stay</button>
        </div>
      </div>
    );
  }
}

export default App;