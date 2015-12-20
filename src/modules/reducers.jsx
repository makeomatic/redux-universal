import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import { prefetchReducer } from '../redux-prefetch';
import userReducer from './user';

export default combineReducers({
  user: userReducer,
  routing: routeReducer,
  prefetching: prefetchReducer,
  meta: (meta) => ({ ...meta }),
});
