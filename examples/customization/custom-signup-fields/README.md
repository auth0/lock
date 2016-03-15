# Custom sign up fields example

This example shows how to add custom fields to the sign up screen.

First, ensure you have [node](https://nodejs.org/) installed on your system. Then, run `npm install` to install the project's dependencies and `npm run build` to build the bundle. Finally, open `index.html` in your favorite browser.

## Tutorial

To add a custom field to the sign up we'll create a new screen. Instead of starting from scratch we'll extend the regular sign up screen and overwrite the `submitHandler` and `render` methods.

```js
// src/custom_sign_up_screen.jsx
import React from 'react';
import SignUpScreen from 'auth0-lock-next/lib/database/sign_up_screen';
import SignUpPane from 'auth0-lock-next/lib/database/sign_up_pane';
import CustomSignUpPane from './custom_sign_up_pane';
import { customSignUp } from './actions';

export default class CustomSignUpScreen extends SignUpScreen {

  submitHandler() {
    // This method returns a function that will be invoked when the form is
    // submitted.
    return customSignUp;
  }

  render({model}) {
    // This method returns a ReactElement that will be rendered in the main
    // content area of Lock (between the header and the submit button)
    return (
      <div className="custom-sign-up-screen">
        <SignUpPane
          emailInputPlaceholder={this.t(model, ["emailInputPlaceholder"], {__textOnly: true})}
          model={model}
          passwordInputPlaceholder={this.t(model, ["passwordInputPlaceholder"], {__textOnly: true})}
          usernameInputPlaceholder={this.t(model, ["usernameInputPlaceholder"], {__textOnly: true})}
        />
        <CustomSignUpPane model={model} />
      </div>
    )
  }

}
```

To get this working we'll need to implement `customSignUp` and `CustomSignUpPane` and glue it all together.

### customSignUp Action

Our `customSignUp` action will invoke the regular `signUp` action with the extra parameters containing the user metadata. The value of the custom field is obtained from the model with the `getField` function. In the next section will see how to store this value in the model as the user types it in the form.

```js
// src/actions.js
import { readModel } from 'auth0-lock-next/lib/model';
import { getField } from 'auth0-lock-next/lib/field';
import { signUp } from 'auth0-lock-next/lib/database/actions';

export function customSignUp(id) {
  const params = {
    user_metadata: {
      custom_field: getField(readModel(id), "customField")
    }
  };

  return signUp(id, params);
}
```

### CustomSignUpPane

```js
// src/custom_sign_up_pane.jsx
import React from 'react';
import TextInput from 'auth0-lock-next/lib/widget/component/text_input';
import { changeField } from 'auth0-lock-next/lib/field/actions';
import { getField } from 'auth0-lock-next/lib/field';
import { id } from 'auth0-lock-next/lib/model';

export default class CustomFieldsPane extends React.Component {

  handleChange(e) {
    changeField(id(this.props.model), "customField", e.target.value);
  }

  render() {
    const { model } = this.props;

    return (
      <div style={{marginTop: 10}}>
        <TextInput
          isValid={true}
          onChange={this.handleChange.bind(this)}
          placeholder="custom field"
          value={getField(model, "customField")}
        />
      </div>
    );
  }

}
```

### Glue it all together

```js
// src/index.js
import Auth0Lock from 'auth0-lock-next/lib/classic';
import CustomSignUpScreen from './custom_sign_up_screen';

Auth0Lock.SCREENS.signUp = CustomSignUpScreen;
export default Auth0Lock;
```
