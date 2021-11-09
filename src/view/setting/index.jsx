import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableSetting from './TableSetting';

const Setting = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableSetting match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Setting;
