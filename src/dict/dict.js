import React from 'react';
import * as l from '../lock/index';

export default class Dict extends React.Component {
  render() {
    const { lock, keyPath, params } = this.props;
    const html = l.ui.dict(lock).get(keyPath, params) || null;
    return html && <span dangerouslySetInnerHTML={{__html: html}} />;
  }
}
