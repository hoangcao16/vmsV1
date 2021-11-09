import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableHardDriveList from './TableHardDriveList';

const HardDriveList = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableHardDriveList match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default HardDriveList;
