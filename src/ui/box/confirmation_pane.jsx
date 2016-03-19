import React from 'react';
import { BackButton, CloseButton } from './button';

const ConfirmationPane = ({backHandler, children, closeHandler, svg}) => (
  <div className="auth0-lock-confirmation">
    {closeHandler && <CloseButton onClick={closeHandler}/>}
    {backHandler && <BackButton onClick={backHandler} />}
    <div className="auth0-lock-confirmation-content">
      <span dangerouslySetInnerHTML={{__html: svg}} />
      {children}
    </div>
  </div>
);

ConfirmationPane.propTypes = {
  backHandler: React.PropTypes.func,
  closeHandler: React.PropTypes.func,
  children: React.PropTypes.oneOfType([
    React.PropTypes.element.isRequired,
    React.PropTypes.arrayOf(React.PropTypes.element).isRequired
  ]),
  svg: React.PropTypes.string.isRequired
};

export default ConfirmationPane;
