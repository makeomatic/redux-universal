import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { dummy } from './actions/user' ;

@connect(
  state => ({ meta: state.meta, timeout: state.user.result })
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element,
    meta: PropTypes.object.isRequired,
    timeout: PropTypes.number.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  static fetch({ dispatch }, params) {
    dispatch(dummy(parseInt(params.id || 30, 10)));
  }

  render() {
    return (
      <div>
        <DocumentMeta {...this.props.meta.app} />
        <h1>Hello world: {this.props.timeout}</h1>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
