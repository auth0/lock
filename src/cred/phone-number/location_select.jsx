import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '../../icon/icon';
import IconButton from '../../icon/button';
import * as cc from '../country_codes';
import * as su from '../../utils/string_utils';
import { isSmallScreen } from '../../utils/media_utils';

function cycle(xs, x) {
  const next = xs.skipWhile(y => y !== x).get(1);
  return next || xs.get(0);
}

export default class LocationSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filteredCountryCodes: cc.countryCodes, highlighted: null};
    if (props.initialLocationSearchStr) {
      this.state = this.filter(props.initialLocationSearchStr);
    }
  }

  componentDidMount() {
    if (!isSmallScreen()) {
      setTimeout(() => {
        const node = this.refs.input;
        node.focus();
        if (node.setSelectionRange) {
          const length = node.value.length;
          node.setSelectionRange(length, length);
        } else {
          node.value = node.value;
        }
      }, 300);
    }
  }

  render() {
    const {
      initialLocationSearchStr,
      locationFilterInputPlaceholder,
      selectHandler
    } = this.props;

    const { filteredCountryCodes, highlighted } = this.state;

    return (
      <div className="auth0-lock-select-country">
        <div className="auth0-lock-search">
          <IconButton name="back" onClick={::this.cancel} />
          <div className="auth0-lock-input-wrap">
            <Icon name="location"/>
            <input ref="input"
              className="auth0-lock-input auth0-lock-input-search"
              defaultValue={initialLocationSearchStr}
              onChange={::this.handleSearchChange}
              onKeyDown={::this.handleKeyDown}
              type="text"
              placeholder={locationFilterInputPlaceholder} />
          </div>
        </div>
        <LocationList countryCodes={filteredCountryCodes}
          highlighted={highlighted}
          highlightHandler={::this.handleHighlight}
          selectHandler={selectHandler} />
      </div>
    );
  }

  filter(str) {
    const findNewHighlighted = (countryCodes, highlighted) => {
      if (countryCodes.size === 1) {
        return countryCodes.get(0);
      }

      return countryCodes.includes(highlighted) ? highlighted : null;
    }

    const filteredCountryCodes = cc.find(str);

    const { highlighted } = this.state;
    const newHighlighted = findNewHighlighted(filteredCountryCodes, highlighted);

    return {
      filteredCountryCodes: filteredCountryCodes,
      highlighted: newHighlighted
    };
  }

  handleSearchChange(e) {
    this.setState(this.filter(e.target.value));
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

  selectHighlighted() {
    const { highlighted } = this.state;
    if (highlighted) {
      this.props.selectHandler(highlighted);
    }
  }

  cancel() {
    this.props.cancelHandler();
  }

  handleKeyDown(e) {
    switch(e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.highlightNext();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.highlightPrev();
        break;
      case "Enter":
        e.preventDefault();
        this.selectHighlighted();
        break;
      case "Escape":
        e.preventDefault();
        this.cancel();
      default:
        // no-op
    }
  }
}

class LocationList extends React.Component {
  componentDidUpdate() {
    // NOTE: I've spent very little time on this. It works, but it surely can be
    // expressed more clearly.
    const { highlighted } = this.refs;
    if (highlighted) {
      const scrollableNode = ReactDOM.findDOMNode(this);
      const highlightedNode = ReactDOM.findDOMNode(highlighted);
      const relativeOffsetTop = highlightedNode.offsetTop - scrollableNode.scrollTop;
      let scrollTopDelta = 0;
      if (relativeOffsetTop + highlightedNode.offsetHeight > scrollableNode.clientHeight) {
        scrollTopDelta = relativeOffsetTop + highlightedNode.offsetHeight - scrollableNode.clientHeight;
      } else if (relativeOffsetTop < 0) {
        scrollTopDelta = relativeOffsetTop;
      }

      if (scrollTopDelta) {
        this.preventHighlight = true;
        scrollableNode.scrollTop += scrollTopDelta;
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => this.preventHighlight = false, 100);
      }
    }
  }

  render() {
    const { countryCodes, highlighted, highlightHandler, selectHandler } = this.props;

    const items = countryCodes.map(x => {
      const props = {
        location: x,
        key: cc.locationString(x).replace(/ /g, '-'),
        highlightHandler: ::this.handleHighlight,
        selectHandler: selectHandler
      };

      if (highlighted === x) {
        props.highlighted = true;
        props.ref = "highlighted";
      }

      return <LocationListItem {...props} />
    });

    return (
      <div className="auth0-lock-list-code" onMouseLeave={::this.handleMouseLeave}>
        <ul>{items}</ul>
      </div>
    );
  }

  handleHighlight(location) {
    // TODO: This is an ugly hack to avoid highlighting the element under the
    // mouse when an arrow key trigger a scroll of the list (which in turn
    // triggers a mousemove event).
    !this.preventHighlight && this.props.highlightHandler(location);
  }

  handleMouseLeave() {
    this.props.highlightHandler(null);
  }
}

class LocationListItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.highlighted != nextProps.highlighted;
  }

  render() {
    const { highlighted, location } = this.props;
    const className = highlighted ? "auth0-lock-list-code-highlighted" : "";

    return (
      <li className={className}
        onClick={::this.handleClick}
        onMouseMove={::this.handleMouseMove}>
          {`${cc.dialingCode(location)} ${cc.isoCode(location)} ${cc.country(location)}`}
      </li>
    );
  }

  handleClick(e) {
    e.preventDefault();
    const { location, selectHandler } = this.props;
    selectHandler(location);
  }

  handleMouseMove(e) {
    const { location, highlightHandler } = this.props;
    highlightHandler(location);
  }
}
