import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableZone from './TableZone';

const Zone = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableZone match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Zone;
