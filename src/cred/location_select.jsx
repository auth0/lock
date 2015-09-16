import React from 'react';
import Icon from '../icon/icon';
import * as cc from './country_codes';
import * as su from '../utils/string_utils';

export default class LocationSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {search: "", highlighted: null};
  }

  render() {
    const { autoFocus, selectHandler } = this.props;
    const { highlighted } = this.state;

    const countryCodes = cc.countryCodes.filter(x => {
      return su.matches(this.state.search, cc.country(x));
    });

    return (
      <div className="auth0-lock-select-country">
        <div className="auth0-lock-search">
          <div className="auth0-lock-input-wrap">
            <Icon name="location"/>
            <input className="auth0-lock-input auth0-lock-input-search"
              onChange={::this.handleSearchChange}
              type="text"
              placeholder="Select your country"
              autoFocus={autoFocus} />
          </div>
        </div>
        <LocationList countryCodes={countryCodes}
          highlighted={highlighted}
          highlightHandler={::this.handleHighlight}
          selectHandler={selectHandler} />
      </div>
    );
  }

  handleSearchChange(e) {
    this.setState({search: e.target.value});
  }

  handleHighlight(location) {
    this.setState({highlighted: location});
  }
}

class LocationList extends React.Component {
  render() {
    const { countryCodes, highlighted, highlightHandler, selectHandler } = this.props;

    const items = countryCodes.map(x => {
      const key = cc.locationString(x).replace(/ /g, '-');

      return (
        <LocationListItem location={x}
          key={key}
          highlighted={highlighted === x}
          highlightHandler={highlightHandler}
          selectHandler={selectHandler} />
      );
    });

    return (
      <div className="auth0-lock-list-code" onMouseLeave={::this.handleMouseLeave}>
        <ul>{items}</ul>
      </div>
    );
  }

  handleMouseLeave() {
    this.props.highlightHandler(null);
  }
}

class LocationListItem extends React.Component {
  render() {
    const { highlighted, location } = this.props;
    const className = highlighted ? "auth0-lock-list-code-highlighted" : "";

    return (
      <li className={className}
        onClick={::this.handleClick}
        onMouseEnter={::this.handleMouseEnter}>
          {cc.locationString(location)}
      </li>
    );
  }

  handleClick(e) {
    e.preventDefault();
    const { location, selectHandler } = this.props;
    selectHandler(location);
  }

  handleMouseEnter(e) {
    const { location, highlightHandler } = this.props;
    highlightHandler(location);
  }
}
