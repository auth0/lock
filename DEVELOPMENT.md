## Environment

Requires:

- [Yarn](https://yarnpkg.com/)
- >= Node 10.18.1

## Building

The SDK uses [Webpack](https://webpack.js.org/) to compile all JavaScript assets into a set of output modules to be consumed by other module builders such as Webpack and [Rollup](https://rollupjs.org/guide/en/), or directly into and HTML file via the CDN.

To perform a build, use the `build` script:

```
yarn build
```

## Running Tests

Unit tests can be executed using [Jest](https://jestjs.io/) by issuing the following command:

```
yarn test
```

To interactively perform tests using Jest's `watch` mode, use:

```
yarn test:watch
```

End-to-end tests can be executed locally using [Karma](https://karma-runner.github.io/), in both watch and CLI mode:

```
# CLI mode using Chrome Headless browser:
yarn test:e2e

# Watch mode using Chrome desktop browser, in watch mode:
yarn test:e2e:watch
```

## The SDK Playground

To test the SDK manually and play around with the various options and features, you can invoke the Playground by using:

```
yarn start
```

Next, open `https://localhost:3000/support`, which will display a simple web app that allows you to interact with Auth0 to test functionality. The HTML template in `support/index.html` can be modified to test various different pieces of functionality.

This is preconfigured with an Auth0 tenant and client ID but you may change this to your own for testing.

## Testing Lock locally through the Universal Login Page

If you need to test a local build of Lock, but hosted on the ULP, you can do this by modifying the ULP template for a tenant so that the script for Lock points to the locally-served instance at `https://localhost:3000/build/lock.js`.

You can then use another SPA app to log in using this tenant that has this customized version of the Lock template.

You may need to run Lock using HTTPS with a valid certificate if you want to do this testing in Safari, as Safari will not load mixed content pages, and will also not load HTTPS with untrusted testing certificates.

Lock can already support HTTPS just by running `yarn start` if you have `mkcert` installed.

To install `mkcert`:

```
brew install mkcert

brew install nss # if you use Firefox

mkcert install

# Serve lock
yarn start
```

Once Lock has started, use another SPA app to log in using a tenant with the template customized as above.

If you don't have `mkcert`, HTTPS will still be used but it will be untrusted.