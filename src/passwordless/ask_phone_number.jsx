import React from 'react';
import CredPane from '../lock/cred_pane';
import PhoneNumberInput from '../cred/phone_number_input';
import LocationInput from '../cred/location_input';
import AskLocation from './ask_location';
import { changePhoneNumber, selectPhoneLocation } from './actions';
import * as c from '../cred/index';
import * as l from '../lock/index';
import * as m from './index';

export default class AskPhoneNumber extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (m.selectingLocation(this.props.lock) && !m.selectingLocation(nextProps.lock)) {
      setTimeout(() => {
        if (c.phoneNumber(nextProps.lock)) {
          this.refs.cred.focusSubmit();
        } else {
          this.refs.phoneNumber.focus();
        }
      }, 17);
    }
  }

  render() {
    const { lock } = this.props;
    const auxiliaryPane = m.selectingLocation(lock) ?
      <AskLocation key="auxiliarypane" lock={lock} /> : null;
    const terms = this.t(["footerText"]);

    return (
      <CredPane lock={lock} auxiliaryPane={auxiliaryPane} className="auth0-lock-intro" terms={terms} ref="cred">
        <div className="auth0-lock-passwordless auth0-lock-mode">
          <div className="auth0-lock-form auth0-lock-passwordless">
          <p>{this.t(["headerText"])}</p>
            <LocationInput value={c.phoneLocationString(lock)}
              onClick={::this.handleLocationClick}
              tabIndex={l.tabIndex(lock, 1)} />
            <PhoneNumberInput ref="phoneNumber"
              value={c.phoneNumber(lock)}
              isValid={!c.visiblyInvalidPhoneNumber(lock)}
              onChange={::this.handlePhoneNumberChange}
              autoFocus={l.ui.focusInput(lock)}
              placeholder={this.t(["phoneNumberInputPlaceholder"], {__textOnly: true})}
              tabIndex={l.tabIndex(lock, 2)}
              disabled={l.submitting(lock)} />
          </div>
        </div>
      </CredPane>
    );
  }

  handlePhoneNumberChange(e) {
    changePhoneNumber(l.id(this.props.lock), e.target.value);
  }

  handleLocationClick() {
    selectPhoneLocation(l.id(this.props.lock));
  }

  componentWillSlideIn(...args) {
    return this.refs.cred.componentWillSlideIn(...args);
  }

  componentDidSlideIn(...args) {
    return this.refs.cred.componentDidSlideIn(...args);
  }

  componentWillSlideOut(...args) {
    return this.refs.cred.componentWillSlideOut(...args);
  }

  t(keyPath, params) {
    return l.ui.t(this.props.lock, ["phone"].concat(keyPath), params);
  }
}
