import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../components/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />

      <Route path="/user/login" component={Login} />

      <Route component={NotFound} />
    </Switch>
  );
}
