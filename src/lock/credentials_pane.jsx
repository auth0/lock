import React from 'react/addons';
import GlobalError from './global_error';
import SubmitButton from './submit_button';
import Header from '../header/header';

const ReactTransitionGroup = React.addons.TransitionGroup;

export default class CredentialsPane extends React.Component {
  render() {
    const { name, backgroundUrl, icon, globalError, lock, disableSubmit } = this.props;

    return (
      <div className="auth0-lock-intro">
        <Header name={name} backgroundUrl={backgroundUrl} logoUrl={icon}/>
        <ReactTransitionGroup>
          {globalError && <GlobalError key="globalerror" message={globalError} />}
        </ReactTransitionGroup>
        <div className="auth0-lock-content">
          {this.props.children}
        </div>
        <SubmitButton disabled={disableSubmit} />
      </div>
    );
  }
}
