import React from 'react';
import PropTypes from 'prop-types';
import { version } from '../package.json';

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
              <a className="text-black" href="/feed">
                Recent
              </a>
              <a className="text-black" href="/coverage">
                Reports
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
            &nbsp;·&nbsp;
            <a className="text-black" target="_blank" rel="noopener noreferrer" href={ `https://github.com/gabrielcsapo/lcov-server/releases/${version}` }>v{version}</a>
          </div>
          <div className="text-black">
            <p>©{(new Date()).getFullYear()} <a target="_blank" rel="noopener noreferrer" href="http://gabrielcsapo.com">gabrielcsapo</a></p>
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
