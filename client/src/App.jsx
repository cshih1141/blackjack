import React from 'react';
import Card from './Card';
import DealerCards from './DealerCards';
const Promise = require('bluebird');
import { subscribeToGameDetails, updateGameStatus, joinGame } from './Socket';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

//TODO: update deck to take in x cards (6 deck 8 deck, double deck)
//display wizard of odds table
//maybe pop up per hand to show ideal thing.
//write down different situations - split hands, double down hands etc
class App extends React.Component {
  constructor(props) {
    super(props);

    joinGame((err, data) => {
      let playerNum = data.player;
      let deck = data.deck;
      this.setState({ 
        playerNum, 
        deck
      }, () => console.log(this.state.playerNum)) 
    });

    this.state = {
      suits: ['C', 'D', 'H', 'S'],
      cardNumber: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      deck: [],
      currPlayer: [0,0],
      playersCards: [ [[]], [[]] ],
      dealerCards: [],
      playerXTranslations:[ [[-10]], [[-10]] ],
      playerYTranslations:[ [[-40]], [[-40]] ],
      normalPlayButtons: 'hidden',
      normalPlayButtonsIsDisabled : true,
      splitButtonStatus: 'hidden', //visible
      splitIsDisabled: true, //false
      normalPlayButtons2: 'hidden',
      normalPlayButtonsIsDisabled2 : true,
      splitButtonStatus2: 'hidden', //visible
      splitIsDisabled2: true, //false
      hasPlayer1 : false,
      hasPlayer2 : false,
      readyPlayer1 : false,
      readyPlayer2 : false,
      readyButton : 'hidden',
      readyButtonDisabled : true,
      readyButton2 : 'hidden',
      readyButtonDisabled2 : true,
      joinButton : 'visible',
      joinButtonDisabled : false,
      joinButton2 : 'visible',
      joinButtonDisabled2 : false,
      playerNum : null,
    }

    // this.createDeck = this.createDeck.bind(this);
    this.completeTurn = this.completeTurn.bind(this);
    this.dealCard = this.dealCard.bind(this);
    // this.getRandomCard = this.getRandomCard.bind(this);
    // this.shuffleDeck = this.shuffleDeck.bind(this);
    this.handleHandPossibilities = this.handleHandPossibilities.bind(this);
    this.doubleDown = this.doubleDown.bind(this);
    this.splitHand = this.splitHand.bind(this);
    this.resetTable = this.resetTable.bind(this);
    this.disableSplit = this.disableSplit.bind(this);
    this.calculateHandTotal = this.calculateHandTotal.bind(this);
    this.handleDealerHand = this.handleDealerHand.bind(this);
    this.startRound = this.startRound.bind(this);
    this.timeout = this.timeout.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.readyUp = this.readyUp.bind(this);

    subscribeToGameDetails((err, data) =>{
      if (data.gameUpdates === '1' || data.gameUpdates === '2') {
        this.joinGame(data.gameUpdates, true);
        console.log('joining game ' + data.gameUpdates);
      } else if (data.gameUpdates === 'readyPlayer1' || data.gameUpdates === 'readyPlayer2') {
        this.readyUp(data.gameUpdates, true);
        console.log('readyUp ' + data.gameUpdates);
      } else if (data.gameUpdates === 'dealCard') {
        this.dealCard(false, true);
        console.log('dealCard');
      } else if (data.gameUpdates === 'completeTurn') {
        this.completeTurn(true);
        console.log('completeTurn');
      } else if (data.gameUpdates === 'doubleDown') {
        this.doubleDown(true);
        console.log('doubleDown');
      } else if (data.gameUpdates === 'split') {
        this.splitHand(true);
        console.log('split');
      }
      // socket.emit('gameUpdates', { gameUpdates : 'completed' });
    });
  }

