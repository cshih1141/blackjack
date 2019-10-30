import React from 'react';

const Card = ({card}) => (
  <div className="hand hhand-compact active-hand">
    <img className='card' src={'./styles/images/cards/' + card + '.svg'}/>
  </div>
)

export default Card;