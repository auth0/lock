import PropTypes from 'prop-types';
import React from 'react';

const SvgBackIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    enableBackground="new 0 0 24 24"
    version="1.0"
    viewBox="0 0 24 24"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    {' '}
    <polyline
      fill="none"
      points="12.5,21 3.5,12 12.5,3 "
      stroke="#000000"
      strokeMiterlimit="10"
      strokeWidth="2"
    ></polyline>{' '}
    <line
      fill="none"
      stroke="#000000"
      strokeMiterlimit="10"
      strokeWidth="2"
      x1="22"
      x2="3.5"
      y1="12"
      y2="12"
    ></line>{' '}
  </svg>
);
const SvgCloseIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    enableBackground="new 0 0 128 128"
    version="1.1"
    viewBox="0 0 128 128"
    xmlSpace="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g>
      <polygon
        fill="#373737"
        points="123.5429688,11.59375 116.4765625,4.5185547 64.0019531,56.9306641 11.5595703,4.4882813     4.4882813,11.5595703 56.9272461,63.9970703 4.4570313,116.4052734 11.5244141,123.4814453 63.9985352,71.0683594     116.4423828,123.5117188 123.5126953,116.4414063 71.0732422,64.0019531   "
      ></polygon>
    </g>
  </svg>
);

const IconButton = ({ lockId, name, onClick, svg }) => (
  <span
    id={`${lockId}-${name}-button`}
    role="button"
    tabIndex={0}
    className={`auth0-lock-${name}-button`}
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
    onKeyPress={e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onClick();
      }
    }}
    aria-label={name}
  >
    {svg}
  </span>
);

IconButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  svg: PropTypes.element.isRequired
};

export const CloseButton = ({ lockId, onClick }) => (
  <IconButton lockId={lockId} name="close" onClick={onClick} svg={<SvgCloseIcon />} />
);

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export const BackButton = ({ lockId, onClick }) => (
  <IconButton lockId={lockId} name="back" onClick={onClick} svg={<SvgBackIcon />} />
);

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired
};
