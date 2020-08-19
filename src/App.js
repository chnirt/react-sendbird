import React, { Suspense } from "react";
import "./styles.css";
import { useRoutes } from "react-router-dom";

import {
  Login,
  Register,
  Channels,
  ChannelsIndex,
  Channel,
  OwnUserProfile,
  NotFound,
  CreateChannel
} from "./screens";
import { Loading } from "./components";
import { PublicRoute, PrivateRoute } from "./helper";

export default function App() {
  // We removed the <BrowserRouter> element from App because the
  // useRoutes hook needs to be in the context of a <BrowserRouter>
  // element. This is a common pattern with React Router apps that
  // are rendered in different environments. To render an <App>,
  // you'll need to wrap it in your own <BrowserRouter> element.
  let element = useRoutes([
    // A route object has the same properties as a <Route>
    // element. The `children` is just an array of child routes.
    {
      path: "/",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      )
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      )
    },
    {
      path: "channels",
      element: (
        <PrivateRoute>
          <Channels />
        </PrivateRoute>
      ),
      children: [
        {
          path: "/",
          element: <ChannelsIndex />
        },
        { path: "create", element: <CreateChannel /> },
        { path: ":url", element: <Channel /> },
        { path: "me", element: <OwnUserProfile /> }
      ]
    },
    { path: "*", element: <NotFound /> }
  ]);

  return (
    <Suspense fallback={Loading}>
      {/* <Link to="/">Login</Link>| <Link to="/register">Register</Link>|
      <Link to="/channels">Channels</Link>|
      <Link to="/channels/123">UserProfile</Link>|
      <Link to="/channels/me">OwnUserProfile</Link> <br /> */}
      {element}
    </Suspense>
  );
}
