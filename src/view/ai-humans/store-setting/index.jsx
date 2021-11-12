import React from 'react';
import { Route, Switch } from 'react-router-dom';

const ThreshSaveSetting = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => {
            <storeSetting match_parent={match} />
          }}
        />
      </Switch>
    </div>
  );
};

export default ThreshSaveSetting;
