import React from 'react';
import PropTypes from 'prop-types';

class Layout extends React.Component {
  render () {
    const { children } = this.props;

    return (
      <div>
        <div className="navbar">
          <div className="container">
            <div className="navbar-title">
              <a className="text-black" href="/">
                <span className="text-black">lcov-server</span>
              </a>
            </div>
            <div className="nav">
              <a className="text-black" href="/coverage" rel="noopener noreferrer">
                Coverage
              </a>
            </div>
          </div>
        </div>
        <div>
          { children }
        </div>
        <div className="footer text-center">
          <div>
            <a className="text-black" target="_blank" rel="noopener noreferrer" href="https://github.com/gabrielcsapo/lcov-server">Source</a>
            &nbsp;·&nbsp;
            <a className="text-black" target="_blank" rel="noopener noreferrer" href="https://github.com/gabrielcsapo/lcov-server/issues">Bugs</a>
          </div>
          <div className="text-black">
            <p>©2017 <a target="_blank" rel="noopener noreferrer" href="http://gabrielcsapo.com">gabrielcsapo</a></p>
          </div>
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object
};

export default Layout;
