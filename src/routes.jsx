import React from 'react';
import { Route } from 'react-router';
import Root from './root.jsx';

export default (
  <Route name="app" path="/" component={Root}>
    { /* Catch all route */ }
    <Route path="*" status={404} />
  </Route>
);
