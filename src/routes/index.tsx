import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Signin from '../pages/SignIn';
import Signup from '../pages/SignUp';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Signin} />
    <Route path="/signup" exact component={Signup} />
  </Switch>
);

export default Routes;
