# Webpack example

This example shows how to bundle the `auth0-lock` npm package with [webpack](https://webpack.github.io/). It uses [Babel](https://babeljs.io/) to support the new [ES2015 syntax](https://babeljs.io/docs/learn-es2015/), but it is not a requirement.

First, ensure you have [node](https://nodejs.org/) installed on your system. Then, run `npm install` to install the project's dependencies and `npm run build` to build the bundle. Finally, open `index.html` in your favorite browser.

## Warning

Having multiple copies of [React](https://facebook.github.io/react) in your bundle can cause problems. Lock was built using React, and if your project, or any other dependency, also depends on React, you might en up with two different versions in your bundle. In such scenarios, you should see a warning when doing `npm install`. Also, you can check with `npm ls react` at any time.
