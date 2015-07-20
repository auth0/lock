import React from 'react';
import Lock from '../lock/lock';
import Loading from './content';

export default function render(lock) {
  return <Lock lock={lock} showHeader={false}><Loading /></Lock>;
}
