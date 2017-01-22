import 'psychic-ui/dist/psychic-min.css';
import './style.css';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import Main from './main/main';
import Coverages from './coverage/coverages';
import Coverage from './coverage/coverage';
import Error from './error/error';

render((
  <Router history={browserHistory}>
    <Route path="/" component={Main}/>
    <Route path="/coverage" component={Coverages}/>
    <Route path="/coverage/:repoLink" component={Coverage}/>
    <Route path="*" component={Error}/>
  </Router>
), document.getElementById('root'))
