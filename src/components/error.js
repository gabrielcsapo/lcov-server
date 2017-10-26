import React from 'react';
import PropTypes from 'prop-types';

class Error extends React.Component {
  render() {
    const { error } = this.props;

    return (<div className="text-center" style={{width:"100%",position: "absolute",top: "50%",transform: "translateY(-50%)"}}>
      Oh no 🙈 something happened...
      <br/>
      <br/>
      <pre style={{width: '50%', margin: '0 auto'}}>
        { error || 'Page not found' }
      </pre>
      <br/>
      <a href="/"> Go Somewhere Safe 🏝 </a>
    </div>);
  }
}

Error.propTypes = {
  error: PropTypes.string
};

export default Error;
