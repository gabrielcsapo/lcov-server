import React from 'react';
import { LineChart } from '../lib/chart';

class Main extends React.Component {
  render() {
    const opt = {
        data: [[97,92,89,30,72],[43,62,84,98,3],[23,88,52,14,4]],
        colors: ['#9a8585', '#a7daff', '#f7ca97'],
        labels: ['Lines', 'Branches', 'Statements'],
        width: 350,
        height: 50,
        area: true,
        dots: true,
        hideLabels: false,
        grid: false
    };

    return (
        <div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          <h3 className="text-black">node-coverage-server 🌤</h3>
          <div className="text-black">A simple lcov server / cli parser</div>
          <br/>
          <small className="text-black">
            <pre style={{display: "inline-block"}}>npm install -g node-coverage-server</pre>
            <br/>
            <pre style={{display: "inline-block"}}>tap --coverage-report=text-lcov | node-coverage-cli --url http://...</pre>
          </small>
          <div style={{display:'block', margin: '0 auto'}}>
              <LineChart {...opt} />
          </div>
        </div>
    );
  }
}

export default Main;
