import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableNVR from './TableNVR';

const NVR = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableNVR match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default NVR;
