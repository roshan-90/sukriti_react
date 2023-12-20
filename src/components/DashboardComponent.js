// DashboardComponent.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut, invokeLambda } from "../services/authService";
import {
  selectUser,
  selectIsAuthenticated,
} from "../features/authenticationSlice";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../features/authenticationSlice";
import { executelistTeamLambda } from "../awsClients/administrationLambdas";
import { setTeamList } from "../features/adminstrationSlice";

const DashboardComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  console.log("user", user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      executelistTeamLambda(user?.username, user?.credentials)
        .then((teamlist) => {
          console.log("dashboard");
          console.log(teamlist);
          dispatch(setTeamList(teamlist?.teamDetails));
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
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
