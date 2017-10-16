import React from 'react';
import Code from 'react-prism';

export default ({ children }) => (
  <Code component="pre" className="language-javascript">
    {children}
  </Code>
);
