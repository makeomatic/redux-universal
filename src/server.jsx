import React from 'react';
import merge from 'lodash/object/merge';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import routes from './routes';
import createStore from './store/create';
import metaState from './constants/config.js';
import HTML from './components/HTML';
import { Provider } from 'react-redux';
import serialize from 'serialize-javascript';
import assets from '../assets/rev-manifest.json';
import DocumentMeta from 'react-document-meta';

export default function middleware(config = {}) {
  const meta = merge({}, metaState, config);
  const client = meta.host + meta.assets + '/' + assets['browser.js'];

  return function serveRoute(req, res, next) {
    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
      if (err) {
        return next(err);
      }

      if (redirectLocation) {
        res.setHeader('Location', redirectLocation.pathname + redirectLocation.search);
        res.send(302);
        return next(false);
      }

      if (!renderProps) {
        return next('route');
      }

      const { history } = renderProps;
      const { listen: _listen } = history;
      history.listen = callback => {
        return _listen.call(history, (_, nextState) => {
          return callback(nextState.location);
        });
      };
      const store = createStore(history, { meta });

      store.resolve(store.dispatch, renderProps.components, renderProps.params).then(state => {
        const exposed = 'window.__APP_STATE__=' + serialize(state) + ';';
        const page = renderToString(
          <Provider store={store}>
            <RoutingContext {...renderProps} />
          </Provider>
        );
        const html = renderToStaticMarkup(<HTML meta={DocumentMeta.renderAsHTML()} markup={page} version="0.14.3" state={exposed} client={client} />);

        res.setHeader('content-type', 'text/html');
        res.send(200, '<!DOCTYPE html>' + html);
        return next(false);
      });
    });
  };
}
