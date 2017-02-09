import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Layout from './layout/layout';
import Main from './main/main';
import Coverages from './coverage/coverages';
import Coverage from './coverage/coverage';
import CoverageFile from './coverage/coverageFile';
import Error from './error/error';

export default (
  <Router history={browserHistory}>
    <Route component={Layout}>
      <Route path="/" component={Main} />
      <Route path="/coverage" component={Coverages} />
      <Route path="/coverage/:source/:owner/" component={Coverages} />
      <Route path="/coverage/:source/:owner/:name" component={Coverage} />
      <Route path="/coverage/:source/:owner/:name/:file" component={CoverageFile} />
      <Route path="*" component={Error} />
    </Route>
  </Router>
);
