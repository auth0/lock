import React from 'react';
import SocialButtonsPane from './social_buttons_pane';

export default class AskSocialNetwork extends React.Component {

  render() {
    return <SocialButtonsPane lock={this.props.lock} />;
  }

}

AskSocialNetwork.propTypes = {
  lock: React.PropTypes.object.isRequired
};
