import React from 'react';
import Login from '../../database/login';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../lock/pane_separator';

export default class AskSocialNetworkOrLogin extends Login {

  constructor() {
    super();
    this.name = "networkOrLogin";
  }

  render({lock}) {
    return (
      <div>
        <SocialButtonsPane
          lock={lock}
          smallButtonsHeader={this.t(lock, ["smallSocialButtonsHeader"], {__textOnly: true})}
        />
        <PaneSeparator>{this.t(lock, ["separatorText"])}</PaneSeparator>
        {super.render({lock})}
      </div>
    );
  }

}
