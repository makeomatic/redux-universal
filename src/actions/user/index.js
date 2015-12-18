import Promise from 'bluebird';
import { createAction } from 'redux-actions';
import { USER_DUMMY } from '../../constants/actions.js';

export const dummy = createAction(USER_DUMMY, timeout => {
  return {
    data: timeout,
    promise: Promise.delay(timeout).then(() => {
      return timeout;
    }),
  };
});
