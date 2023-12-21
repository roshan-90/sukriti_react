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
import { clearUser } from "../features/authenticationSlice";

const AppBar = () => {
  const dispatch = useDispatch();
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
            {/* {
                  userRole === "Super Admin" ?
                      <NavItem>
                          <NavLink
                              style={navLinkStyle}
                              onClick={() => {
                                  props.history.push("/vendor");
                              }}
                          >
                              Vendor
                          </NavLink>
                      </NavItem>
                      : null
              } */}
          </Nav>

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
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AppBar;
