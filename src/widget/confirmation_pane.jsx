import React from 'react';
import Icon from '../icon/icon';
import { BackButton, CloseButton } from './button';

export default class ConfirmationPane extends React.Component {

  render() {
    const { backHandler, closeHandler } = this.props;

    return (
      <div className="auth0-lock-confirmation">
        {closeHandler && <CloseButton onClick={closeHandler}/>}
        {backHandler && <BackButton onClick={backHandler} />}
        <div className="auth0-lock-confirmation-content">
          <Icon name="checkmark" />
          {this.props.children}
        </div>
      </div>
    );
  }

}
