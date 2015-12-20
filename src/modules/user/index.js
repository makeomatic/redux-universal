import Promise from 'bluebird';
import { USER_DUMMY, USER_MULTIPLY } from '../../constants/actions.js';
import { handleActions, createAction } from 'redux-actions';

const initialState = {
  loaded: false,
  loading: false,
  error: null,
  result: null,
  promises: null,
  multiply: 0,
};

// REDUCERS
export default handleActions({
  [`${USER_DUMMY}_PENDING`]: (state) => ({
    ...state,
    loading: true,
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

// ACTIONS
export const dummy = createAction(USER_DUMMY, timeout => {
  return {
    data: timeout,
    promise: Promise.delay(timeout).then(() => {
      return timeout;
    }),
  };
});

export const multiply = createAction(USER_MULTIPLY, (a, b) => ({
  promise: Promise.delay(50).then(() => {
    return a * b;
  }),
}));
