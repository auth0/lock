import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { BackButton } from './box/button';
import TextInput from './input/text_input';
import { isSmallScreen } from '../utils/media_utils';
import * as su from '../utils/string_utils';

const cycle = (xs, x) => {
  return xs.skipWhile(y => y !== x).get(1, xs.get(0));
};

export default class FiltrableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filteredItems: props.items, highlighted: props.defaultItem };
  }

  filter(str) {
    const filteredItems = this.props.items.filter(x => {
      return su.matches(str, x.get('label'));
    });

    const highlighted =
      (filteredItems.size === 1 && filteredItems.get(0)) ||
      (filteredItems.includes(this.state.highlighted) && this.state.highlighted) ||
      null;

    return {
      filteredItems: filteredItems,
      highlighted: highlighted
    };
  }

  select(x) {
    this.props.onSelect(x);
  }

  handleChange(e) {
    this.setState(this.filter(e.target.value));
  }

  handleKeyDown(e) {
    const { filteredItems, highlighted } = this.state;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.setState({ highlighted: cycle(filteredItems, highlighted) });
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.setState({ highlighted: cycle(filteredItems.reverse(), highlighted) });
        break;
      case 'Enter':
        e.preventDefault();
        highlighted && this.select(highlighted);
        break;
      case 'Escape':
        e.preventDefault();
        this.props.onCancel();
      default:
      // no-op
    }
  }

  render() {
    const { icon, iconUrl, onCancel } = this.props;
    return (
      <div className="auth0-lock-select-country">
        <div className="auth0-lock-search">
          <BackButton onClick={onCancel} />
          <TextInput
            name="search"
            icon={icon}
            iconUrl={iconUrl}
            isValid={true}
            onChange={::this.handleChange}
            onKeyDown={::this.handleKeyDown}
          />
        </div>
        <List
          highlighted={this.state.highlighted}
          items={this.state.filteredItems}
          onClick={::this.select}
          onMouseMove={x => this.setState({ highlighted: x })}
        />
      </div>
    );
  }
}

class List extends React.Component {
  componentDidUpdate() {
    // Ensure that highlighted item is entirely visible

    // NOTE: I've spent very little time on this. It works, but it
    // surely can be more clearly.

    const { highlighted } = this.refs;

    if (highlighted) {
      const scrollableNode = ReactDOM.findDOMNode(this);
      const highlightedNode = ReactDOM.findDOMNode(highlighted);
      const relativeOffsetTop = highlightedNode.offsetTop - scrollableNode.scrollTop;
      let scrollTopDelta = 0;
      if (relativeOffsetTop + highlightedNode.offsetHeight > scrollableNode.clientHeight) {
        scrollTopDelta =
          relativeOffsetTop + highlightedNode.offsetHeight - scrollableNode.clientHeight;
      } else if (relativeOffsetTop < 0) {
        scrollTopDelta = relativeOffsetTop;
      }

      if (scrollTopDelta) {
        this.preventHighlight = true;
        scrollableNode.scrollTop += scrollTopDelta;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => (this.preventHighlight = false), 100);
      }
    }
  }

  mouseMoveHandler(x) {
    // TODO: This is an ugly hack to avoid highlighting the element under the
    // mouse when an arrow key trigger a scroll of the list (which in turn
    // triggers a mousemove event).
    !this.preventHighlight && this.props.onMouseMove(x);
  }

  mouseLeaveHandler() {
    // TODO: clear highlighted?
  }

  render() {
    const items = this.props.items.map(x => {
      const highlighted = x === this.props.highlighted;

      const props = {
        highlighted: highlighted,
        key: x.get('label'),
        label: x.get('label'),
        onClick: () => this.props.onClick(x),
        onMouseMove: () => this.mouseMoveHandler(x)
      };

      if (highlighted) props.ref = 'highlighted';

      return <Item {...props} />;
    });

    return (
      <div className="auth0-lock-list-code" onMouseLeave={::this.mouseLeaveHandler}>
        <ul>{items}</ul>
      </div>
    );
  }
}

class Item extends React.Component {
  static propTypes = {
    highlighted: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return this.props.highlighted != nextProps.highlighted;
  }

  render() {
    const { highlighted, label, onClick, onMouseMove } = this.props;
    const className = highlighted ? 'auth0-lock-list-code-highlighted' : '';

    return (
      <li className={className} onClick={onClick} onMouseMove={onMouseMove}>
        {label}
      </li>
    );
  }
}
