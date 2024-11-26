import React, { useEffect, useState } from "react";
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import UserDetails from "./UserDetails";
import UserAccess from "./UserAccess";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  setAccessTree,
  authState,
} from "../../features/authenticationSlice";
import {
  executeFetchCompletedUserAccessTree,
} from "../../awsClients/administrationLambdas";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import MessageDialog from "../../dialogs/MessageDialog";
import "../administration/custom.css";


const UserProfile = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(new Array(2).fill("1"));
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);

  const handleError = (err, Custommessage, onclick = null) => {
    console.log("error -->", err);
    let text = err.message.includes("expired");
    if (text) {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    } else {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    }
  };

  const initFetchCompletedUserAccessTreeAction = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeFetchCompletedUserAccessTree(
        user?.username,
        user?.credentials
      );
      console.log(
        "MemberDetail Home initFetchCompletedUserAccessTreeAction-->",
        result
      );
      dispatch(setAccessTree(result));
    } catch (err) {
      handleError(err, "initFetchCompletedUserAccessTreeAction");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  useEffect(() => {
    initFetchCompletedUserAccessTreeAction();
  }, []);

  const toggle = (tabPane, tab) => {
    const newArray = activeTab.slice();
    newArray[tabPane] = tab;
    setActiveTab(newArray);
  };

  const tabPane = () => {
    if (user == null) {
      return null;
    }

    return (
      <>
        <TabPane tabId="2">
          <UserAccess user={user?.user} />
        </TabPane>
        <TabPane tabId="1">
          <UserDetails user={user?.user} />
        </TabPane>
      </>
    );
  };

  return (
    <div className="animated fadeIn" style={{ marginTop: "22px"}}>
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <MessageDialog data={dialogData} />
      <Row>
        <Col xs="12" md="12">
          <Nav tabs>
            <NavItem>
              <NavLink
                active={activeTab[0] === "1"}
                onClick={() => {
                  toggle(0, "1");
                }}
              >
                User Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab[0] === "2"}
                onClick={() => {
                  toggle(0, "2");
                }}
              >
                User Access
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab[0]}>{tabPane()}</TabContent>
        </Col>
      </Row>
    </div>
  );

}

export default UserProfile