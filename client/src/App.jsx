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
      playersCards: [ [[]] ],
      dealerCards: [],
      playerXTranslations:[ [[-10]] ],
      playerYTranslations:[ [[-40]] ],
      splitButtonStatus: 'hidden', //visible
      splitIsDisabled: true, //false
    }

    this.createDeck = this.createDeck.bind(this);
    this.completeTurn = this.completeTurn.bind(this);
    this.dealCard = this.dealCard.bind(this);
    this.getRandomCard = this.getRandomCard.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
    this.handleHandPossibilities = this.handleHandPossibilities.bind(this);
    this.doubleDown = this.doubleDown.bind(this);
    this.splitHand = this.splitHand.bind(this);
    this.handleSoftHand = this.handleSoftHand.bind(this);
    this.resetTable = this.resetTable.bind(this);
    this.disableSplit = this.disableSplit.bind(this);
    this.calculateHandTotal = this.calculateHandTotal.bind(this);
  }


  //need to make it so theres a setInterval after last player stays for when
  //dealers turn to hit. will keep going until they need to stay or bust.
  //change this to deal from deck instead of making a random card each time
  //TODO: end the shoe when there's only x% left.
  //possibly chance currPlayer to indexes of 2d array. first index is player, which player hand (if split)
  dealCard(isDoubleDown = false) {
    let playerCards;
    let translateX;
    let translateY;
    if (this.state.currPlayer === -1) { //dealer
      playerCards = this.state.dealerCards.slice(0);
    } else { //player
      playerCards = this.state.playersCards[this.state.currPlayer[0]][this.state.currPlayer[1]].slice(0);
      let translateXlength = this.state.playerXTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]].length;
      let translateYlength = this.state.playerYTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]].length;
      translateX = this.state.playerXTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]][translateXlength - 1] - 90;
      translateY = this.state.playerYTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]][translateYlength - 1] - 40;
    }

    let deck = this.state.deck.slice(0);
    playerCards.push(deck.pop());

    if(this.state.currPlayer === -1) {
      this.setState({
        dealerCards: playerCards,
        deck
      }, () => this.calculateHandTotal(this.state.dealerCards, false));
    } else {
      let playersCards = this.state.playersCards.slice(0);
      playersCards[this.state.currPlayer[0]][this.state.currPlayer[1]] = playerCards;

      let playerXTranslations = this.state.playerXTranslations.slice(0);
      let playerYTranslations = this.state.playerYTranslations.slice(0);
      playerXTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]].push(translateX);
      playerYTranslations[this.state.currPlayer[0]][this.state.currPlayer[1]].push(translateY);
      if(playerXTranslations[this.state.currPlayer[0]][this.state.currPlayer[1] + 1]) {
        for(let i = this.state.currPlayer[1] + 1; i < playerXTranslations[this.state.currPlayer[0]].length; i++) {
          playerXTranslations[this.state.currPlayer[0]][i][0] -= 90;
        }
      }
  
      this.setState({
        playersCards,
        playerXTranslations,
        playerYTranslations,
        deck
      }, () => this.handleHandPossibilities(isDoubleDown));
    }
  }

  resetTable() {
    this.setState({
      currPlayer : [0, 0],
      playersCards: [ [[]] ],
      dealerCards: [],
      playerXTranslations:[ [[-10]] ],
      playerYTranslations:[ [[-40]] ],
    });
  }


  calculateHandTotal(currHand, isDoubleDown) {
    //if total is 21 and currHand count is 2, pay out blackjack
    if(currHand.length === 2 && currHand[0][1] + currHand[1][1] === 21) {
      console.log('BLACKJACK');
      //pay out 3 to 2
    } else {
      let currHandTotals = [0];
      let isFirstAce = true;
      for (let i = 0; i < currHand.length; i++) {
        if(currHand[i][1] === 11) {
          if(isFirstAce) {
            currHandTotals.push(currHandTotals[0] + 1);
            currHandTotals[0] += 11;
            isFirstAce = false;
          } else {
            currHandTotals[0]++;
            currHandTotals[1]++;
          }
        } else {
          for (let j = 0; j < currHandTotals.length; j++) {
            currHandTotals[j] += currHand[i][1];
          }
        }
      }
      if(currHandTotals.length > 1) {
        if (currHandTotals[0] > 21 && currHandTotals[1] > 21) {
          console.log('YOU BUSTED');
          //deduct money then
          this.completeTurn();
        } else if (currHandTotals[0] === 21 || currHandTotals[1] === 21) {
          console.log('YOU GOT 21');
          this.completeTurn();
        }
      } else {
        if (currHandTotals[0] > 21) {
          console.log('YOU BUSTED');
          //deduct money then
          this.completeTurn();
        } else if (currHandTotals[0] === 21) {
          console.log('YOU GOT 21');
          this.completeTurn();
        }
      }
      console.log(currHandTotals);
      if(isDoubleDown) {
        this.completeTurn();
      }
    }

    //if hand has an ace, have both totals with ace being 11 or 1

    //else jsut add all numbers up.
    //if over 21 then bust (completeHand)
    
  }
  //split hands
  //double down hands (any hand, but can't hit again after double)
  //two aces can only get one card each on split
  //soft hands (ace hands)
  //maybe look at wizard of odds, 

  //TODO: need to fix splits. not activating with two of the same card.
  //cahnge deck to only output the same card and test
  handleHandPossibilities(isDoubleDown) {
    let currHand = this.state.playersCards[this.state.currPlayer[0]][this.state.currPlayer[1]];
    if (currHand.length === 2 && currHand[0][1] === currHand[1][1]) {
      let splitButtonStatus = 'visible';
      let splitIsDisabled = false;

      this.setState({
        splitButtonStatus,
        splitIsDisabled
      }, () => console.log(this.state));
    } else {
      this.disableSplit();
    }
    this.calculateHandTotal(currHand, isDoubleDown);
    // if()
    this.handleSoftHand(currHand);
    //handle soft hands (hands with one ace and another card)
  }

  doubleDown() {
    this.dealCard(true);
  }

  //TODO: need to fix multiple splits display and ordering
  splitHand() {
    let currHand = this.state.playersCards[this.state.currPlayer[0]][this.state.currPlayer[1]];
    let splitHand = [currHand.pop()];

    let playersCards = this.state.playersCards.slice(0);
    playersCards[this.state.currPlayer[0]][this.state.currPlayer[1]] = currHand;
    playersCards[this.state.currPlayer[0]].push(splitHand);



    let playerXTranslations = this.state.playerXTranslations.slice(0);
    let playerYTranslations = this.state.playerYTranslations.slice(0);
    let totalCurrHandsIndex = playersCards[this.state.currPlayer[0]].length - 2; //minus two to account for the newly added card
    let startingPosition = this.state.playerXTranslations[this.state.currPlayer[0]][totalCurrHandsIndex][0] + 80;
    playerXTranslations[this.state.currPlayer[0]].push([startingPosition]);
    playerYTranslations[this.state.currPlayer[0]].push([-40]);

    this.setState({
      playersCards,
      playerXTranslations,
      playerYTranslations,
      splitButtonStatus : 'hidden',
      splitIsDisabled : true,
    }, () => {
      console.log(this.state.playersCards);
      console.log(this.state.playerXTranslations)
    });
  }

  handleSoftHand(currHand) {
    
  }
  
  disableSplit() {
    let splitButtonStatus = 'hidden';
    let splitIsDisabled = true;

    this.setState({
      splitButtonStatus,
      splitIsDisabled
    }, () => console.log(this.state));
  }

  completeTurn() {
    let currPlayer;
    if(this.state.currPlayer === -1) { //dealer
      this.resetTable();
    } else {
      currPlayer = this.state.currPlayer.slice(0);
      if(this.state.playersCards[currPlayer[0]][currPlayer[1] + 1]) {
        currPlayer = [currPlayer[0], currPlayer[1] + 1];
      } else if (!this.state.playersCards[currPlayer[0] + 1]) { //switch to dealer
        currPlayer = -1; //dealer
      } else {
        currPlayer = [currPlayer[0] + 1, 0];
      }
      this.setState({
        currPlayer
      }, () => console.log(this.state.currPlayer));
    }
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
        if(this.state.cardNumber[j] === 'A') {
          cardNumber = 11
        } else if (this.state.cardNumber[j] === 'J' || this.state.cardNumber[j] === 'Q' || this.state.cardNumber[j] === 'K') {
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
          {this.state.playersCards[0].map((player, currPlayerIndex) =>  {
              if(player.length > 0) {
                return player.map((card, key) => <Card card={card}
                                                key={key} 
                                                index={key} 
                                                currPlayer={this.state.currPlayer}
                                                playerTranslateX={this.state.playerXTranslations}
                                                playerTranslateY={this.state.playerYTranslations}
                                                currPlayer={0}
                                                currPlayerIndex={currPlayerIndex}/>)
              }
            })
          }
        </div>
        <div className="buttons">
          <div className="buttonContainer">
            <button id="hit" onClick={() => this.dealCard(false)}>hit</button>
          </div>
          <div className="buttonContainer">
            <button id="stay" onClick={this.completeTurn}>Stay</button>
          </div>
          <div className="buttonContainer">
            <button id="doubleDown" onClick={this.doubleDown}>Double Down</button>
          </div>
          <div className="buttonContainer">
            <button id="split" style={{visibility: this.state.splitButtonStatus}} disabled={this.state.splitIsDisabled} onClick={this.splitHand}>Split</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;