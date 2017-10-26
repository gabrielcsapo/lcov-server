import React from 'react';

class noCoverage extends React.Component {
  render() {
    return (<div className="coverage text-center" style={{ border: "1px solid #dedede", position: "relative", height: "300px" }}>
      <div style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
        No Coverage 🌧
      </div>
    </div>);
  }
}

export default noCoverage;