  joinGame(player, sentFromSocket = false) {
    if(!sentFromSocket) {
      updateGameStatus(player);
    }
    let readyButton;
    let readyButtonDisabled;
    let hasPlayer;
    let joinButton = this.state.joinButton;
    let joinButtonDisabled = this.state.joinButtonDisabled;
    let joinButton2 = this.state.joinButton2;
    let joinButtonDisabled2 = this.state.joinButtonDisabled2;
    if(player === '1') {
      readyButton = 'readyButton';
      readyButtonDisabled = 'readyButtonDisabled';
      hasPlayer = 'hasPlayer1';
      joinButton = 'hidden';
      joinButtonDisabled = true;
    } else {
      readyButton = 'readyButton2';
      readyButtonDisabled = 'readyButtonDisabled2';
      hasPlayer = 'hasPlayer2';
      joinButton2 = 'hidden';
      joinButtonDisabled2 = true;
    }
    this.setState({
      [readyButton] : 'visible',
      [readyButtonDisabled] : false,
      [hasPlayer] : true,
      joinButton,
      joinButtonDisabled,
      joinButton2,
      joinButtonDisabled2,
    });
  }

  readyUp(player, sentFromSocket = false) {
    if(!sentFromSocket) {
      updateGameStatus(player);
    }
    let readyPlayer = player;
    let readyButton;
    let readyButtonDisabled;
    if(readyPlayer === 'readyPlayer1') {
      readyButton = 'readyButton';
      readyButtonDisabled = 'readyButtonDisabled';
    } else {
      readyButton = 'readyButton2';
      readyButtonDisabled = 'readyButtonDisabled2';
    }
    this.setState({
      [readyPlayer] : true,
      [readyButton] : 'hidden',
      [readyButtonDisabled] : true,
    }, () => {
      this.startRound();
    })
  }

  //todo: add a button that starts the round
  startRound() {
    if(this.state.readyPlayer1 && this.state.readyPlayer2) {
      let playerCards;
      let translateX;
      let translateY;
      let currPlayer = this.state.currPlayer;
      let playerXTranslations = JSON.parse(JSON.stringify(this.state.playerXTranslations.slice(0)));
      let playerYTranslations = JSON.parse(JSON.stringify(this.state.playerYTranslations.slice(0)));
      let dealerCards = JSON.parse(JSON.stringify(this.state.dealerCards.slice(0)));
      let playersCards = JSON.parse(JSON.stringify(this.state.playersCards.slice(0)));
      let deck = JSON.parse(JSON.stringify(this.state.deck.slice(0)));
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < this.state.playersCards.length; j++) {
          currPlayer = [j,0];
          playerCards = playersCards[currPlayer[0]][currPlayer[1]].slice(0);;
          let translateXlength = playerXTranslations[currPlayer[0]][currPlayer[1]].length;
          let translateYlength = playerYTranslations[currPlayer[0]][currPlayer[1]].length;
          translateX = playerXTranslations[currPlayer[0]][currPlayer[1]][translateXlength - 1] - 90;
          translateY = playerYTranslations[currPlayer[0]][currPlayer[1]][translateYlength - 1] - 40;
  
          playerCards.push(deck.pop());
      
          playersCards[currPlayer[0]][currPlayer[1]] = playerCards;
    
          playerXTranslations[currPlayer[0]][currPlayer[1]].push(translateX);
          playerYTranslations[currPlayer[0]][currPlayer[1]].push(translateY);
          if(playerXTranslations[currPlayer[0]][currPlayer[1] + 1]) {
            for(let i = currPlayer[1] + 1; i < playerXTranslations[currPlayer[0]].length; i++) {
              playerXTranslations[currPlayer[0]][i][0] -= 90;
            }
          }
        }
        if(i < 1) {
          let dealerCard = deck.pop();
          dealerCards.push(dealerCard);
        }
      }
  
      let normalPlayButtons;
      let normalPlayButtonsIsDisabled;
      let normalPlayButtons2;
      let normalPlayButtonsIsDisabled2;
      if(this.state.currPlayer[0] === 0) {
        //player 1
        normalPlayButtons = 'visible';
        normalPlayButtonsIsDisabled = false;
        normalPlayButtons2 = 'hidden';
        normalPlayButtonsIsDisabled2 = true;
      } else {
        //player 2
        normalPlayButtons = 'hidden';
        normalPlayButtonsIsDisabled = true;
        normalPlayButtons2 = 'visible';
        normalPlayButtonsIsDisabled2 = false;
      }
  
