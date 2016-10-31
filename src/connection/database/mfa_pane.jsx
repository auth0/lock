import React from 'react';
import MFACodePane from '../../field/mfa-code/mfa_code_pane';

export default class MFAPane extends React.Component {

  render() {
    const {
      mfaInputPlaceholder,
      i18n,
      instructions,
      lock,
      title
    } = this.props;

    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;

    const pane = (<MFACodePane
        i18n={i18n}
        lock={lock}
        placeholder={mfaInputPlaceholder}
      />);

    const titleElement = title && <h2>{ title }</h2>;

    return (<div>{titleElement}{header}{pane}</div>);
  }

}

MFAPane.propTypes = {
  mfaInputPlaceholder: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  i18n: React.PropTypes.object.isRequired,
  instructions: React.PropTypes.any,
  lock: React.PropTypes.object.isRequired
};
