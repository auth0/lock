import React from 'react';
import InputWrap from './input_wrap';
import { countryCodes, country, dialingCode }  from './country_codes';
import { matches } from '../utils/string_utils';

export default class CountryCodeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {search: ""};
  }

  render() {
    return (
      <div>
        <InputWrap isValid={true} name="search">
          <input type="text"
            className="auth0-lock-input"
            value={this.state.search}
            onChange={::this.handleSearchChange}
            autoFocus={this.props.autoFocus} />
        </InputWrap>
        <CountryCodeList countryCodes={::this.filteredCountryCodes()} selectHandler={this.props.selectHandler}/>
      </div>
    )
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});
  }

  filteredCountryCodes() {
    return countryCodes.filter(countryCode => matches(this.state.search, country(countryCode)));
  }
}

class CountryCodeList extends React.Component {
  render() {
    const { countryCodes, selectHandler } = this.props;
    const items = countryCodes.map(countryCode => {
      return <CountryCodeListItem
        dialingCode={dialingCode(countryCode)}
        country={country(countryCode)}
        onClick={selectHandler} />;
    });

    return <div className="auth0-lock-country-code-list">{items}</div>;
  }
}

class CountryCodeListItem extends React.Component {
  render() {
    const { country, dialingCode } = this.props;
    return (
      <div className="auth0-lock-country-code-list-item"
        onClick={::this.handleClick}>
        {country} ({dialingCode})
      </div>
    );
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(this.props.dialingCode);
  }
}
