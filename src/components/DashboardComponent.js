// DashboardComponent.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut, invokeLambda } from "../services/authService";
import { selectUser, selectIsAuthenticated } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../features/authSlice";
import { executeGetUserDetailsLambda } from "../awsClients/administrationLambdas";

const DashboardComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login");
    } else {
      // Invoke Lambda function when the dashboard component mounts
      invokeLambda();
    }
  }, [isAuthenticated, navigate]);

  const handleSignOut = () => {
    dispatch(clearUser());
  };

  if (!isAuthenticated) {
    // Return null if not authenticated to prevent rendering the component
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default DashboardComponent;
