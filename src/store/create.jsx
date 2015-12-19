import Promise from 'bluebird';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import reducers from '../reducers';
import { syncReduxAndRouter } from 'redux-simple-router';
import { canUseDOM as isBrowser } from 'fbjs/lib/ExecutionEnvironment';
import iterator from 'lodash/object/forOwn';

function createResolver(store, pendingActions) {
  return function resolve(components, params) {
    return Promise
      .filter(components, component => component && typeof component.fetch === 'function')
      .then(function iterateOverComponents(filteredComponents) {
        return Promise
          .map(filteredComponents, component => component.fetch(store, params))
          .then(() => {
            const queue = [].concat(pendingActions);
            pendingActions.splice(0, pendingActions.length);
            return Promise.all(queue);
          })
          .reflect()
          .then(() => {
            if (pendingActions.length > 0) {
              return iterateOverComponents(filteredComponents);
            }
          })
          .then(store.getState);
      });
  };
}

function createAsyncResolver(pendingActions) {
  return function asyncResolver(store) {
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
          store.dispatch({
            type: `${action.type}_PROMISE`,
            payload: {
              promises,
            },
          });
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
    store.resolve = createResolver(store, pendingActions);
  }

  return store;
}
