import React from 'react';
import Background from './background';
import Welcome from './welcome';


export default class Header extends React.Component {
  render() {
    const { name, logoUrl, backgroundUrl } = this.props;

    return (
      <div className="auth0-lock-header">
        <Background imageUrl={backgroundUrl} grayScale={!!name} />
        <Welcome name={name} imageUrl={!name && logoUrl} />
      </div>
    );
  }
}

Header.propTypes = {
  backgroundUrl: React.PropTypes.string,
  logoUrl: React.PropTypes.string,
  name: React.PropTypes.string
};
