import React from 'react';
import createPolicy from 'password-sheriff';
import util from 'util';

export default class PasswordStrength extends React.Component {

  render() {
    const { password, policy } = this.props;
    const analysis = createPolicy(policy).missing(password)

    return password && !analysis.verified
      ? <div className="auth0-lock-password-strength animated fadeIn">
          <List items={analysis.rules} />
        </div>
      : null;
  }

}

PasswordStrength.propTypes = {
  password: React.PropTypes.string.isRequired,
  policy: React.PropTypes.oneOf([
    "none",
    "low",
    "fair",
    "good",
    "excellent"
  ]).isRequired
};

class List extends React.Component {

  render() {
    const { items } = this.props;

    return items && items.length
      ? <ul>{items.map((x, i) => <Item {...x} key={i} />)}</ul>
      : null;
  }

}

List.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.object)
};

class Item extends React.Component {

  render() {
    const { code, items, format, message, verified } = this.props;
    const className = verified ? "auth0-lock-checked" : "";

    return ( // TODO: allow to translate message
      <li className={className}>
        {util.format(message, ...(format || []))}
        <List items={items} />
      </li>
    );
  }

}

Item.propTypes = {
  code: React.PropTypes.string.isRequired,
  items: React.PropTypes.array,
  format: React.PropTypes.array,
  message: React.PropTypes.string.isRequired,
  verified: React.PropTypes.bool.isRequired,
};
