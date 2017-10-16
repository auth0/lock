import React from 'react';
import Card from './Card';
import Input from './Input';
import Select from './Select';
import Checkbox from './Checkbox';

const tryUpdateJson = (update, key, value) => {
  try {
    const result = JSON.parse(value);
    update({ [key]: result });
  } catch (error) {}
};

const InputList = ({ children }) => (
  <div>
    {children.map((c, i) => (
      <div key={i} className="row">
        <div className="col-md-12">{c}</div>
      </div>
    ))}
  </div>
);

const AuthOptions = ({ update, state }) => (
  <div>
    <InputList>
      {[
        <Input
          key="authParams"
          multiline
          label="Authentication Parameters"
          help="Object that specifies extra parameters that will be sent when starting a login"
          onChange={e => tryUpdateJson(update, 'authParams', e.target.value)}
          defaultValue={JSON.stringify(state.authParams, null, 1)}
        />
      ]}
    </InputList>
  </div>
);

const UIOptions = ({ update, state }) => (
  <div>
    <InputList>
      {[
        <Input
          multiline
          key="allowedConnections"
          label="Allowed Connections"
          help="Array of connections available to perform an authentication request."
          onChange={e => tryUpdateJson(update, 'allowedConnections', e.target.value)}
          defaultValue={JSON.stringify(state.allowedConnections, null, 1)}
        />,
        <Select
          key="passworldessMethod"
          label="Passwordless Method"
          options={[
            { value: 'code', text: 'Send a unique code' },
            { value: 'link', text: 'Send a magic link' }
          ]}
          help="When using Passworldess mode with an email connection, you can choose between receiving a unique code or a magic link"
          onChange={e => update({ passworldessMethod: e.target.value })}
          value={state.passworldessMethod}
        />,
        <Select
          key="language"
          label="Language"
          options={[
            { value: 'en', text: 'English' },
            { value: 'es', text: 'Spanish' },
            { value: 'pt-BR', text: 'Portuguese (Brazil)' }
          ]}
          help="When using Passworldess mode with an email connection, you can choose between receiving a unique code or a magic link"
          onChange={e => update({ passworldessMethod: e.target.value })}
          value={state.passworldessMethod}
        />,
        <Input
          key="languageDictionary"
          multiline
          label="Language Dictionary"
          help="Object with string customizations"
          onChange={e => tryUpdateJson(update, 'languageDictionary', e.target.value)}
          defaultValue={JSON.stringify(state.languageDictionary, null, 1)}
        />,
        <Input
          key="primaryColor"
          label="Primary Color"
          help="Primary color of Lock, all colors used in the widget will be calculated from it"
          onChange={e => update({ primaryColor: e.target.value })}
          value={state.primaryColor}
        />,
        <Input
          key="logo"
          label="Logo url"
          help="Language used in Lock"
          onChange={e => update({ logo: e.target.value })}
          value={state.logo}
        />,
        <Checkbox
          key="avatar"
          label="Show avatar"
          size="md"
          onChange={e => update({ avatar: e.target.checked })}
          checked={state.avatar}
        />,
        <Checkbox
          key="labeledSubmitButton"
          label="Show submit button text"
          size="xl"
          onChange={e => update({ labeledSubmitButton: e.target.checked })}
          checked={state.labeledSubmitButton}
        />,
        <Checkbox
          key="allowShowPassword"
          label="Show a button to show password"
          size="xl"
          onChange={e => update({ allowShowPassword: e.target.checked })}
          checked={state.allowShowPassword}
        />
      ]}
    </InputList>
  </div>
);

export default props => (
  <Card title="Customize Lock">
    <ul className="nav nav-tabs">
      <li className="active" role="presentation">
        <a href="#tab-one" aria-controls="tab-one" role="tab" data-toggle="tab">
          UI Options
        </a>
      </li>
      <li role="presentation">
        <a href="#tab-two" aria-controls="tab-two" role="tab" data-toggle="tab">
          Auth Options
        </a>
      </li>
    </ul>
    <div className="tab-content">
      <div className="tab-pane active" id="tab-one" role="tabpanel">
        <UIOptions {...props} />
      </div>
      <div className="tab-pane" id="tab-two" role="tabpanel">
        <AuthOptions {...props} />
      </div>
    </div>
  </Card>
);
