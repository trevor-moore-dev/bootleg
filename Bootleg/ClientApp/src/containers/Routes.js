import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../components/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Account from "../pages/Account";

// Trevor Moore
// CST-451
// 12/9/2019
// This is my own work.

// Define our routes and the component they render:
export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />

      <Route path="/login" component={Login} />

      <Route path="/account" component={Account} />
      <Route path="/account/:id" component={Account} />

      <Route path="/messages" component={Home} />
      <Route path="/messages/:id" component={Home} />

      <Route path="/explore" component={Home} />

      <Route component={NotFound} />
    </Switch>
  );
}