import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "../components/NotFound";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Messages from "../pages/Messages";
import Post from "../pages/Post";
import User from "../pages/User";
import Login from "../pages/Login";
import Search from "../pages/Search";
import AddPost from "../pages/AddPost";

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
      <Route path="/user/:id" component={User} />
      <Route path="/messages" component={Messages} />
      <Route path="/post/:id" component={Post} />
      <Route path="/create" component={AddPost} />
      <Route path="/explore" component={Explore} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}