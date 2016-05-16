import { changeField } from './actions';
import { getFieldValue, isFieldVisiblyInvalid } from './index';
import TextInput from '../ui/input/text_input';
import SelectInput from '../ui/input/select_input';
import * as l from '../core/index';

const CustomInput = ({iconUrl, model, name, placeholder, type, validator}) => {
  const props = {
    iconUrl,
    isValid: !isFieldVisiblyInvalid(model, name),
    name,
    placeholder,
    value: getFieldValue(model, name)
  }

  switch(type) {
    case "select":
      return (
        <SelectInput {...props} />
      );
    default:
      return (
        <TextInput
          onChange={e => changeField(l.id(model), name, e.target.value, validator)}
          {...props}
        />
      );
  }
};

export default CustomInput;
