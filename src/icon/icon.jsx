import React from 'react';
import { iconTag } from './index';

export default class Icon extends React.Component {
  render() {
    return <span dangerouslySetInnerHTML={{__html: iconTag(this.props.name)}} />;
  }
}
