import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableStorage from './TableStorage';

const Storage = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableStorage match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Storage;