      this.setState({
        normalPlayButtons,
        normalPlayButtonsIsDisabled,
        normalPlayButtons2,
        normalPlayButtonsIsDisabled2,
        playersCards,
        playerXTranslations,
        playerYTranslations,
        deck,
        dealerCards,
      }, () => this.handleHandPossibilities(false));
    }
  }

  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //need to make it so theres a setInterval after last player stays for when
  //dealers turn to hit. will keep going until they need to stay or bust.
  //change this to deal from deck instead of making a random card each time
  //TODO: end the shoe when there's only x% left.
  //possibly chance currPlayer to indexes of 2d array. first index is player, which player hand (if split)
  dealCard(isDoubleDown = false, sentFromSocket = false) {
    if(!sentFromSocket && this.state.currPlayer !== -1) {
      updateGameStatus('dealCard');
    }
    let playerCards;
    let translateX;
    let translateY;
    let currPlayer = this.state.currPlayer;
    if (currPlayer === -1) { //dealer
      playerCards = this.state.dealerCards.slice(0);
    } else { //player
      playerCards = this.state.playersCards[currPlayer[0]][currPlayer[1]].slice(0);
      let translateXlength = this.state.playerXTranslations[currPlayer[0]][currPlayer[1]].length;
      let translateYlength = this.state.playerYTranslations[currPlayer[0]][currPlayer[1]].length;
      translateX = this.state.playerXTranslations[currPlayer[0]][currPlayer[1]][translateXlength - 1] - 90;
      translateY = this.state.playerYTranslations[currPlayer[0]][currPlayer[1]][translateYlength - 1] - 40;
    }

    let deck = this.state.deck.slice(0);
    playerCards.push(deck.pop());

    if(currPlayer === -1) {
      this.setState({
        dealerCards: playerCards,
        deck
      }, () => this.handleDealerHand());
    } else {
      let playersCards = this.state.playersCards.slice(0);
      playersCards[currPlayer[0]][currPlayer[1]] = playerCards;

      let playerXTranslations = this.state.playerXTranslations.slice(0);
      let playerYTranslations = this.state.playerYTranslations.slice(0);
      playerXTranslations[currPlayer[0]][currPlayer[1]].push(translateX);
      playerYTranslations[currPlayer[0]][currPlayer[1]].push(translateY);
      if(playerXTranslations[currPlayer[0]][currPlayer[1] + 1]) {
        for(let i = currPlayer[1] + 1; i < playerXTranslations[currPlayer[0]].length; i++) {
          playerXTranslations[currPlayer[0]][i][0] -= 90;
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
      playersCards: [ [[]], [[]] ],
      dealerCards: [],
      playerXTranslations:[ [[-10]], [[-10]] ],
      playerYTranslations:[ [[-40]], [[-40]] ],
      normalPlayButtons: 'hidden',
      normalPlayButtonsIsDisabled : true,
      normalPlayButtons2: 'hidden',
      normalPlayButtonsIsDisabled2 : true,
      splitButtonStatus: 'hidden', //visible
      splitIsDisabled: true, //false
      splitButtonStatus2: 'hidden', //visible
      splitIsDisabled2: true, //false
      readyButton : 'visible',
      readyButtonDisabled : false,
      readyButton2 : 'visible',
      readyButtonDisabled2 : false,
      readyPlayer1 : false,
      readyPlayer2 : false,
    });
  }


  calculateHandTotal(currHand, isDoubleDown) {
    //if total is 21 and currHand count is 2, pay out blackjack
    let currHandTotals = [0];
    let dealerHandCompleted = false;
    if(currHand.length === 2 && currHand[0][1] + currHand[1][1] === 21) {
      console.log('BLACKJACK');
      dealerHandCompleted = true;
      // return 21; //TODO: move this to complete turn and store in state for player
      //pay out 3 to 2
    } else {
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
          if (this.state.currPlayer !== -1) {
            this.completeTurn();
          }
          dealerHandCompleted = true;
          // return -1; //TODO: move this to complete turn and store in state for player
        } else if (currHandTotals[0] === 21 || currHandTotals[1] === 21) {
          console.log('YOU GOT 21');
          if (this.state.currPlayer !== -1) {
            this.completeTurn();
          }
          dealerHandCompleted = true;
          // return 21; //TODO: move this to complete turn and store in state for player
        }
      } else {
        if (currHandTotals[0] > 21) {
          console.log('YOU BUSTED');
          //deduct money then
          if (this.state.currPlayer !== -1) {
            this.completeTurn();
          }
          dealerHandCompleted = true;
          // return -1; //TODO: move this to complete turn and store in state for player
        } else if (currHandTotals[0] === 21) {
          console.log('YOU GOT 21');
          if (this.state.currPlayer !== -1) {
            this.completeTurn();
          }
          dealerHandCompleted = true;
          // return 21; //TODO: move this to complete turn and store in state for player
        }
      }
      console.log(currHandTotals);
      if(isDoubleDown) {
        if (this.state.currPlayer !== -1) {
          this.completeTurn();
        }
        dealerHandCompleted = true;
        //TODO: move this to complete turn and store in state for player
        // if(currHandTotals.length > 1) {
        //   if(currHandTotals[0] <= 21 && currHandTotals[1] <= 21) {
        //     return Math.max(currHandTotals[0], currHandTotals[1]);
        //   } else {
        //     return Math.min(currHandTotals[0], currHandTotals[1]);
        //   }
        // } else {
        //   return currHandTotals[0];
        // }
      }
    }    
    currHandTotals.push(dealerHandCompleted);
    return currHandTotals;
  }

  

  //TODO: trigger this automatically when dealer turn
  //TODO: handle when dealer busts, add end turn functionality. 
  handleDealerHand() {
      let currTotals = this.calculateHandTotal(this.state.dealerCards, false);
      let handCompleted = currTotals[currTotals.length - 1];
      //if there is a number is 17 or higher, stay
      if (currTotals.length > 2) {
        if ((currTotals[0] >= 17 && currTotals[0] <= 21) || (currTotals[1] >= 17 && currTotals[1] <= 21)) {
          let total;
          if(currTotals[0] >= 17 && currTotals[0] <= 21) {
            total = currTotals[0];
          } else {
            total = currTotals[1];
          }
          console.log('DEALER HAS ' + total + '. DEALER STAYS');
          handCompleted = true;
          //END DEALER TURN
        } 
      } else {
        if(currTotals[0] >= 17 && currTotals[0] <= 21) {
          console.log('DEALER HAS ' + currTotals[0] + '. DEALER STAYS');
          handCompleted = true;
          //END DEALER TURN
        }
      }
      console.log('this is curr totals ' + JSON.stringify(currTotals));
      if(!handCompleted) {
        setTimeout(this.dealCard, 1000);
      } else {
        setTimeout(() => {
          this.completeTurn();
          alert('DEALER HAND IS OVER');
          console.log(this.state.deck.length);
        }, 1000);
      }
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
      if(this.state.currPlayer[0] === 0) {
        //player 1
        let splitButtonStatus = 'visible';
        let splitIsDisabled = false;

        this.setState({
          splitButtonStatus,
          splitIsDisabled,
        }, () => console.log(this.state));
      } else {
        //player 2
        let splitButtonStatus2 = 'visible';
        let splitIsDisabled2 = false;

        this.setState({
          splitButtonStatus2,
          splitIsDisabled2
        }, () => console.log(this.state));
      }


    } else {
      this.disableSplit();
    }
    this.calculateHandTotal(currHand, isDoubleDown);
  }

  doubleDown(sentFromSocket = false) {
    if(!sentFromSocket) {
      updateGameStatus('doubleDown');
    }
    this.dealCard(true);
  }

  //TODO: need to fix multiple splits display and ordering
  splitHand(sentFromSocket = false) {
    if(!sentFromSocket) {
      updateGameStatus('split');
    }
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
      splitButtonStatus2 : 'hidden',
      splitIsDisabled2 : true,
    }, () => {
      console.log(this.state.playersCards);
      console.log(this.state.playerXTranslations)
    });
  }
  
  disableSplit() {
    if(this.state.currPlayer[0] === 0) {
      //player 1
      let splitButtonStatus = 'hidden';
      let splitIsDisabled = true;
      this.setState({
        splitButtonStatus,
        splitIsDisabled,
      }, () => console.log(this.state));
    } else {
      //player 2
      let splitButtonStatus2 = 'hidden';
      let splitIsDisabled2 = true;
      this.setState({
        splitButtonStatus2,
        splitIsDisabled2
      }, () => console.log(this.state));
    }
  }

  completeTurn(sentFromSocket = false) {
    if(!sentFromSocket) {
      updateGameStatus('completeTurn');
    }
    let currPlayer;
    let normalPlayButtons;
    let normalPlayButtonsIsDisabled;
    let normalPlayButtons2;
    let normalPlayButtonsIsDisabled2;
    if(this.state.currPlayer[0] === 0) {
      //player 1
      normalPlayButtons = 'visible';
      normalPlayButtonsIsDisabled = false;
      normalPlayButtons2 = 'hidden';
      normalPlayButtonsIsDisabled2 = true;
    } else {
      //player 2
      normalPlayButtons = 'hidden';
      normalPlayButtonsIsDisabled = true;
      normalPlayButtons2 = 'visible';
      normalPlayButtonsIsDisabled2 = false;
    }
    let splitButtonStatus = this.state.splitButtonStatus;
    let splitIsDisabled = this.state.splitIsDisabled;
    let splitButtonStatus2 = this.state.splitButtonStatus2;
    let splitIsDisabled2 = this.state.splitIsDisabled2;
    if(this.state.currPlayer === -1) { //dealer
      this.resetTable();
    } else {
      currPlayer = this.state.currPlayer.slice(0);
      if(this.state.playersCards[currPlayer[0]][currPlayer[1] + 1]) {
        currPlayer = [currPlayer[0], currPlayer[1] + 1];
      } else if (!this.state.playersCards[currPlayer[0] + 1]) { //switch to dealer
        if(this.state.currPlayer[0] === 1) {
          //player 1
          normalPlayButtons = 'hidden';
          normalPlayButtonsIsDisabled = true;
        } else {
          //player 2
          normalPlayButtons2 = 'hidden';
          normalPlayButtonsIsDisabled2 = true;
        }

        if(this.state.currPlayer[0] === 1) {
          //player 1
          splitButtonStatus = 'hidden'; //visible
          splitIsDisabled = true; //false
        } else {
          //player 2
          splitButtonStatus2 = 'hidden'; //visible
          splitIsDisabled2 = true; //false
        }

        currPlayer = -1; //dealer
      } else {
        currPlayer = [currPlayer[0] + 1, 0];
        normalPlayButtons = 'hidden';
        normalPlayButtonsIsDisabled = true;
        normalPlayButtons2 = 'visible';
        normalPlayButtonsIsDisabled2 = false;
        splitButtonStatus = 'hidden';
        splitIsDisabled = true;
      }
      this.setState({
        currPlayer,
        normalPlayButtons,
        normalPlayButtonsIsDisabled,
        normalPlayButtons2,
        normalPlayButtonsIsDisabled2,
        splitButtonStatus,
        splitIsDisabled,
        splitButtonStatus2,
        splitIsDisabled2,
      }, () => {
        if (this.state.currPlayer === -1) {
          setTimeout(this.dealCard(false), 1000);
          console.log(this.state);
        }
      });
    }
  }

  // getRandomCard(min, max) {
  //   return min +  (Math.floor(Math.random() * Math.floor(max - min)));
  // }

  // shuffleDeck(deck) {
  //   let tempStorage = '';
  //   let randomIndex;
  //   for(let i = 0; i < deck.length; i++) {
  //     randomIndex = this.getRandomCard(i, deck.length);
  //     tempStorage = deck[i];
  //     deck[i] = deck[randomIndex];
  //     deck[randomIndex] = tempStorage;
  //   }
  
  //   return deck;
  // };

  // createDeck(numDecks) {
  //   let deck = [];
  //   for(let i = 0; i < this.state.suits.length; i++) {
  //     for (let j = 0; j < this.state.cardNumber.length; j++) {
  //       let cardNumber;
  //       if(this.state.cardNumber[j] === 'A') {
  //         cardNumber = 11
  //       } else if (this.state.cardNumber[j] === 'J' || this.state.cardNumber[j] === 'Q' || this.state.cardNumber[j] === 'K') {
  //         cardNumber = 10;
  //       } else {
  //         cardNumber = Number(this.state.cardNumber[j]);
  //       }
  //       deck.push([this.state.cardNumber[j] + this.state.suits[i], cardNumber]);
  //     }
  //   }

  //   let totalDecks = [];
  //   for (let i = 0; i < 6; i++) {
  //     totalDecks = totalDecks.concat(deck);
  //   }

  //   deck = totalDecks;

  //   this.shuffleDeck(deck);

  //   this.setState({
  //     deck
  //   });
  // }

  componentDidMount() {
    // this.createDeck();
  }

  render() {
    return (
      <div>
        <div className="Cards DealerCards">
          {this.state.dealerCards.map((card, key) => <DealerCards card={card}
                                                    key={key} 
                                                    index={key} />)}
        </div>
        <div className="applicationContainer" id="applicationContainer">
          <div className="player1">
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
            <div className="JoinButton">
              <button id="join" className="join" style={{visibility: this.state.joinButton}} disabled={this.state.joinButtonDisabled} onClick={() => this.joinGame('1')}>Join</button>
            </div>
            <div className="ReadyButton">
              <button id="ready" className="Ready" style={{visibility: this.state.readyButton}} disabled={this.state.readyButtonDisabled} onClick={() => this.readyUp('readyPlayer1')}>Ready</button>
            </div>
            <div className="buttons">
              <div className="buttonContainer">
                <button id="hit" style={{visibility: this.state.normalPlayButtons}} disabled={this.state.normalPlayButtonsIsDisabled} onClick={() => this.dealCard(false)}>hit</button>
              </div>
              <div className="buttonContainer">
                <button id="stay" style={{visibility: this.state.normalPlayButtons}} disabled={this.state.normalPlayButtonsIsDisabled} onClick={() => this.completeTurn(false)}>Stay</button>
              </div>
              <div className="buttonContainer">
                <button id="doubleDown" style={{visibility: this.state.normalPlayButtons}} disabled={this.state.normalPlayButtonsIsDisabled} onClick={() => this.doubleDown(false)}>Double Down</button>
              </div>
              <div className="buttonContainer">
                <button id="split" style={{visibility: this.state.splitButtonStatus}} disabled={this.state.splitIsDisabled} onClick={() => this.splitHand(false)}>Split</button>
              </div>
            </div>
          </div>


          <div className="player2">
            <div className="Cards PlayerCards2">
              {this.state.playersCards[1].map((player, currPlayerIndex) =>  {
                  if(player.length > 0) {
                    return player.map((card, key) => <Card card={card}
                                                          key={key} 
                                                          index={key} 
                                                          currPlayer={this.state.currPlayer}
                                                          playerTranslateX={this.state.playerXTranslations}
                                                          playerTranslateY={this.state.playerYTranslations}
                                                          currPlayer={1}
                                                          currPlayerIndex={currPlayerIndex}/>)
                  }
                })
              }
            </div>
            <div className="JoinButton2">
              <button id="join" className="join" style={{visibility: this.state.joinButton2}} disabled={this.state.joinButtonDisabled2}  onClick={() => this.joinGame('2')}>Join</button>
            </div>
            <div className="ReadyButton2">
              <button id="ready" className="Ready" style={{visibility: this.state.readyButton2}} disabled={this.state.readyButtonDisabled2} onClick={() => this.readyUp('readyPlayer2')}>Ready</button>
            </div>
            <div className="buttons2">
              <div className="buttonContainer">
                <button id="hit" style={{visibility: this.state.normalPlayButtons2}} disabled={this.state.normalPlayButtonsIsDisabled2} onClick={() => this.dealCard(false)}>hit</button>
              </div>
              <div className="buttonContainer">
                <button id="stay" style={{visibility: this.state.normalPlayButtons2}} disabled={this.state.normalPlayButtonsIsDisabled2} onClick={this.completeTurn}>Stay</button>
              </div>
              <div className="buttonContainer">
                <button id="doubleDown" style={{visibility: this.state.normalPlayButtons2}} disabled={this.state.normalPlayButtonsIsDisabled2} onClick={this.doubleDown}>Double Down</button>
              </div>
              <div className="buttonContainer">
                <button id="split" style={{visibility: this.state.splitButtonStatus2}} disabled={this.state.splitIsDisabled2} onClick={this.splitHand}>Split</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;