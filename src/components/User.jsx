import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { multiply } from '../actions/user';

@connect(
  state => ({ multiply: state.user.multiply })
)
export default class User extends Component {
  static propTypes = {
    multiply: PropTypes.number.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  static fetch({ getState, dispatch }, params) {
    // option 2: multiply action requires state data to be fetched?
    return getState().user.promises.then(() => {
      dispatch(multiply(getState().user.result, params.id));
    });
  }

  render() {
    return (
      <div>
        <h2>Child: {this.props.multiply}</h2>
      </div>
    );
  }
}
