import React from 'react';

class Layout extends React.Component {
  render () {
    const { children } = this.props;

    return (
      <div>
        <div className="navbar">
          <div className="container">
            <div className="navbar-title">
              <a className="text-black" href="/">
                <span className="text-black">node-coverage-server</span>
              </a>
            </div>
            <div className="nav">
              <a className="text-black" href="/coverage">
                Coverage
              </a>
              <a className="text-black" href="https://github.com/gabrielcsapo/node-coverage-server">Source 🖥</a>
            </div>
          </div>
        </div>
        <div>
          { children }
        </div>
          <div className="navbar navbar-center footer">
            <div className="container text-center">
              <div className="text-black">
                <a href="https://github.com/gabrielcsapo/node-coverage-server">node-coverage-server</a>
                &nbsp;by&nbsp;
                <a href="http://gabrielcsapo.com">@gabrielcsapo</a>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: React.PropTypes.object
};

export default Layout;
