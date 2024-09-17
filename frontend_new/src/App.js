import React, { useEffect } from "react";
import "./App.css";
import ManagerDashboard from "./components/ManagerDashboard";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import LoginPage from "./components/LoginPage";
import { useAuthState, useAuthDispatch } from "./context";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  let { user } = useAuthState();
  let dispatch = useAuthDispatch();
  let leaveTypes = [];

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (!e.user) dispatch({ type: "LOGOUT" });
    });
    // fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = () => {
    fetch("http://127.0.0.1:8000/leave-types/add-leave-type")
      .then((response) => response.json())
      .then((data) => {
        // setLeaveTypes([...data]);
        leaveTypes = data;
      });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/login" exact>
          {user ? (
            user.is_employee ? (
              <Redirect to="/employee" />
            ) : user.is_manager ? (
              <Redirect to="/manager" />
            ) : (
              <Redirect to="/admin" />
            )
          ) : (
            <LoginPage />
          )}
        </Route>
        <ProtectedRoute path="/" exact>
          {user ? (
            user.is_employee ? (
              <Redirect to="/employee" />
            ) : user.is_manager ? (
              <Redirect to="/manager" />
            ) : (
              <Redirect to="/admin" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </ProtectedRoute>
        <ProtectedRoute path="/manager">
          {user ? (
            user.is_manager ? (
              <ManagerDashboard />
            ) : (
              <Redirect to="/login" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </ProtectedRoute>
        <ProtectedRoute path="/admin">
          {user ? (
            user.is_admin ? (
              <AdminDashboard />
            ) : (
              <Redirect to="/login" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </ProtectedRoute>
        <ProtectedRoute path="/employee">
          {user ? (
            user.is_employee ? (
              <EmployeeDashboard leaveTypes={leaveTypes} />
            ) : (
              <Redirect to="/login" />
            )
          ) : (
            <Redirect to="/login" />
          )}
        </ProtectedRoute>
      </BrowserRouter>
    </div>
  );
}

export default App;
