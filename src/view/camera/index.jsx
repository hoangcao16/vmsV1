import React from 'react';
import { withRouter } from 'react-router';
import {
  Switch,
  useRouteMatch,
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import TableCameraGroup from './TableCameraGroup';
import TableCameraScan from './TableCameraScan';

const Camera = () => {
  let { path } = useRouteMatch();

  return (
    <Router>
      <Switch>
        <Route exact path={path} component={TableCameraGroup}></Route>
        <Route
          exact
          path={`${path}/scan`}
          render={() => {
            return <TableCameraScan />;
          }}
        ></Route>
      </Switch>
    </Router>
  );
};

export default withRouter(Camera);
