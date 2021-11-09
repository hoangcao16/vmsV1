import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableReport from './TableReport';

const Report = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableReport match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Report;
