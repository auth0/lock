import React from 'react';
import Immutable from 'immutable';
import { render, fireEvent } from '@testing-library/react';

import { passwordStrengthPolicy } from '../../../connection/database';
import { validatePassword } from '../../../field/password';
import PasswordInput from '../../../ui/input/password_input';

describe('PasswordInput connection policy', () => {
  const getModel = (database = [], enterprise = [], defaultDirectory) =>
    Immutable.fromJS({
      id: 'lock',
      core: {
        ui: {},
        transient: { connections: { database, enterprise } }
      },
      client: { defaultDirectory }
    });

  const renderInput = lock => {
    function PasswordForm() {
      const [value, setValue] = React.useState('');
      return (
        <PasswordInput
          lock={lock}
          policy={passwordStrengthPolicy(lock)}
          value={value}
          onChange={event => setValue(event.target.value)}
          invalidHint="Invalid password"
          isValid={true}
          showPassword={false}
          showPasswordStrengthMessage={true}
          strengthMessages={{}}
        />
      );
    }
    return render(<PasswordForm />);
  };

  it.each([
    ['connections have not loaded', getModel()],
    ['the database connection has no policy', getModel([{ name: 'database' }])],
    [
      'the default directory is enterprise',
      getModel(
        [{ name: 'database', passwordPolicy: { length: { minLength: 8 } } }],
        [{ name: 'enterprise' }],
        'enterprise'
      )
    ]
  ])('keeps the input mounted when %s', (name, model) => {
    const { container } = renderInput(model);
    const input = container.querySelector('input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'short' } });

    expect(container.querySelector('input')).toBe(input);
    expect(input).toHaveValue('short');
    expect(container.querySelector('.auth0-lock-password-strength')).toBeNull();
    expect(validatePassword('short', passwordStrengthPolicy(model))).toBe(true);
    expect(validatePassword('', passwordStrengthPolicy(model))).toBe(false);
  });

  it('continues to validate passwords and display hints for a configured policy', () => {
    const model = getModel([{ name: 'database', passwordPolicy: { length: { minLength: 8 } } }]);
    const { container } = renderInput(model);
    const input = container.querySelector('input');
    const policy = passwordStrengthPolicy(model);

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'short' } });

    expect(container.querySelector('input')).toBe(input);
    expect(validatePassword('short', policy)).toBe(false);
    expect(container.querySelector('.auth0-lock-password-strength')).toHaveTextContent(
      '8 characters'
    );
    expect(container.querySelector('.auth0-lock-password-strength')).toHaveClass('fadeIn');

    fireEvent.change(input, { target: { value: 'long-enough-password' } });

    expect(validatePassword('long-enough-password', policy)).toBe(true);
    expect(container.querySelector('.auth0-lock-password-strength')).toHaveClass('fadeOut');
  });
});
