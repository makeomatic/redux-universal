import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './routes';
import createStore from './store/create';

const history = createBrowserHistory();
const store = createStore(history, window.__APP_STATE__);
const target = document.getElementById('app');
const data = (
  <Provider store={store} key="provider">
    <Router history={history} routes={routes} />
  </Provider>
);

ReactDOM.render(data, target);
