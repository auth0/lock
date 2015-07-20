import React from 'react';
import Lock from '../lock/lock';
import Crashed from './content';

export default function render(lock) {
  return <Lock lock={lock} showHeader={false}><Crashed /></Lock>;
}
