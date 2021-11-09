import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TablePlayback from './TablePlayback';

const Playback = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TablePlayback match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Playback;
