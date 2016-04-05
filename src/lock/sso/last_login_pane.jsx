import React from 'react';
import QuickAuthPane from '../../ui/pane/quick_auth_pane';
import { signIn, skipSSOLogin } from './actions';
import { lastUsedConnection, lastUsedUsername } from './index';
import * as l from '../index';

export default class LastLoginPane extends React.Component {

  handleButtonClick(e) {
    e.preventDefault();
    const { lock } = this.props;
    signIn(l.id(lock), lastUsedConnection(lock));
  }

  handleAlternativeClick(e) {
    e.preventDefault();
    // TODO: instead of calling skipSSOLogin we should have something
    // generic for this quick logins.
    skipSSOLogin(l.id(this.props.lock));
  }

  render() {
    const { header, lock, skipLastLoginLabel } = this.props;

    return (
      <QuickAuthPane
        alternativeLabel={skipLastLoginLabel}
        alternativeClickHandler={::this.handleAlternativeClick}
        buttonLabel={lastUsedUsername(lock)}
        buttonClickHandler={::this.handleButtonClick}
        header={header}
        strategy={lastUsedConnection(lock).strategy}
      />
    );
  }

}

LastLoginPane.propTypes = {
  header: React.PropTypes.element,
  lock: React.PropTypes.object.isRequired,
  skipLastLoginLabel: React.PropTypes.string.isRequired
};
