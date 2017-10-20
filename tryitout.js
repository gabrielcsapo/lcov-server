const { version } = require('./package.json');

module.exports = {
    title: 'lcov-server',
    nav: {
      Source: 'https://github.com/gabrielcsapo/lcov-server',
      Storybook: './storybook/index.html'
    },
    body: `
      <style media="screen">
      body,
      html {
        height: 100%;
        width: 100%;
      }
      * {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      }
      .footer {
        position: absolute;
        bottom: 0;
      }
      pre {
        display: inline-block;
        background: black;
        color: white !important;
      }
      code {
        display: inline-block;
        padding: 0;
        margin: 0;
        color: grey;
      }
      </style>
      <div class="text-center" style="width: 100%; position: absolute; top: 50%; transform: translateY(-50%);">
        <h3 class="text-black">lcov-server</h3>
        <p class="text-black">🎯 A simple lcov server &amp; cli parser</p>
        <small>v${version}</small>
        <br/>
        <br/>
        <small>
          <pre>npm install -g lcov-server</pre>
          <br/>
          <pre style="width:80%;text-align:left;white-space: pre-wrap;">
  $ lcov-server <code> this will startup the lcov-server </code>
  $ tap test/**/*.js --coverage-report=text-lcov | lcov-server --upload https://localhost:8080</pre>
        </small>
        <div style="display: block; margin: 0px auto;">
          <span class="LineChart" style="width: 450px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="450px" height="150px" viewBox="0 0 450 150">
              <g>
                <g style="pointer-events: none;">
                  <path d="M50,100L50.5,97.5 L120.5,97.5 190.5,91.5 260.5,61.5 330.5,88.5 400.5,51.5L400,100" fill="#9a8585" fill-opacity=".05"></path>
                  <path d="M50.5,97.5 L120.5,97.5 190.5,91.5 260.5,61.5 330.5,88.5 400.5,51.5" fill="none" stroke="#9a8585" stroke-width="1"></path>
                </g>
                <g>
                  <circle cx="50.5" cy="97.5" r="3" fill="#9a8585" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="120.5" cy="97.5" r="3" fill="#9a8585" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="190.5" cy="91.5" r="3" fill="#9a8585" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="260.5" cy="61.5" r="3" fill="#9a8585" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="330.5" cy="88.5" r="3" fill="#9a8585" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="400.5" cy="51.5" r="3" fill="#9a8585" stroke-width="1" stroke="#ffffff"></circle>
                  <text class="LineChart--label" x="405.5" y="53.5" fill="#9a8585">Lines</text>
                </g>
              </g>
              <g>
                <g style="pointer-events: none;">
                  <path d="M50,100L50.5,50.5 L120.5,79.5 190.5,58.5 260.5,82.5 330.5,70.5 400.5,50.5L400,100" fill="#a7daff" fill-opacity=".05"></path>
                  <path d="M50.5,50.5 L120.5,79.5 190.5,58.5 260.5,82.5 330.5,70.5 400.5,50.5" fill="none" stroke="#a7daff" stroke-width="1"></path>
                </g>
                <g>
                  <circle cx="50.5" cy="50.5" r="3" fill="#a7daff" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="120.5" cy="79.5" r="3" fill="#a7daff" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="190.5" cy="58.5" r="3" fill="#a7daff" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="260.5" cy="82.5" r="3" fill="#a7daff" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="330.5" cy="70.5" r="3" fill="#a7daff" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="400.5" cy="50.5" r="3" fill="#a7daff" stroke-width="1" stroke="#ffffff"></circle>
                  <text class="LineChart--label" x="405.5" y="52.5" fill="#a7daff">Branches</text>
                </g>
              </g>
              <g>
                <g style="pointer-events: none;">
                  <path d="M50,100L50.5,56.5 L120.5,55.5 190.5,77.5 260.5,88.5 330.5,91.5 400.5,96.5L400,100" fill="#f7ca97" fill-opacity=".05"></path>
                  <path d="M50.5,56.5 L120.5,55.5 190.5,77.5 260.5,88.5 330.5,91.5 400.5,96.5" fill="none" stroke="#f7ca97" stroke-width="1"></path>
                </g>
                <g>
                  <circle cx="50.5" cy="56.5" r="3" fill="#f7ca97" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="120.5" cy="55.5" r="3" fill="#f7ca97" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="190.5" cy="77.5" r="3" fill="#f7ca97" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="260.5" cy="88.5" r="3" fill="#f7ca97" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="330.5" cy="91.5" r="3" fill="#f7ca97" stroke-width="1" stroke="#ffffff"></circle>
                  <circle cx="400.5" cy="96.5" r="3" fill="#f7ca97" stroke-width="1" stroke="#ffffff"></circle>
                  <text class="LineChart--label" x="405.5" y="98.5" fill="#f7ca97">Functions</text>
                </g>
              </g>
            </svg>
          </span>
        </div>
      </div>
    `,
    options: {
      width: '100%'
    },
    footer: {
      author: 'Made with 🐒 by @gabrielcsapo',
      website: 'http://www.gabrielcsapo.com'
    }
};
