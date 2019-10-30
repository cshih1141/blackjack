import React from 'react';
import Card from './Card';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suits: ['C', 'D', 'H', 'S'],
      cardNumber: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      deck: [],
      currPlayer: 'player1',
      dealerCards: [],
      player1Cards: []
    }

    this.createDeck = this.createDeck.bind(this);
    this.completeTurn = this.completeTurn.bind(this);
    this.dealCard = this.dealCard.bind(this);
    this.getRandomCard = this.getRandomCard.bind(this)
  }

  getRandomCard(totalCards) {
    return Math.floor(Math.random() * Math.floor(totalCards));
  }

  dealCard() {
    let randomSuit = this.getRandomCard(4);
    let randomNumber = this.getRandomCard(13);

    let randomCard = this.state.cardNumber[randomNumber] + this.state.suits[randomSuit];

    let playerType = this.state.currPlayer === 'player1' ? 'player1Cards' : 'dealerCards';
    let playerCards;

    if (this.state.currPlayer === 'player1') {
      playerCards = this.state.player1Cards.slice(0);
    } else {
      playerCards = this.state.dealerCards.slice(0);
    }

    playerCards.push(randomCard);
    this.setState({
      [playerType] : playerCards
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

  createDeck() {
    let deck = [];
    for(let i = 0; i < this.state.suits.length; i++) {
      for (let j = 0; j < this.state.cardNumber.length; j++) {
        deck.push(this.state.cardNumber[j] + this.state.suits[i]);
      }
    }
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
                                                    currPlayer={this.state.currPlayer}/>)}
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