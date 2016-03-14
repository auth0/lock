import React from 'react';
import ReactDOM from 'react-dom';

export default class GlobalMessage extends React.Component {

  render() {
    const { message, type } = this.props;
    const className = `auth0-global-message auth0-global-message-${type}`

    return (
      <div className={className}>
        <span className="animated fadeInUp">{message}</span>
      </div>
    );
  }

  // componentWillAppear(callback) {
  //   console.log("componentWillAppear")
  //   callback();
  // }
  //
  // componentDidAppear() {
  //   console.log("componentDidAppear");
  // }

  componentWillEnter(callback) {
    // console.log("componentWillEnter");
    const node = ReactDOM.findDOMNode(this);
    var computedStyle = window.getComputedStyle(node, null);
    var height = computedStyle.height;
    var paddingTop = computedStyle.paddingTop;
    var paddingBottom = computedStyle.paddingBottom;
    node.style.height = "0px";
    node.style.paddingTop = "0px";
    node.style.paddingBottom = "0px";
    setTimeout(function() {
      node.style.transition = "all 0.2s";
      node.style.height = "";
      node.style.paddingTop = "";
      node.style.paddingBottom = "";
      callback();
    }, 17);
  }

  // componentDidEnter() {
  //   console.log("componentDidEnter");
  // }

  componentWillLeave(callback) {
    // console.log("componentWillLeave");
    const node = ReactDOM.findDOMNode(this);
    node.style.transition = "all 0.2s";
    node.style.height = "0px";
    node.style.paddingTop = "0px";
    node.style.paddingBottom = "0px";
    setTimeout(function() {
      node.style.removeProperty("transition");
      node.style.removeProperty("height");
      node.style.removeProperty("padding-top");
      node.style.removeProperty("padding-bottom");
      callback();
    }, 250);
  }

  // componentDidLeave() {
  //   console.log("componentDidLeave");
  // }
}

GlobalMessage.propTypes = {
  message: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf(['error', 'success']).isRequired
}
