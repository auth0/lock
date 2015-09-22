import React from 'react';

export default function(dict, keyPath, params = {}) {
  const html = dict.get(keyPath, params);
  if (!html) {
    return null;
  }

  if (params.__textOnly) {
    return html;
  }

  return React.createElement("span", {dangerouslySetInnerHTML: {__html: html}});
}
