import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../components/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />

      <Route path="/user/login" component={Login} />
	  <Route path="/user/register" component={Register} />

      <Route component={NotFound} />
    </Switch>
  );
}
