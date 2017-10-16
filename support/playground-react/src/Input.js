import React from 'react';

export default ({ label, help, multiline, ...input }) => (
  <div className="form-group">
    <label className="col-xs-3 control-label" style={{ height: '45px' }}>
      {label}
    </label>
    <div className="col-xs-9">
      {!multiline && <input className="form-control" type="text" {...input} />}
      {multiline && <textarea style={{ minHeight: 190 }} className="form-control" {...input} />}

      {help && <span className="help-block">{help}</span>}
    </div>
  </div>
);
