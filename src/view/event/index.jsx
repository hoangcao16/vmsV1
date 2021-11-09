import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableEvent from './TableEvent';

const Event = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableEvent match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Event;
