import React from 'react';

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.playerTranslateX = this.props.playerTranslateX;
    this.playerTranslateY = this.props.playerTranslateY;
  }

  render() {
    return (
      <div className={'card'} id={'card' + this.props.index} style={{transform: `translateX(${this.playerTranslateX}px) translateY(${this.playerTranslateY}px)`}}>
        <img className="cardSVG" src={'./styles/images/cards/' + this.props.card[0] + '.svg'}/>
      </div>
    );
  }
}

export default Card;