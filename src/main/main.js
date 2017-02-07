import React from 'react';
import CoverageChart from '../coverage/coverageChart';

class Main extends React.Component {
  render() {
    const data = [[],[],[]];
    for(let i = 0; i < 6; i++) {
      data[0].push(Math.floor(Math.random() * (100 - 1 + 1)) + 1);
      data[1].push(Math.floor(Math.random() * (100 - 1 + 1)) + 1);
      data[2].push(Math.floor(Math.random() * (100 - 1 + 1)) + 1);
    }
    const url = window.location.origin;

    return (
        <div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          <h3 className="text-black">node-coverage-server 🌤</h3>
          <div className="text-black">A simple lcov server / cli parser</div>
          <br/>
          <small className="text-black">
            <pre style={{display: "inline-block"}}>npm install -g node-coverage-server</pre>
            <br/>
            <pre style={{display: "inline-block"}}>tap --coverage-report=text-lcov | node-coverage-cli --url {url}</pre>
          </small>
          <div style={{display:'block', margin: '0 auto'}}>
              <CoverageChart height={50} width={350} data={data} />
          </div>
        </div>
    );
  }
}

export default Main;
