import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

import Layout from './layout/layout';
import Main from './main/main';
import Coverages from './coverage/coverages';
import Coverage from './coverage/coverage';
import Error from './error/error';

export default (
  <Router history={browserHistory}>
    <Route component={Layout}>
      <Route path="/" component={Main} absoluteFooter={true} />
      <Route path="/coverage" component={Coverages} />
      <Route path="/coverage/:repoLink" component={Coverage} />
      <Route path="*" component={Error} absoluteFooter={true} />
    </Route>
  </Router>
);
