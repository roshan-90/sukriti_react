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
import MemberDetails from "./MemberDetails";
import MemberAccess from "./MemberAccess";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  setAccessTree,
  authState,
} from "../../features/authenticationSlice";
import { setTeamList } from "../../features/adminstrationSlice";
import {
  executelistTeamLambda,
  executeFetchCompletedUserAccessTree,
} from "../../awsClients/administrationLambdas";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import MessageDialog from "../../dialogs/MessageDialog";

const MemberDetailsHome = (props) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(new Array(2).fill("1"));
  const { id } = useParams();
  const user = useSelector(selectUser);
  let data = useSelector((state) => state.adminstration.teamList);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);
  const authStated = useSelector(authState);

  const fetchAndInitTeam = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var result = await executelistTeamLambda(
        user?.username,
        user?.credentials
      );
      console.log("result--->", result);
      dispatch(setTeamList(result.teamDetails));
    } catch (err) {
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog("Error Alert!", err.message);
      let text = err.message.includes("expired");
      if (text) {
        setDialogData({
          title: "Error",
          message: err.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("fetchDashboardData Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("fetchAndInitClientList Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };
  const initFetchCompletedUserAccessTreeAction = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeFetchCompletedUserAccessTree(
        id,
        user?.credentials
      );
      console.log(
        "MemberDetail Home initFetchCompletedUserAccessTreeAction-->",
        result
      );
      dispatch(setAccessTree(result));
    } catch (err) {
      let text = err.message ? err.message.includes("expired") : null;
      if (text) {
        setDialogData({
          title: "Error",
          message: `${err.message} Please Login again`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("initFetchCompletedUserAccessTreeAction Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: err.errorMessage,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("initFetchCompletedUserAccessTreeAction Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  useEffect(() => {
    // props.removeComponentProps(UiAdminDestinations.MemberAccess);
    // props.removeComponentProps(UiAdminDestinations.MemberDetails);
    fetchAndInitTeam();
    initFetchCompletedUserAccessTreeAction();
  }, []);

  console.log("found data", data);

  let user_data = data.filter((data) => data.userName == id);

  console.log("props", user_data[0]);
  const toggle = (tabPane, tab) => {
    const newArray = activeTab.slice();
    newArray[tabPane] = tab;
    setActiveTab(newArray);
  };

  const tabPane = () => {
    if (user_data.length == 0) {
      return null;
    }
    // if (!props.location || !props.location.data) {
    //   return null; // Render nothing if data is not available
    // }
    return (
      <>
        <TabPane tabId="2">
          <MemberAccess user={user_data[0]} />
        </TabPane>
        <TabPane tabId="1">
          <MemberDetails user={user_data[0]} />
        </TabPane>
      </>
    );
  };

  return (
    <div className="animated fadeIn">
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
                Member Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab[0] === "2"}
                onClick={() => {
                  toggle(0, "2");
                }}
              >
                Member Access
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab[0]}>{tabPane()}</TabContent>
        </Col>
      </Row>
    </div>
  );
};

export default MemberDetailsHome;
