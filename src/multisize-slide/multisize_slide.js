import React from 'react';
import ReactDOM from 'react-dom';
import CSSCore from 'fbjs/lib/CSSCore';

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {children: {current: props.children}};
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.children.current.key != nextProps.children.key) {
      this.setState({
        children: {
          current: nextProps.children,
          prev: this.state.children.current
        }
      });
      this.animate = true;
    } else {
      this.setState({children: {current: nextProps.children}});
    }
  }

  componentDidUpdate() {
    if (this.animate) {
      this.animate = false;

      const {current, prev} = this.state.children;
      const {transitionName} = this.props;
      const currentComponent = this.refs[current.key];
      const prevComponent = this.refs[prev.key];

      const transition = (component, className, delay) => {
        const node = ReactDOM.findDOMNode(component);
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

      const callback = (slide) => {
        currentComponent.componentWillSlideIn(slide);
        const classNamePrefix = slide.reverse ? "reverse-" : "";
        transition(currentComponent, `${classNamePrefix}${transitionName}-enter`, this.props.delay);
        transition(prevComponent, `${classNamePrefix}${transitionName}-leave`);

        this.timeout = setTimeout(() => {
          this.setState({children: {current: this.state.children.current}});
          currentComponent.componentDidSlideIn();
          this.timeout = null;
        }, this.props.delay);
      };

      prevComponent.componentWillSlideOut(callback)
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  render() {
    const {current, prev} = this.state.children;
    const children = prev ? [current, prev] : [current];

    const childrenToRender = children.map(child => {
      return React.cloneElement(child, {ref: child.key});
    });

    return React.createElement(this.props.component, {}, childrenToRender);
  }
}

Slider.propTypes = {
  component: React.PropTypes.string,
  delay: React.PropTypes.number.isRequired,
  transitionName: React.PropTypes.string.isRequired,
};

Slider.defaultProps = {
  component: "span"
};
