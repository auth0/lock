import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import CSSCore from '../../CSSCore';

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { children: { current: props.children } };
    this.childRefs = {};
  }

  // eslint-disable-next-line react/no-deprecated
  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: take a prop to identify what are we rendering instead of
    // inferring it from children keys so we can accept more than one
    // child (we are already wrapping them).
    if (this.state.children.current.key != nextProps.children.key) {
      this.setState({
        children: {
          current: nextProps.children,
          prev: this.state.children.current
        },
        transitionName: this.props.transitionName
      });
      this.animate = true;
    } else if (!this.timeout) {
      this.setState({
        children: { current: nextProps.children },
        transitionName: nextProps.transitionName
      });
    }
  }

  componentDidUpdate() {
    if (this.animate) {
      this.animate = false;

      const { transitionName } = this.state;
      const { current, prev } = this.state.children;
      const { reverse } = this.props;
      const currentComponent = this.childRefs[current.key] && this.childRefs[current.key].current;
      const prevComponent = this.childRefs[prev.key] && this.childRefs[prev.key].current;

      const transition = (component, className, delay) => {
        // Get the DOM node directly from the component's node property
        const node = component?.node;
        if (!node) return;

        const activeClassName = `${className}-active`;

        CSSCore.addClass(node, className);

        setTimeout(() => CSSCore.addClass(node, activeClassName), 17);

        if (delay) {
          setTimeout(() => {
            CSSCore.removeClass(node, className);
            CSSCore.removeClass(node, activeClassName);
          }, delay);
        }
      };

      const callback = slide => {
        currentComponent.componentWillSlideIn(slide);
        const classNamePrefix = reverse ? 'reverse-' : '';
        transition(currentComponent, `${classNamePrefix}${transitionName}-enter`, this.props.delay);
        transition(prevComponent, `${classNamePrefix}${transitionName}-exit`);

        this.timeout = setTimeout(() => {
          this.setState({
            children: { current: this.state.children.current },
            transitionName: this.props.transitionName
          });
          currentComponent.componentDidSlideIn(::this.props.onDidAppear);
          this.props.onDidSlide();
          this.timeout = null;
        }, this.props.delay);
      };

      this.props.onWillSlide();
      prevComponent.componentWillSlideOut(callback);
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  render() {
    const { current, prev } = this.state.children;
    const children = prev ? [current, prev] : [current];
    const childrenToRender = children.map(child => {
      // Create a ref for this child if it doesn't exist
      if (!this.childRefs[child.key]) {
        this.childRefs[child.key] = React.createRef();
      }

      return React.cloneElement(React.createElement(Child, {}, child), {
        ref: this.childRefs[child.key],
        key: child.key
      });
    });

    return React.createElement(this.props.component, {}, childrenToRender);
  }
}

Slider.propTypes = {
  children: PropTypes.node.isRequired,
  component: PropTypes.string,
  delay: PropTypes.number.isRequired,
  onDidAppear: PropTypes.func.isRequired,
  onDidSlide: PropTypes.func.isRequired,
  onWillSlide: PropTypes.func.isRequired,
  reverse: PropTypes.bool.isRequired,
  transitionName: PropTypes.string.isRequired
};

Slider.defaultProps = {
  component: 'span',
  onDidAppear: () => {},
  onDidSlide: () => {},
  onWillSlide: () => {},
  reverse: false
};

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = { height: '', originalHeight: '', show: true };
  }

  node;

  componentWillSlideIn(slide) {
    if (!this.node) return;
    this.setState({
      height: slide.height,
      originalHeight: parseInt(window.getComputedStyle(this.node, null).height, 10),
      show: false
    });
  }

  componentDidSlideIn(cb) {
    const { height, originalHeight } = this.state;

    if (height === originalHeight) {
      this.setState({ show: true, height: '' });
      cb();
    } else {
      this.cb = cb;
      const frames = 10;
      let count = 0;
      let current = height;
      const last = originalHeight;
      const step = Math.abs(current - last) / frames;
      const dir = current < last ? 1 : -1;
      const dh = step * dir;

      // TODO: rAF
      this.t = setInterval(() => {
        if (count < frames - 1) {
          this.setState({ height: current, animating: true });
          current += dh;
          count++;
        } else {
          clearInterval(this.t);
          delete this.t;
          this.setState({ height: '', show: true });
          this.cb();
        }
      }, 17);
    }
  }

  componentWillSlideOut(cb) {
    if (!this.node) return;
    const size = window.getComputedStyle(this.node, null).height;
    cb({ height: parseInt(size, 10), reverse: this.reverse });
  }

  componentWillUnmount() {
    if (this.t) {
      clearInterval(this.t);
      this.cb();
    }
  }

  render() {
    const { children } = this.props;
    const { height, show } = this.state;

    return (
      <div ref={node => (this.node = node)} style={height ? { height: height + 'px' } : {}}>
        <div style={{ visibility: show ? 'inherit' : 'hidden' }}>{children}</div>
      </div>
    );
  }
}

Child.propTypes = {
  children: PropTypes.node.isRequired
};
