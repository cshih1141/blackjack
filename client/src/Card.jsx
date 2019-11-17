import React from 'react';

class Card extends React.Component {
  constructor(props) {
    super(props);

    // this.playerTranslateX = this.props.playerTranslateX;
    // this.playerTranslateY = this.props.playerTranslateY;
  }

  render() {
    if(this.props.currPlayer === -1) {
      return (<div className={'card'} id={'card' + this.props.index}>
                <img className="cardSVG" src={'./styles/images/cards/' + this.props.card[0] + '.svg'}/>
              </div>
      );
    } else {
      return (
        <div className={'card'} id={'card' + this.props.index} 
          style={{left: `${this.props.playerTranslateX[this.props.currPlayer][this.props.currPlayerIndex][this.props.index]}px`, 
                  top: `${this.props.playerTranslateY[this.props.currPlayer][this.props.currPlayerIndex][this.props.index]}px`}}>
          <img className="cardSVG" src={'./styles/images/cards/' + this.props.card[0] + '.svg'}/>
        </div>
      );
    }
  }
}

export default Card;