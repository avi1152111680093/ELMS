import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuthState } from "../context";

function ProtectedRoute({ component: Component, ...rest }) {
  const { access_token } = useAuthState();

  return (
    <Route
      {...rest}
      render={(props) =>
        access_token ? (
          <Component />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export default ProtectedRoute;
