import Promise from 'bluebird';
import { USER_DUMMY, USER_MULTIPLY } from '../../constants/actions.js';
import { handleActions } from 'redux-actions';

const initialState = {
  loaded: false,
  loading: false,
  error: null,
  result: null,
  promises: null,
  multiply: 0,
};

export default handleActions({
  [`${USER_DUMMY}_PENDING`]: (state) => ({
    ...state,
    loading: true,
  }),

  [`${USER_DUMMY}_PROMISE`]: (state, action) => ({
    ...state,
    promises: Promise.all(action.payload.promises),
  }),

  [`${USER_DUMMY}_FULFILLED`]: (state, action) => ({
    ...state,
    loading: false,
    loaded: true,
    promises: null,
    result: action.payload,
  }),

  [`${USER_MULTIPLY}_FULFILLED`]: (state, action) => ({
    ...state,
    promises: null,
    multiply: action.payload,
  }),
}, initialState);
