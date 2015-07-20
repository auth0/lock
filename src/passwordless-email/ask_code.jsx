import React from 'react';
import CodeInput from '../forms/code_input';
import { changeCode } from './actions';

export default class AskCode extends React.Component {
  render() {
    const { lock } = this.props;
    const autoFocus = lock.getIn(["showOptions", "focusInput"]);

    return (
      <div className="auth0-lock-content">
        <div className="auth0-lock-instructions">
          We sent you a code to sign in. <br/>
          Please check your inbox.
        </div>
        <CodeInput value={lock.get("code")}
          isValid={true}
          disabled={lock.get("submitting")}
          onChange={::this.handleCodeChange}
          autoFocus={autoFocus} />
      </div>
    );
  }

  handleCodeChange(e) {
    const lockID = this.props.lock.get('id');
    const code = e.target.value;
    changeCode(lockID, code);
  }
}
