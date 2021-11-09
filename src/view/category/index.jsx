import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TableCategory from './TableCategory';

const Category = (props) => {
  const { match } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${match.url}`}
          component={() => <TableCategory match_parent={match} />}
        />
      </Switch>
    </div>
  );
};

export default Category;
