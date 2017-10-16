import React from 'react';

export default () => (
  <header className="site-header">
    <nav className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header">
          <button
            className="navbar-toggle"
            type="button"
            data-toggle="collapse"
            data-target="#navbar-collapse"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <h1 className="navbar-brand">
            <a href="https://auth0.com/">
              <span>Auth0</span>
            </a>
          </h1>
          <a
            className="no-basic hiring animated bounce hidden-sm hidden-xs hidden-md"
            href="https://auth0.com/jobs"
          >
            We&apos;re hiring!
          </a>
        </div>
        <div className="collapse navbar-collapse" id="navbar-collapse">
          <ul className="nav navbar-nav navbar-left no-basic">
            <li className="li-why">
              <a href="https://auth0.com/why-auth0">Why Auth0</a>
            </li>
            <li className="li-how">
              <a href="https://auth0.com/how-it-works">How It Works</a>
            </li>
            <li className="li-pricing">
              <a href="https://auth0.com/pricing">Pricing</a>
            </li>
            <li className="dropdown">
              <span className="btn-dro" role="button" data-toggle="dropdown">
                More<i className="icon-budicon-460" />
              </span>
              <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
                <li>
                  <a href="https://auth0.com/lock">Lock</a>
                </li>
                <li>
                  <a href="https://auth0.com/passwordless">Passwordless</a>
                </li>
                <li>
                  <a href="https://auth0.com/wordpress">WordPress</a>
                </li>
                <li className="divider" />
                <li>
                  <a href="https://auth0.com/about">About</a>
                </li>
                <li>
                  <a href="https://auth0.com/blog">Blog</a>
                </li>
                <li>
                  <a href="https://auth0.com/customers">Customers</a>
                </li>
                <li>
                  <a href="https://auth0.com/resources">Resources</a>
                </li>
                <li>
                  <a href="https://auth0.com/partners">Partners</a>
                </li>
                <li>
                  <a href="https://auth0.com/opensource">Open Source</a>
                </li>
                <li>
                  <a href="https://auth0.com/jobs">Jobs</a>
                </li>
                <li>
                  <a href="https://auth0.com/press">Press</a>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li className="li-docs no-basic">
              <a href="https://auth0.com/support">Help &amp; Support</a>
            </li>
            <li className="li-docs no-basic">
              <a href="https://auth0.com/docs">Documentation</a>
            </li>
            <li>
              <a className="signin-button login" href="https://manage.auth0.com">
                Open Dashboard
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
);
