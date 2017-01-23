import React from 'react';

class Layout extends React.Component {

  getFooter(absolute=false) {
    if(absolute) {
      return (<div className="navbar navbar-center" style={{bottom: "0", position: "absolute"}}>
        <div className="container text-center">
          <div className="text-black">node-coverage-server by
            <a href="http://gabrielcsapo.com">@gabrielcsapo</a>
          </div>
        </div>
      </div>);
    } else {
        return (<div className="navbar navbar-center">
          <div className="container text-center">
            <div className="text-black">node-coverage-server by
              <a href="http://gabrielcsapo.com">@gabrielcsapo</a>
            </div>
          </div>
        </div>);
    }
  }

  render () {
    const { children } = this.props;
    const { absoluteFooter } = this.props.children.props.routes[1];
    const footer = this.getFooter(absoluteFooter);

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
          { footer }
        }}
      </div>
    )
  }
}

export default Layout;
