import React from 'react';
import Card from './Card';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suits: ['C', 'D', 'H', 'S'],
      cardNumber: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      deck: []
    }

    this.createDeck = this.createDeck.bind(this);
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
        {this.state.deck.map((card, key) => <Card card={card} key={key}/>)}
      </div>
    );
  }
}

export default App;