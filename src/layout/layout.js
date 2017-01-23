import React from 'react';

class Layout extends React.Component {
  render () {
    const { children } = this.props;
    const { absoluteFooter } = this.props.children.props.routes[1];
    
    return (
      <div>
        <div className="navbar navbar-center">
          <div className="container">
            <div className="navbar-title">
              <a className="text-black" href="/">
                <span className="text-black">node-coverage-server</span>
              </a>
            </div>
            <div className="navbar-content">
              <div className="nav">
                <a className="text-black" href="/coverage">
                  Coverage
                </a>
                <a className="text-black" href="https://github.com/gabrielcsapo/node-coverage-server">Source 🖥</a>
              </div>
            </div>
          </div>
        </div>
        <div>
          { children }
        </div>
          <div className="navbar navbar-center" style={{bottom: "0", position: absoluteFooter ? 'absolute' : 'relative'}}>
            <div className="container text-center">
              <div className="text-black">
                <a href="https://github.com/gabrielcsapo/node-coverage-server">node-coverage-server</a> by
                <a href="http://gabrielcsapo.com">@gabrielcsapo</a>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default Layout;
