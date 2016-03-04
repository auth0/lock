import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '../icon/icon';

export default class SubmitButton extends React.Component {

  focus() {
    ReactDOM.findDOMNode(this).focus();
  }

  render() {
    const { color, disabled, tabIndex } = this.props;

    return (
      <button
        className="auth0-lock-submit"
        disabled={disabled}
        style={{backgroundColor: color}}
        tabIndex={tabIndex}
        type="submit"
      >
        <div className="auth0-loading-container">
          <div className="auth0-loading" />
        </div>
        <Icon name="submit"/>
      </button>
    );
  }

}

SubmitButton.propTypes = {
  disabled: React.PropTypes.bool
};
