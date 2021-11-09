import React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import GroupDetail from './dataListGroup/tableDetail/GroupDetail';
import RolesDetail from './dataListRole/tableDetail/RolesDetail';
import AddUser from './dataListUser/components/AddUser';
import Detail from './Detail';
import GeneralUser from './GeneralUser';
const User = () => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={GeneralUser}></Route>
      <Route path={`${path}/add`} component={AddUser}></Route>
      <Route path={`${path}/detail/:userUuid`} component={Detail}></Route>
      <Route
        path={`${path}/roles/detail/:rolesUuid`}
        component={RolesDetail}
      ></Route>

      <Route
        exact
        path={`${path}/group/detail/:groupUuid`}
        component={GroupDetail}
      ></Route>
    </Switch>
  );
};

export default withRouter(User);
