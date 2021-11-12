import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableRecordSetting from './TableRecordSetting';

const RecordSetting = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableRecordSetting match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default RecordSetting;
