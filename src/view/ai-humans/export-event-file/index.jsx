import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ExportEventFile from "./ExportEventFile";

const ExportEventFileComponent = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <ExportEventFile match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default ExportEventFileComponent;