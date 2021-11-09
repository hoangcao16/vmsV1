import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableMonitoring from './TableMonitoring';

const Monitoring = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableMonitoring match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Monitoring;
