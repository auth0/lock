import React from 'react';
import Icon from './icon';

export default class IconButton extends React.Component {
  render() {
    const { name } = this.props;
    const className = `auth0-lock-${name}-button`;

    return (
      <span className={className} onClick={::this.handleClick}>
        <Icon name={this.props.name} />
      </span>
    )
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick();
  }
}

IconButton.propTypes = {
  name: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired
};
