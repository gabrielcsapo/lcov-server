import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import Main from './main/main';
import Coverage from './coverage/coverage';
import Error from './error/error';

render((
  <Router history={browserHistory}>
    <Route path="/" component={Main}/>
    <Route path="coverage" component={Coverage}/>
    <Route path="*" component={Error}/>
  </Router>
), document.getElementById('root'))
