import React from 'react';

class Error extends React.Component {
  render() {
    return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
          Page not found 🐒
      </div>);
  }
}

export default Error;
