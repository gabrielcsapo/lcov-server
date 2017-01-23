import React from 'react';
import { Sparklines, SparklinesLine, SparklinesText } from 'react-sparklines';

class Main extends React.Component {
  render() {
    return (
        <div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          <h3 className="text-black">node-coverage-server 🌤</h3>
          <div className="text-black">This is a simple lcov server / cli parser</div>
          <br/>
          <small className="text-black">
            <pre style={{display: "inline-block"}}>tap --coverage-report=text-lcov | node-coverage-server</pre>
          </small>
          <div style={{display:'block', width:'350px', height: '50px', margin: '0 auto'}}>
            <Sparklines data={[10, 0, 5, 7, 3, 10, 10, 0, 5, 7, 3, 10]} margin={5}>
              <SparklinesLine/>
            </Sparklines>
          </div>
        </div>
    );
  }
}

export default Main;
