import React from 'react';

class Main extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          <h3 className="text-black">node-coverage-server 🌤</h3>
          <div className="text-black">This is a simple lcov parser</div>
          <br/>
          <small className="text-black">Enjoy!</small>
        </div>
    );
  }
}

export default Main;
