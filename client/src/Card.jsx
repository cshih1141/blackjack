import React from 'react';

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.player1Translate = this.props.player1Translate;
  }

  render() {
    return (
      <div className={'card'} id={'card' + this.props.index} style={{transform: `translateX(${this.player1Translate}px)`}}>
        <img className="cardSVG" src={'./styles/images/cards/' + this.props.card + '.svg'}/>
      </div>
    );
  }
}

export default Card;