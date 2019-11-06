import React from 'react';
import Card from './Card';

//add in num decks and use random shuffle. remove decks from shoe when dealing
//write down different situations - split hands, double down hands etc
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suits: ['C', 'D', 'H', 'S'],
      cardNumber: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      deck: [],
      currPlayer: 'player1',
      dealerCards: [],
      player1Cards: [],
      player1TranslateX: 80,
      player1TranslateY: 0,
    }

    this.createDeck = this.createDeck.bind(this);
    this.completeTurn = this.completeTurn.bind(this);
    this.dealCard = this.dealCard.bind(this);
    this.getRandomCard = this.getRandomCard.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
  }


  //need to make it so theres a setInterval after last player stays for when
  //dealers turn to hit. will keep going until they need to stay or bust.
  //change this to deal from deck instead of making a random card each time
  //TODO: end the shoe when there's only x% left.
  dealCard() {
    let playerType = this.state.currPlayer === 'player1' ? 'player1Cards' : 'dealerCards';
    let playerTranslateX = this.state.currPlayer === 'player1' ? 'player1TranslateX' : 'dealerTranslateX';
    let playerTranslateY = this.state.currPlayer === 'player1' ? 'player1TranslateY' : 'dealerTranslateY';
    let playerCards;
    let translateX = 0;
    let translateY = 0;
    if (this.state.currPlayer === 'player1') {
      playerCards = this.state.player1Cards.slice(0);
      translateX = this.state.player1TranslateX - 90;
      translateY = this.state.player1TranslateY -40;
    } else {
      playerCards = this.state.dealerCards.slice(0);
    }

    let deck = this.state.deck.slice(0);
    playerCards.push(deck.pop());
    this.setState({
      [playerType] : playerCards,
      [playerTranslateX] : translateX,
      [playerTranslateY] : translateY,
      deck
    });
  }

  

  completeTurn() {
    let currPlayer = this.state.currPlayer;
    if(currPlayer === 'player1') {
      currPlayer = 'dealer';
    } else {
      currPlayer = 'player1';
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

  createDeck() {
    let deck = [];
    for(let i = 0; i < this.state.suits.length; i++) {
      for (let j = 0; j < this.state.cardNumber.length; j++) {
        deck.push(this.state.cardNumber[j] + this.state.suits[i]);
      }
    }

    this.shuffleDeck(deck);

    this.setState({
      deck
    });
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
          {this.state.player1Cards.map((card, key) => <Card card={card}
                                                    key={key} 
                                                    index={key} 
                                                    currPlayer={this.state.currPlayer}
                                                    player1TranslateX={this.state.player1TranslateX}
                                                    player1TranslateY={this.state.player1TranslateY}/>)}
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