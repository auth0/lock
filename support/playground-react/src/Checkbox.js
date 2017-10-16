import React from 'react';

export default ({ label, help, ...checkbox }) => (
  <div className="form-group">
    <label>
      <input type="checkbox" {...checkbox} style={{ marginRight: 10 }} />
      {label}
    </label>
  </div>
);
