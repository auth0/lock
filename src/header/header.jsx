import React from 'react';
import Background from './background';
import Welcome from './welcome';
import IconButton from '../icon/button';

export default class Header extends React.Component {
  render() {
    const { backHandler, backgroundColor, backgroundUrl, logoUrl, name, title } = this.props;

    return (
      <div className="auth0-lock-header">
        {backHandler && <IconButton name="back" onClick={backHandler}/>}
        <Background imageUrl={backgroundUrl} backgroundColor={backgroundColor} grayScale={!!name} />
        <Welcome title={title} name={name} imageUrl={name ? undefined : logoUrl} />
      </div>
    );
  }
}

Header.propTypes = {
  backgroundUrl: React.PropTypes.string,
  logoUrl: React.PropTypes.string,
  name: React.PropTypes.string
};
