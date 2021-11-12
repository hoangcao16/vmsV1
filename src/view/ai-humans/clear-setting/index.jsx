import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableClearSetting from './TableClearSetting';

const ClearSetting = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableClearSetting match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default ClearSetting;
