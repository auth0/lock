import React from 'react';
import Icon from '../icon/icon';
import IconButton from '../icon/button';

export default class ConfirmationPane extends React.Component {

  render() {
    const { backHandler, closeHandler } = this.props;

    return (
      <div className="auth0-lock-confirmation">
        {closeHandler && <IconButton name="close" onClick={closeHandler}/>}
        {backHandler && <IconButton name="back" onClick={backHandler} />}
        <div className="auth0-lock-confirmation-content">
          <Icon name="checkmark" />
          {this.props.children}
        </div>
      </div>
    );
  }

}
