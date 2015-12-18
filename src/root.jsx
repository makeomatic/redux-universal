import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';

@connect(state => ({ meta: state.meta }))
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <DocumentMeta {...this.props.meta.app} />
        <h1>Hello world</h1>
      </div>
    );
  }
}
