import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableCamproxy from './TableCamproxy';

const Camproxy = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableCamproxy match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Camproxy;
