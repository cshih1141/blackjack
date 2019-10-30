import React from 'react';

const Card = ({card, index, currPlayer}) => (
  <div className={'card ' + currPlayer} id={'card' + index}>
    <img className="cardSVG" src={'./styles/images/cards/' + card + '.svg'}/>
  </div>
)

export default Card;