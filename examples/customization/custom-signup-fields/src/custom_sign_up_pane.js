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
