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
    let randomCard = this.getRandomCard(52);

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
        <div className="Cards">
          {this.state.deck.map((card, key) => <Card card={card}
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