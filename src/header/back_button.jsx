import React from 'react';

export default class BackButton extends React.Component {
  render() {
    const svgTag = '<svg enable-background="new 0 0 24 24" version="1.0" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="auth0-lock-go-back"> <polyline fill="none" points="12.5,21 3.5,12 12.5,3 " stroke="#000000" stroke-miterlimit="10" stroke-width="2"></polyline> <line fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="2" x1="22" x2="3.5" y1="12" y2="12"></line> </svg>';
    return <span dangerouslySetInnerHTML={{__html: svgTag}} onClick={::this.handleClick}/>;
  }

  handleClick(e) {
    e.preventDefault();
    const { onClick, lockID } = this.props;
    onClick(lockID);
  }

}

BackButton.propTypes = {
  lockID: React.PropTypes.string.isRequred,
  onClick: React.PropTypes.func.isRequired
};
