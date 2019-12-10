import React from 'react'


const Player = () => (
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
)

export default Player;