import React from 'react';
import Icon from './icon';
import WelcomeMessage from './welcome_message';

export default class Welcome extends React.Component {
  render() {
    const { name, imageUrl, title } = this.props;

    return (
      <div className="auth0-lock-header-welcome">
        {imageUrl && <Icon imageUrl={imageUrl} />}
        <WelcomeMessage title={title} name={name}/>
      </div>
    );
  }
}

Welcome.propTypes = {
  imageUrl: React.PropTypes.string,
  name: React.PropTypes.string
};
