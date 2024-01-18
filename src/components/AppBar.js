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

const AppBar = ({ isOnline }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const navLinkStyle = { cursor: "pointer", fontSize: "16px" };
  const confirmSignOut = () => {
    window.location.reload();
    dispatch(clearUser());
  };

  return (
    <div>
      <Navbar color="white" light expand="md">
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
                  navigate("/complex/details");
                }}
              >
                Complexes
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  navigate("/incidence/tickets");
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
                  navigate("/administration");
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
                    navigate("/vendor");
                  }}
                >
                  Vendor
                </NavLink>
              </NavItem>
            ) : null}
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
