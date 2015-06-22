# Getting Started

Execute `$ npm run watch` and visit http://localhost:3000. Open the console and use the original lock API. The client needs to have a strategy named _auth0_ that allows to sign in with email and password. See [here](src/utils/client_utils.js#L8-L11) for more details.

# Review

Visit [http://gnandretta.github.io/lock-refactor](http://gnandretta.github.io/lock-refactor) and click somewhere to open the lock. Use the following credentials to perform a successful login:
_ohhgabriel@gmail.com/pass123_.

## Questions

1. The responsibility of `AppStore` is to hold all the data that belongs to the locks available in a document. The main benefit of having the whole state application contained in one place (instead of scattered through all the objects of the system) is that we can control how changes are made: only through actions.

  I don't see where a Lock instance cares about another one in the code. Furthermore, having an `AppStore` is what actually allows this to happen. Think about the case of having two Locks in the same document: ¿how can we ensure they are not both open at the same time if they don't know about each other and they hide their information? ¿how can we share client information between them?

  These are some examples of incidental complexity that we can remove thanks to the store:
  - https://github.com/auth0/lock/blob/11f4d3010fd8faf56df382575cfe6f276e409109/index.js#L159-L171
  - https://github.com/auth0/lock/blob/11f4d3010fd8faf56df382575cfe6f276e409109/lib/options-manager/index.js#L102-L104
  - https://github.com/auth0/lock/blob/11f4d3010fd8faf56df382575cfe6f276e409109/lib/options-manager/index.js#L123

2. The `LockActionCreators` notifies the `AppStore` that an event related to a lock has occurred and gives it chance to update it's data. After that it optionally triggers any side-effect that is a consequence of the event (for instance making an request). This allows the producers of those events to simply fire them and forget about it.

  To manage sign up for instance, three functions need to be defined `signUp`, `successfulSignUp` and `failedSignUp`. The first will trigger a request and the other two will be fired according to the request result. Also if we need to handle password and email validation differently, we'll need to add new actions or update the way the store updates its data when the `changeEmail` or the `changePassword` actions are fired.

  Another alternative is to have one set of generic actions that handle both the sign in and sign up, and their results.

3. I followed the default directory structure and naming convetion proposed by Flux. However, I don't think it will be a good fit for the project because the _actions_, _constants_, _dispatchers_ and _stores_ directories will contain just one file, but _components_ and _utils_ a lot of them. I'd rather have files grouped by the part of the  domain problem they handle. One possible layout would be:

        constants.js
        dispatcher.js
        credentials/email_credentials.js
        credentials/password_credentials.js
        lock/api.js
        lock/widget/header.jsx
        lock/widget/sign_in/sign_in_content.jsx
        lock/widget/sign_in/sign_in_error_message.jsx
        lock/widget/sign_up/sign_up_content.jsx
        ...
        utils/string.js

  The goal is to have close files that are more likely to change together, that way is easier to see how the system needs to be modified when a bug needs to be fixed or a new feature added.

  Also, I prefer verbose names, for instance `setupLock` instead of just `setup`, even if it's obvious that it setups a lock from the namespace, because they are easier to `grep` later.

4. The flow is as follows:

  1. When a new instance of `Auth0Lock` is constructed,
  2. a `'SETUP_LOCK'` action is dispatched, so the data for the new lock can be initialized. The only important detail about it, is that it's state is set to `'WAITING_CLIENT_CONFIG'`.
  3. Also a call to `WebAPIUtils.setupClient` is made to attempt to load the client information (by appending a script tag to the document).
  4. If the client is loaded successfully, a `'RECEIVE_CLIENT'` action is dispatched, and the lock state is updated to `'READY'`.
  5. If there's an error fetching the client configuration, or there's no response after five seconds, a `'RECEIVE_CLIENT_ERROR'` or `'RECEIVE_CLIENT_TIMEOUT'` is dispatched, setting the lock state to `'CRASHED'`.

  Simultaneously, there's a loop listening for changes in the locks data, that will render the locks that need to be shown, optionally appending a container DOM element when the user doesn't provide it. To perform the rendering, it calls `React.render` with a `Lock` component and all the lock's data. This component then decides if it renders a loading message (`LoadingContent` component) or the form for sign in (`SingInContent` component) according to the lock's state value. In the future it'll also need to check the lock's mode (`'sign in'`, `sign up` and so on).

  Calling `lock.showSignin()` will set the lock's `show` value to `true` by dispatching the `'SHOW_LOCK'` action. Something similar happens when `lock.hide()` is called. This is wat the loop described in the previous paragraph uses to decide whether or not it needs to render a lock.

  Also, at the moment we are not doing anything if the client configuration is received after the timeout expires. That is, the lock stays in the `'CRASHED'` state. However, it would be possible to recover from this very easily.

5. The `Auth0Lock` class will extend `EventEmitter` and events will be emitted by the functions in `LockActionCreators` after dispatching the action. To do this, a reference to the lock will need to be passed as argument of the action.

6. Besides React, I've added a dependency to Immutable (also Flux, but it is very small). This adds 660kB + 140kB = 800kB to the bundle (180kB minified). While both libraries, but specially React, will allow us to get rid of a lot of code, I don't think it will compensate the bytes that come from including the libraries (the code for the current lock, without dependencies and minification, is about 810kB). That being said, I don't think that the difference will matter much after the code gets minified and gzipped.

  We can create some abstractions to reduce the code needed to dispatch actions (in `LockActionCreators` and `ClientActionCreators`) and to react to them (in `AppStore`). Worst case scenario, we can get rid of Immutable (we are using only one data structure and very few methods).

7. We can create components with just the `render` method. Then, others component can delegate to them. Actually, there's no need for them to be components, they could be just functions that return a ReactElement.

  Another alternative could be to add a step to the build, that reads the template files, wraps them in a component or a function and makes them accessible to the other components (something analogue to [grunt-template-angular](https://github.com/ericclemmons/grunt-angular-templates)).

  However, I don't think that is a good idea. We're separating technologies and not concerns, changes to the template and the rendering logic usually go hand in hand. Besides, with the exception of the `Avatar` component, that fetches the gravatar image, our components simply translate the lock's data to HTML.

### UX

1. Before attempting to log the user in, the format of the email and the length of the password are checked. If the email has an invalid format, or the password has less than 4 characters, the input border is painted in red. If the validations are passed, and an error occurs during the login, the message with the error is shown. It'll be easy to also highlight the fields, but I need to know the possible error codes returned by the API (see [here](src/stores/app_store.js#L41-L48)).

2. Agree. I like how the current lock shakes when there's a failed attempt to login, but it can be distracting. Highlighting the error message will help. Also, we can focus the invalid field. Besides, we can remove the error message, disable the form, and add some indicator that the request is being made (even when it's not).
