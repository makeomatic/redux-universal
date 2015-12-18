import React from 'react';
import { Route } from 'react-router';
import Root from './root.jsx';

module.exports = (
  <Route name="app" path="/" component={Root}>

    { /* Catch all route */ }
    <Route path="*" status={404} />
  </Route>
);
