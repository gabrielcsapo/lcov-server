import React from 'react';

class Loading extends React.Component {
  render() {
    return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
      Loading 🌪
    </div>);
  }
}

export default Loading;
