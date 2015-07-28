import React from 'react';
import CountryCodeSelect from '../credentials/country_code_select';
import { changeCountryCode } from './actions';
import { ui } from '../lock/index';

export default class SelectCountryCode extends React.Component {
  render() {
    return (
      <div>
        <CountryCodeSelect autoFocus={ui.focusInput(this.props.lock)}
          selectHandler={::this.countryCodeSelectHandler} />
      </div>
    );
  }

  countryCodeSelectHandler(countryCode) {
    changeCountryCode(this.props.lock.get("id"), countryCode);
  }
}
