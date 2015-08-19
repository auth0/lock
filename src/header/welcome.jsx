import React from 'react';
import Icon from './icon';
import WelcomeMessage from './welcome_message';

export default class Welcome extends React.Component {
  render() {
    const { name, imageUrl } = this.props;

    return (
      <div className="auth0-lock-header-welcome">
        {imageUrl && <Icon />}
        <WelcomeMessage name={name}/>
      </div>
    );
  }
}

Welcome.propTypes = {
  imageUrl: React.PropTypes.string,
  name: React.PropTypes.string
};
