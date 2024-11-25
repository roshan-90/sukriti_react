// LoginComponent.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../services/authService";
import { setUsername, setTriggerFunction } from "../features/authenticationSlice";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import restroomImage from "../assets/img/brand/restroom.jpg";
import logo from "../assets/img/brand/logo.png";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { startLoading, stopLoading } from "../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../dialogs/MessageDialog"; // Adjust the path based on your project structure

const LoginComponent = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);
  console.log("sdsd3");
  const handleSignIn = () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    signIn(email, password, dispatch)
      .then((credentials) => {
        // The signIn function has completed successfully
        dispatch(setUsername(email));
        setTimeout(() => {
          dispatch(setTriggerFunction(true));
        }, 2000);
        // Additional logic with the credentials if needed
      })
      .catch((error) => {
        dispatch(stopLoading()); // Dispatch the stopLoading action
        // Handle errors from the signIn function
        console.error("Sign in failed:", error);
        setDialogData({
          title: "Error",
          message: error.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("handleSignIn Error:->", error);
          },
        });
      });
      // setTimeout(() => {
      //   dispatch(stopLoading()); // Dispatch the stopLoading action
      // }, 2000);
  };

  const HeaderComponent = () => {
    return (
      <div
        className={"row"}
        style={{
          marginTop: "40px",
        }}
      >
        <div className={"col"}>
          <div className={"row justify-content-center"}>
            <img
              src={logo}
              alt=""
              style={{
                marginTop: "20px",
                width: "180px",
                height: "30px",
                borderRadius: "5%",
              }}
            />
          </div>
          <div className={"row justify-content-center"}></div>
        </div>
      </div>
    );
  };

  const styles = {
    container: {
      backgroundImage: `url(${restroomImage})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
  };

  return (
    <div className="col-md-12" style={styles.container}>
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }} // Set the color using the style prop
          />
        </div>
      )}
      <MessageDialog data={dialogData} />
      <div
        style={{
          height: "100vh",
          transition: "opacity 2.5s",
          opacity: ".9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container fluid>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card
                  className="text-black py-5 d-md-down-none card"
                  style={{ width: "24%" }}
                >
                  <CardBody className="text-center">
                    <HeaderComponent />
                  </CardBody>
                </Card>
                <Card className="p-4 card">
                  <CardBody>
                    <Form>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupText>
                          <PersonOutlineOutlinedIcon />
                        </InputGroupText>
                        <Input
                          type="text"
                          placeholder="Username"
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupText>
                          <LockOutlinedIcon />
                        </InputGroupText>
                        <Input
                          type="password"
                          placeholder="Password"
                          onChange={(event) => setPassword(event.target.value)}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            onClick={handleSignIn}
                          >
                            Login
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LoginComponent;
