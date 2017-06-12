import PropTypes from 'prop-types';
import React from 'react';
import PhoneNumberInput from '../../ui/input/phone_number_input';

// import LocationInput from '../../ui/input/location_input';
import SelectInput from '../../ui/input/select_input';
import { startOptionSelection } from '../actions';

import * as c from '../index';
import * as l from '../../core/index';
import { swap, updateEntity } from '../../store/index';
import { humanLocation, setPhoneNumber } from '../phone_number';

export const icon =
  '<svg focusable="false" width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" class="auth0-lock-icon auth0-lock-icon-location"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Lock" transform="translate(-201.000000, -3519.000000)" fill="#919191"><g id="SMS" transform="translate(153.000000, 3207.000000)"><g transform="translate(35.000000, 299.000000)"><path id="Fill-349-Copy" d="M22.4023125,22.8 C22.543625,21.9425 22.625,20.9975 22.625,20 L26.125,20 C26.125,21.316875 25.69275,22.52 24.9853125,23.5175 C24.3255625,23.2025 23.4383125,22.953125 22.4023125,22.8 L22.4023125,22.8 Z M21.372875,25.954375 C21.72725,25.3725 22.0234375,24.5675 22.2404375,23.6225 C22.8975625,23.696875 23.483375,23.80625 23.9624375,23.9375 L24.67075,23.9375 C23.829875,24.92625 22.6849375,25.6525 21.372875,25.954375 L21.372875,25.954375 Z M20,26.125 C19.412875,26.125 18.896625,25.105625 18.579,23.5525 C19.034,23.521875 19.503875,23.5 20,23.5 C20.4956875,23.5 20.966,23.521875 21.421,23.5525 C21.1029375,25.105625 20.5866875,26.125 20,26.125 L20,26.125 Z M15.3288125,23.9375 L16.0375625,23.9375 C16.5161875,23.80625 17.1024375,23.696875 17.759125,23.6225 C17.976125,24.5675 18.2723125,25.3725 18.6266875,25.954375 C17.3150625,25.6525 16.170125,24.92625 15.3288125,23.9375 L15.3288125,23.9375 Z M15.0146875,23.5175 C14.3068125,22.52 13.875,21.316875 13.875,20 L17.375,20 C17.375,20.9975 17.4559375,21.9425 17.59725,22.8 C16.56125,22.953125 15.6744375,23.2025 15.0146875,23.5175 L15.0146875,23.5175 Z M15.030875,16.45625 C15.6796875,16.78 16.5634375,17.03375 17.60075,17.195625 C17.501,17.799375 17.428375,18.4425 17.3964375,19.125 L13.951125,19.125 C14.0933125,18.13625 14.477,17.230625 15.030875,16.45625 L15.030875,16.45625 Z M18.6266875,14.04125 C18.27275,14.623125 17.977,15.42375 17.760875,16.373125 C17.1265,16.294375 16.558625,16.189375 16.0944375,16.0625 L15.34325,16.0625 C16.180625,15.069375 17.3168125,14.343125 18.6266875,14.04125 L18.6266875,14.04125 Z M20,13.875 C20.585375,13.875 21.0959375,14.894375 21.4118125,16.443125 C20.959875,16.478125 20.492625,16.5 20,16.5 C19.5069375,16.5 19.0396875,16.478125 18.58775,16.443125 C18.903625,14.894375 19.4141875,13.875 20,13.875 L20,13.875 Z M18.2749375,19.125 C18.3020625,18.473125 18.362,17.865 18.441625,17.29625 C18.9408125,17.344375 19.4596875,17.375 20,17.375 C20.5403125,17.375 21.0591875,17.344375 21.5579375,17.29625 C21.638,17.865 21.6979375,18.473125 21.724625,19.125 L18.2749375,19.125 L18.2749375,19.125 Z M21.75,20 C21.75,20.97125 21.6786875,21.88125 21.5631875,22.699375 C21.06225,22.65125 20.5420625,22.625 20,22.625 C19.4579375,22.625 18.9373125,22.65125 18.436375,22.699375 C18.320875,21.88125 18.25,20.97125 18.25,20 L21.75,20 L21.75,20 Z M24.6563125,16.0625 L23.905125,16.0625 C23.441375,16.189375 22.8730625,16.294375 22.2386875,16.373125 C22.0225625,15.42375 21.7268125,14.623125 21.372875,14.04125 C22.68275,14.343125 23.8189375,15.069375 24.6563125,16.0625 L24.6563125,16.0625 Z M24.9686875,16.45625 C25.5225625,17.230625 25.90625,18.13625 26.048875,19.125 L22.603125,19.125 C22.5711875,18.4425 22.499,17.799375 22.39925,17.195625 C23.4365625,17.03375 24.3203125,16.78 24.9686875,16.45625 L24.9686875,16.45625 Z M20,13 C16.1338125,13 13,16.1325 13,20 C13,23.863125 16.1338125,27 20,27 C23.86575,27 27,23.863125 27,20 C27,16.1325 23.86575,13 20,13 L20,13 Z"></path></g></g></g></g></svg>';

export default class PhoneNumberPane extends React.Component {
  handlePhoneNumberChange(e) {
    swap(updateEntity, 'lock', l.id(this.props.lock), setPhoneNumber, e.target.value);
  }

  render() {
    const { instructions, lock, placeholder } = this.props;
    const headerText = instructions || null;
    const header = headerText && <p>{headerText}</p>;

    return (
      <div>
        {header}
        <SelectInput
          icon={icon}
          isValid={!c.isFieldVisiblyInvalid(lock, 'location')}
          name="location"
          placeholder=""
          label={humanLocation(lock)}
          onClick={() => startOptionSelection(l.id(lock), 'location', '', icon)}
        />
        <PhoneNumberInput
          value={c.phoneNumber(lock)}
          isValid={!c.isFieldVisiblyInvalid(lock, 'phoneNumber')}
          onChange={::this.handlePhoneNumberChange}
          placeholder={placeholder}
          disabled={l.submitting(lock)}
        />
      </div>
    );
  }
}

PhoneNumberPane.propTypes = {
  instructions: PropTypes.element,
  lock: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired
};
