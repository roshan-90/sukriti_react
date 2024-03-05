import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import logo from "../assets/img/brand/logo.png";
import { useNavigate } from "react-router-dom";
import { clearUser, selectUser } from "../features/authenticationSlice";
import Badge from "@mui/material/Badge";
import MessageDialog from "../dialogs/MessageDialog"; // Adjust the path based on your project structure

const AppBar = ({ isOnline }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [dialogData, setDialogData] = useState(null);

  const toggle = () => setIsOpen(!isOpen);

  const navLinkStyle = { cursor: "pointer", fontSize: "16px" };
  const confirmSignOut = () => {
    window.location.reload();
    dispatch(clearUser());
  };

  const syncFunction = async () => {
    console.log("click");
    let result_90 = await executeFetchDashboardLambda(
      user?.username,
      "90",
      "all",
      user?.credentials
    );
    console.log("result_90", result_90);
    setLocalStorageItem("dashboard_90", JSON.stringify(result_90));
  };

  const setOfflineMessage = (title) => {
    return (message) => {
      return (name) => {
        console.log("title ", title);
        console.log("message ", message);
        setDialogData({
          title: title,
          message: message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`${name} -->`);
          },
        });
      };
    };
  };

  return (
    <div>
      <Navbar color="white" light expand="md">
        <MessageDialog data={dialogData} />
        <NavbarBrand href="/">
          <img src={logo} style={{ width: 180 }} alt="" />
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />

        <Collapse
          style={{ marginLeft: "0px", justifyContent: "space-between" }}
          isOpen={isOpen}
          navbar
        >
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  navigate("/dashboard"); // Use navigate for navigation
                }}
              >
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  console.log("isOnline", isOnline);
                  if (isOnline) {
                    navigate("/complex/details");
                  } else {
                    setOfflineMessage("Offline")(
                      "Feature is not available in Offline Mode"
                    )("complex_detail");
                  }
                }}
              >
                Complexes
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  if (isOnline) {
                    navigate("/incidence/tickets");
                  } else {
                    setOfflineMessage("Offline")(
                      "Feature is not available in Offline Mode"
                    )("incidence ticket");
                  }
                }}
              >
                Incidence
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  navigate("/reports");
                }}
              >
                Reports
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  if (isOnline) {
                    navigate("/administration");
                  } else {
                    setOfflineMessage("Offline")(
                      "Feature is not available in Offline Mode"
                    )("administration");
                  }
                }}
              >
                Administration
              </NavLink>
            </NavItem>
            {user?.user?.userRole === "Super Admin" ? (
              <NavItem>
                <NavLink
                  style={navLinkStyle}
                  onClick={() => {
                    if (isOnline) {
                      navigate("/vendor");
                    } else {
                      setOfflineMessage("Offline")(
                        "Feature is not available in Offline Mode"
                      )("vendor");
                    }
                  }}
                >
                  Vendor
                </NavLink>
              </NavItem>
            ) : null}
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  navigate("/android_management");
                }}
              >
                Android Management
              </NavLink>
            </NavItem>
          </Nav>
          <span
            style={{
              float: "right",
            }}
          >
            {/* <Button
              outline
              color="primary"
              // className="px-4"
              style={{
                float: "left",
                height: "37px",
                padding: "1px",
                background: "blue",
                margin: "1px",
              }}
            >
              {isOnline ? (
                <p style={{ color: "white" }}>Online</p>
              ) : (
                <p style={{ color: "red" }}>Offline</p>
              )}
            </Button> */}
            <Button
              outline
              color="primary"
              className="px-4"
              style={{
                float: "right",
                marginLeft: "7px",
              }}
              onClick={syncFunction}
            >
              Sync Data
            </Button>
            <Badge
              color={isOnline ? "success" : "error"}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              badgeContent={
                isOnline ? (
                  <p style={{ color: "white", margin: "2px" }}>Online</p>
                ) : (
                  <p style={{ color: "white", margin: "2px" }}>Offline</p>
                )
              }
            >
              <Button
                outline
                color="primary"
                className="px-4"
                style={{
                  float: "right",
                }}
                onClick={confirmSignOut}
              >
                <i className="fa fa-lock"></i> Logout
              </Button>
            </Badge>
          </span>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AppBar;
