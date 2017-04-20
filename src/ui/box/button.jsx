import PropTypes from 'prop-types';
import React from 'react';

const svgs = {
  back: '<svg focusable="false" enable-background="new 0 0 24 24" version="1.0" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <polyline fill="none" points="12.5,21 3.5,12 12.5,3 " stroke="#000000" stroke-miterlimit="10" stroke-width="2"></polyline> <line fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="2" x1="22" x2="3.5" y1="12" y2="12"></line> </svg>',
  close: '<svg focusable="false" enable-background="new 0 0 128 128" version="1.1" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><polygon fill="#373737" points="123.5429688,11.59375 116.4765625,4.5185547 64.0019531,56.9306641 11.5595703,4.4882813     4.4882813,11.5595703 56.9272461,63.9970703 4.4570313,116.4052734 11.5244141,123.4814453 63.9985352,71.0683594     116.4423828,123.5117188 123.5126953,116.4414063 71.0732422,64.0019531   "></polygon></g></svg>'
};

const IconButton = ({ name, onClick, svg }) => (
  <span
    className={`auth0-lock-${name}-button`}
    dangerouslySetInnerHTML={{ __html: svg }}
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
  />
);

IconButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  svg: PropTypes.string.isRequired
};

// const createButton = name => {
//   const f = ({onClick}) => (
//     <IconButton name={name} svg={svgs[name]} onClick={onClick} />
//   );
//   f.displayName = `IconButton (${name})`;
//   f.propTypes = { onClick: React.PropTypes.func.isRequired };
//
//   return f;
// };
//
// export const CloseButton = createButton("close");
// export const BackButton = createButton("back");

export const CloseButton = ({ onClick }) => (
  <IconButton name="close" svg={svgs['close']} onClick={onClick} />
);

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export const BackButton = ({ onClick }) => (
  <IconButton name="back" svg={svgs['back']} onClick={onClick} />
);

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired
};
