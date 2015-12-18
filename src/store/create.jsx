import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import reducers from '../reducers';
import { syncReduxAndRouter } from 'redux-simple-router';

export default function returnStore(history, initialState) {
  const middleware = applyMiddleware(promiseMiddleware());
  const store = middleware(createStore)(reducers, initialState);
  syncReduxAndRouter(history, store);
  return store;
}
