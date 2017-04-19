import PropTypes from 'prop-types';
import React from 'react';
import MFACodePane from '../../field/mfa-code/mfa_code_pane';

export default class MFAPane extends React.Component {
  render() {
    const { mfaInputPlaceholder, i18n, instructions, lock, title } = this.props;

    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;

    const pane = <MFACodePane i18n={i18n} lock={lock} placeholder={mfaInputPlaceholder} />;

    const titleElement = title && <h2>{title}</h2>;

    return <div>{titleElement}{header}{pane}</div>;
  }
}

MFAPane.propTypes = {
  mfaInputPlaceholder: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired,
  instructions: PropTypes.any,
  lock: PropTypes.object.isRequired
};
