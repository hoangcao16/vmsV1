import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import AddGroup from './dataListGroup/AddGroup';
// import AddMemberInGroup from './dataListGroup/tableDetail/AddMemberInGroup';
import GroupDetail from './dataListGroup/tableDetail/GroupDetail';
import GeneralGroup from './GeneralGroup';

const Group = (props) => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={GeneralGroup}></Route>
      <Route path={`${path}/add-group`} component={AddGroup}></Route>
      <Route
        exact
        path={`${path}/group/detail/:groupUuid`}
        component={GroupDetail}
      ></Route>
      {/* <Route
        exact
        path={`${path}/group/detail/:groupUuid/add-member`}
        component={AddMemberInGroup}
      ></Route> */}
    </Switch>
  );
};

export default Group;
