import React from 'react';
import SocialButton from './social_button';
import * as l from '../../lock/index';
import { useBigButtons } from '../../social/index';
export default class SocialButtonsPane extends React.Component {

  render() {
    const { lock, showLoading, smallButtonsHeader } = this.props;

    const header = !useBigButtons(lock)
      && smallButtonsHeader
      && <p className="auth-lock-small-social-buttons-header">
           {smallButtonsHeader}
         </p>;

    const buttons = l.ui.connections(lock).map(x => (
      <SocialButton key={x.name} connection={x} lock={lock} />
    ));

    const loading = showLoading
      && <div className="auth0-loading-container">
           <div className="auth0-loading" />
         </div>;

    return (
      <div className="auth-lock-social-buttons-pane">
        {header}
        <div className="auth0-lock-social-buttons-container">{buttons}</div>
        {loading}
      </div>
    );
  }

}

SocialButtonsPane.propTypes = {
  lock: React.PropTypes.object.isRequired,
  showLoading: React.PropTypes.bool.isRequired,
  smallButtonsHeader: React.PropTypes.string
};

SocialButtonsPane.defaultProps = {
  showLoading: false
};
