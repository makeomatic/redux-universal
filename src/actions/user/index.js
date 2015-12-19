import Promise from 'bluebird';
import { createAction } from 'redux-actions';
import { USER_DUMMY, USER_MULTIPLY } from '../../constants/actions.js';

export const dummy = createAction(USER_DUMMY, timeout => {
  return {
    data: timeout,
    promise: Promise.delay(timeout).then(() => {
      return timeout;
    }),
  };
});

export const multiply = createAction(USER_MULTIPLY, (a, b) => {
  return {
    data: [a, b],
    promise: Promise.delay(50).then(() => {
      return a * b;
    }),
  };
});
