import React from 'react';
import Code from './Code';
import Card from './Card';

const formatLogs = ({ logs }) => {
  let result = '';
  logs.forEach(l => {
    result += '\r\n' + JSON.stringify(l, null, 1);
  });
  return result;
};

export default ({ update, state }) =>
  state.logs.length > 0 && (
    <Card title="Event logs">
      <div className="row">
        <div className="col-sm-12" style={{ maxHeight: 700, overflow: 'auto' }}>
          <Code>{formatLogs(state)}</Code>
        </div>
        <div className="col-sm-12">
          <div id="btn-clear-log" className="btn btn-danger" onClick={() => update({ logs: [] })}>
            Clear logs
          </div>
        </div>
      </div>
    </Card>
  );
