// LoginComponent.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signIn } from "../services/authService";
import { setUsername, setLoggedIn } from "../features/authSlice";
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
import { executeGetUserDetailsLambda } from "../awsClients/administrationLambdas";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    signIn(email, password, dispatch)
      .then((credentials) => {
        console.log(credentials);
        console.log("check");
        dispatch(setLoggedIn(credentials));
        // The signIn function has completed successfully
        dispatch(setUsername(email));
        // Additional logic with the credentials if needed
      })
      .catch((error) => {
        // Handle errors from the signIn function
        console.error("Sign in failed:", error);
      });
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
                          <i className="icon-user" />
                        </InputGroupText>
                        <Input
                          type="text"
                          placeholder="Username"
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupText>
                          <i className="icon-lock" />
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
