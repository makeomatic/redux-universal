import { USER_DUMMY } from '../../constants/actions.js';
import { handleActions } from 'redux-actions';

const initialState = {
  loaded: false,
  loading: false,
  error: null,
  result: null,
};

export default handleActions({
  [`${USER_DUMMY}_PENDING`]: (state) => ({
    ...state,
    loading: true,
  }),

  [`${USER_DUMMY}_FULFILLED`]: (state, action) => ({
    ...state,
    loading: false,
    loaded: true,
    result: action.payload,
  }),
}, initialState);
