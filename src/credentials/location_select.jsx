import React from 'react';
import LocationIcon from './location_icon';
import * as cc from './country_codes';
import * as su from '../utils/string_utils';

export default class LocationSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {search: ""};
  }

  render() {
    const { autoFocus, selectHandler } = this.props;

    const countryCodes = cc.countryCodes.filter(x => {
      return su.matches(this.state.search, cc.country(x));
    });

    return (
      <div className="auth0-lock-select-country">
        <div className="auth0-lock-search">
          <div className="auth0-lock-input-wrap">
            <LocationIcon />
            <input className="auth0-lock-input auth0-lock-input-search"
              onChange={::this.handleSearchChange}
              type="text"
              placeholder="Select your country"
              autoFocus={autoFocus} />
          </div>
        </div>
        <LocationList countryCodes={countryCodes}
            selectHandler={selectHandler} />
      </div>
    );
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});
  }
}

class LocationList extends React.Component {
  render() {
    const { countryCodes, selectHandler } = this.props;

    const items = countryCodes.map(x => {
      const key = cc.locationString(x).replace(/ /g, '-');

      return (
        <LocationListItem location={x} key={key} onClick={selectHandler} />
      );
    });

    return <div className="auth0-lock-list-code"><ul>{items}</ul></div>;
  }
}

class LocationListItem extends React.Component {
  render() {
    const { location } = this.props;
    return <li onClick={::this.handleClick}>{cc.locationString(location)}</li>;
  }

  handleClick(e) {
    e.preventDefault();
    const { location, onClick } = this.props;
    onClick(location);
  }
}
