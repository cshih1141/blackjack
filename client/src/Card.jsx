import React from 'react';

const Card = ({card, index}) => (
  <div className={'card'} id={'card' + index}>
    <img className="cardSVG" src={'./styles/images/cards/' + card + '.svg'}/>
  </div>
)

export default Card;