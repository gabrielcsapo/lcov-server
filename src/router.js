import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import Layout from './layout';
import Main from './main';
import Coverages from './coverage/coverages';
import Coverage from './coverage/coverage';
import File from './coverage/file';
import Error from './components/error';

export default (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route path="/coverage/:source/:owner/:name/:file" component={File} />
        <Route path="/coverage/:source/:owner/:name" component={Coverage} />
        <Route path="/coverage/:source/:owner/" component={Coverages} />
        <Route path="/coverage" component={Coverages} />
        <Route exact path="/" component={Main} />
        <Route path="*" component={Error} />
      </Switch>
    </Layout>
  </BrowserRouter>
);
