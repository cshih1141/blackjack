import React from 'react';

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.player1TranslateX = this.props.player1TranslateX;
    this.player1TranslateY = this.props.player1TranslateY;
  }

  render() {
    return (
      <div className={'card'} id={'card' + this.props.index} style={{transform: `translateX(${this.player1TranslateX}px) translateY(${this.player1TranslateY}px)`}}>
        <img className="cardSVG" src={'./styles/images/cards/' + this.props.card + '.svg'}/>
      </div>
    );
  }
}

export default Card;