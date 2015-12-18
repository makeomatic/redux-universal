import Promise from 'bluebird';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import reducers from '../reducers';
import { syncReduxAndRouter } from 'redux-simple-router';
import { canUseDOM as isBrowser } from 'fbjs/lib/ExecutionEnvironment';
import iterator from 'lodash/object/forOwn';

function createResolver(getState, pendingActions) {
  return function resolve(dispatch, components, params) {
    return Promise
      .filter(components, component => component && typeof component.fetch === 'function')
      .map(component => component.fetch(dispatch, params))
      .then(() => Promise.all(pendingActions))
      .reflect()
      .then(getState)
      .tap(function cleanupPendingActions() {
        pendingActions.splice(0, -1);
      });
  };
}

function createAsyncResolver(pendingActions) {
  return function asyncResolver() {
    return function middleware(next) {
      return function actionMapper(action) {
        const resultingAction = next(action);
        const promises = [];

        iterator(resultingAction.payload, prop => {
          if (prop && typeof prop === 'object' && typeof prop.then === 'function') {
            promises.push(prop);
          }
        });

        if (promises.length > 0) {
          pendingActions.push(...promises);
        }

        return resultingAction;
      };
    };
  };
}

export default function returnStore(history, initialState) {
  const middleware = [promiseMiddleware()];
  const pendingActions = [];

  if (!isBrowser) {
    middleware.unshift(createAsyncResolver(pendingActions));
  }

  const addMiddleware = applyMiddleware(...middleware);
  const initStore = addMiddleware(createStore);
  const store = initStore(reducers, initialState);

  syncReduxAndRouter(history, store);

  if (!isBrowser) {
    // this is a one-time store, therefore we throw it away and it won't be leaked
    store.resolve = createResolver(store.getState, pendingActions);
  }

  return store;
}
