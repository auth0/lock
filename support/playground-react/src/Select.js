import React from 'react';

export default ({ label, options, help, ...select }) => (
  <div className="form-group">
    <label className="col-xs-3 control-label" style={{ height: '45px' }}>
      {label}
    </label>
    <div className="col-xs-9">
      <select className="form-control" style={{ height: 45 }} {...select}>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
      {help && <span className="help-block">{help}</span>}
    </div>
  </div>
);
