import React from 'react';
import LocationSelect from './location_select';
import { cancelSelectPhoneLocation, changePhoneLocation } from './actions';
import { initialLocationSearchStr, selectingLocation } from './index';
import * as l from '../../core/index';
import * as i18n from '../../i18n'; // TODO: can't we get this from props?

export default class AskLocation extends React.Component {

  handleCancel() {
    cancelSelectPhoneLocation(l.id(this.props.lock));
  }

  handleSelect(location) {
    changePhoneLocation(l.id(this.props.lock), location);
  }

  render() {
    return (
      <LocationSelect
        cancelHandler={::this.handleCancel}
        initialLocationSearchStr={this.props.initialLocationSearchStr}
        locationFilterInputPlaceholder={i18n.str(this.props.lock, "locationFilterInputPlaceholder")}
        selectHandler={::this.handleSelect}
      />
    );
  }

}

export function renderAskLocation(lock) {
  return selectingLocation(lock)
    ? <AskLocation
        initialLocationSearchStr={initialLocationSearchStr(lock)}
        key="auxiliarypane"
        lock={lock} />
    : null;
}
