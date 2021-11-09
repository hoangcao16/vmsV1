import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableAlert from "./TableAlert";

const Alert = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableAlert match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Alert;