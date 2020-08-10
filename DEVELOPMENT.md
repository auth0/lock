## Environment

Requires:

- [Yarn](https://yarnpkg.com/)
- Node 10.x

## Building

The SDK uses [Webpack](https://webpack.js.org/) to compile all JavaScript assets into a set of output modules to be consumed by other module builders such as Webpack and [Rollup](https://rollupjs.org/guide/en/), or directly into and HTML file via the CDN.

To perform a build, use the `build` script:

```
yarn build
```

## Running Tests

Unit tests can be executed using [Jest](https://jestjs.io/) by issuing the following command:

```
yarn test:jest
```

To interactively perform tests using Jest's `watch` mode, use:

```
yarn test:jest:watch
```

## The SDK Playground

To test the SDK manually and play around with the various options and features, you can invoke the Playground by using:

```
yarn start
```

Next, open `https://localhost:3000/support`, which will display a simple web app that allows you to interact with Auth0 to test functionality. The HTML template in `support/index.html` can be modified to test various different pieces of functionality.

This is preconfigured with an Auth0 tenant and client ID but you may change this to your own for testing.
