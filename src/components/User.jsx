import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { multiply } from '../modules/user';
import { fetch } from '../redux-prefetch';

function prefetch({ dispatch, getState, waitFor }, params) {
  return waitFor('root').then(() => {
    return dispatch(multiply(getState().user.result, params.id));
  });
}
@fetch('user', prefetch)
@connect(state => ({ multiply: state.user.multiply }))
export default class User extends Component {
  static propTypes = {
    multiply: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    params: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <h2>Child: {this.props.userId}</h2>
        <div>Multiply: {this.props.multiply}</div>
      </div>
    );
  }
}
