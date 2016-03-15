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
