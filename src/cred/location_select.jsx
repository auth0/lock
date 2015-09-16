import React from 'react';
import Icon from '../icon/icon';
import * as cc from './country_codes';
import * as su from '../utils/string_utils';

function cycle(xs, x) {
  const next = xs.skipWhile(y => y !== x).get(1);
  return next || xs.get(0);
}

export default class LocationSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filteredCountryCodes: cc.countryCodes, highlighted: null};
  }

  render() {
    const { autoFocus, selectHandler } = this.props;
    const { filteredCountryCodes, highlighted } = this.state;

    return (
      <div className="auth0-lock-select-country">
        <div className="auth0-lock-search">
          <div className="auth0-lock-input-wrap">
            <Icon name="location"/>
            <input className="auth0-lock-input auth0-lock-input-search"
              onChange={::this.handleSearchChange}
              onKeyDown={::this.handleKeyDown}
              type="text"
              placeholder="Select your country"
              autoFocus={autoFocus} />
          </div>
        </div>
        <LocationList countryCodes={filteredCountryCodes}
          highlighted={highlighted}
          highlightHandler={::this.handleHighlight}
          selectHandler={selectHandler} />
      </div>
    );
  }

  handleSearchChange(e) {
    const filteredCountryCodes = cc.countryCodes.filter(x => {
      return su.matches(e.target.value, cc.country(x));
    });

    this.setState({filteredCountryCodes: filteredCountryCodes});
  }

  handleHighlight(location) {
    this.setState({highlighted: location});
  }

  highlightPrev() {
    const { filteredCountryCodes, highlighted } = this.state;
    this.setState({highlighted: cycle(filteredCountryCodes.reverse(), highlighted)});
  }

  highlightNext() {
    const { filteredCountryCodes, highlighted } = this.state;
    this.setState({highlighted: cycle(filteredCountryCodes, highlighted)});
  }

  handleKeyDown(e) {
    switch(e.key) {
      case "ArrowUp":
        e.preventDefault();
        this.highlightPrev();
        break;
      case "ArrowDown":
        e.preventDefault();
        this.highlightNext();
        break;
      default:
        // no-op
    }
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
