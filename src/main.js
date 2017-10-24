import React from 'react';
import CoverageChart from './coverage/chart';
import pack from '../package.json';

class Main extends React.Component {
  render() {
    const { origin } = window.location;
    const data = [
      Array.from({length: 6}, () => Math.floor(Math.random() * (100 - 1 + 1)) + 1),
      Array.from({length: 6}, () => Math.floor(Math.random() * (100 - 1 + 1)) + 1),
      Array.from({length: 6}, () => Math.floor(Math.random() * (100 - 1 + 1)) + 1)
    ];

    return (
        <div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          <h3 className="text-black">{pack.name}</h3>
          <p className="text-black">{pack.description}</p>
          <small className="text-black">
            <pre style={{display: "inline-block"}}>npm install -g lcov-server</pre>
            <br/>
            <pre style={{display: "inline-block"}}>tap test/**/*.js --coverage-report=text-lcov | lcov-server --upload {origin}</pre>
          </small>
          <div style={{display:'block', margin: '0 auto'}}>
              <CoverageChart height={50} width={window.innerWidth / 1.5} data={data} />
          </div>
        </div>
    );
  }
}

export default Main;
