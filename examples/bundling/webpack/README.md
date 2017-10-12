# Webpack example

This example shows how to bundle the `auth0-lock` npm package with [webpack](https://webpack.js.org).

First, ensure you have [node](https://nodejs.org/) installed on your system. Then, run `npm install` to install the project's dependencies and `npm start` to run the example. After that, open [https://localhost:3000](https://localhost:3000) in your browser.

If you want to build a production version of the example, run `npm run build`. You'll see the file `build.js` was created. This is a minified version of this example.

# process.env.NODE_ENV

If you are not using the CDN version of Lock, you'll have to set the `process.env.NODE_ENV` variable when building your webpack bundle like this:

```js
plugins: [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  })
]
```

## Warning

Having multiple copies of [React](https://facebook.github.io/react) in your bundle can cause problems. Lock was built using React, and if your project, or any other dependency, also depends on React, you might end up with two different versions in your bundle. In such scenarios, you should see a warning when doing `npm install`. Also, you can check with `npm ls react` at any time.
