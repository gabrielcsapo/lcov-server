import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Layout from './layout';
import Main from './main';
import List from './coverage/list';
import Coverage from './coverage/coverage';
import File from './coverage/file';
import Error from './components/error';

export default (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route path="/coverage/:source/:owner/:name/:file" component={File} />
        <Route path="/coverage/:source/:owner/:name" component={Coverage} />
        <Route path="/coverage/:source/:owner/:page?" component={List} />
        <Route path="/coverage/:page?" component={List} />
        <Route exact path="/" component={Main} />
        <Route path="*" component={Error} />
      </Switch>
    </Layout>
  </BrowserRouter>
);
