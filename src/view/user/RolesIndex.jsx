import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AddRoles from './dataListRole/AddRoles';
import RolesDetail from './dataListRole/tableDetail/RolesDetail';
import GeneralRoles from './GeneralRoles';

const Roles = (props) => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={GeneralRoles}></Route>
      <Route path={`${path}/add-roles`} component={AddRoles}></Route>

      <Route
        path={`${path}/roles/detail/:rolesUuid`}
        component={RolesDetail}
      ></Route>
    </Switch>
  );
};

export default Roles;
