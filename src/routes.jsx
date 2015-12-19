import React from 'react';
import { Route } from 'react-router';
import Root from './root.jsx';
import User from './components/User.jsx';

export default (
  <Route name="app" path="/" component={Root}>
    <Route path="/:id" component={User} />
    { /* Catch all route */ }
    <Route path="*" status={404} />
  </Route>
);
