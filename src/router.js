import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

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
      <Route path="/coverage/:repoLink" component={Coverage} />
      <Route path="/coverage/:repoLink/file/:fileName" component={CoverageFile} />
      <Route path="*" component={Error} />
    </Route>
  </Router>
);
