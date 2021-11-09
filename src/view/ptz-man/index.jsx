import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TablePtzManager from './TablePtzManager';

const PtzManager = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TablePtzManager match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default PtzManager;
