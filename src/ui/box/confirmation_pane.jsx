import PropTypes from 'prop-types';
import React from 'react';
import { BackButton, CloseButton } from './button';
import * as l from '../../core/index';

const ConfirmationPane = ({ backHandler, children, closeHandler, svg }) => (
  <div className="auth0-lock-confirmation">
    {closeHandler && <CloseButton id={l.id(lock)} onClick={closeHandler} />}
    {backHandler && <BackButton id={l.id(lock)} onClick={backHandler} />}
    <div className="auth0-lock-confirmation-content">
      <span dangerouslySetInnerHTML={{ __html: svg }} />
      {children}
    </div>
  </div>
);

ConfirmationPane.propTypes = {
  backHandler: PropTypes.func,
  closeHandler: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element).isRequired
  ]),
  svg: PropTypes.string.isRequired
};

export default ConfirmationPane;
