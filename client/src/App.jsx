import React from 'react';




class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="hand hhand-compact active-hand">
        <img className='card' src='./styles/images/cards/KS.svg'/>
      </div>
    );
  }
}

export default App;