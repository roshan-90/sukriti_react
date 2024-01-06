import React, { useState } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Input,
  Container,
  Form,
  Button,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import classnames from "classnames";
import ValidationMessageDialog from "../dialogs/ValidationMessageDialog"; // Adjust the path based on your project structure

const ConfigureUser = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [dialogData, setDialogData] = useState(null);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // State for form data
  const [organizationFormData, setOrganizationFormData] = useState({
    organization_name: "STATE",
    client_name: "SSF",
    organization_role: "VENDOR ADMIN",
  });

  const [communicationFormData, setCommunicationFormData] = useState({
    phone_number: "",
    email: "",
  });

  const handleOrganizationChange = (e) => {
    setOrganizationFormData({
      ...organizationFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCommunicationChange = (e) => {
    setCommunicationFormData({
      ...communicationFormData,
      [e.target.name]: e.target.value,
    });
  };

  const [userDetailsFormData, setUserDetailsFormData] = useState({
    organization_name: "STATE",
    client_name: "SSF",
    organization_role: "VENDOR ADMIN",
    name: "",
    gender: "",
    password: "",
    repeat_password: "",
    address: "",
    phone_number: "",
    email: "",
  });

  const handleUserDetailsChange = (e) => {
    setUserDetailsFormData({
      ...userDetailsFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    switch (true) {
      case userDetailsFormData.name == "":
        setDialogData({
          title: "Validation Error",
          message: "Please Fill Valid Name",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("validation");
          },
        });
        return null;
        break;
      case userDetailsFormData.password === "":
        setDialogData({
          title: "Validation Error",
          message: "Please Fill Valid Password",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("password validation");
          },
        });
        return null;
        break;
      case userDetailsFormData.gender === "":
        setDialogData({
          title: "Validation Error",
          message: "Please Select Valid Gender",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("gender validation");
          },
        });
        return null;
        break;
      case userDetailsFormData.repeat_password === "":
        setDialogData({
          title: "Validation Error",
          message: "Please Enter valid Repeat Password",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("gender validation");
          },
        });
        return null;
        break;
      case userDetailsFormData.address === "":
        setDialogData({
          title: "Validation Error",
          message: "Please Enter valid Address",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("gender validation");
          },
        });
        return null;
        break;
      case userDetailsFormData.phone_number === "":
        setDialogData({
          title: "Validation Error",
          message: "Please Enter Phone Number",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("Phone Number");
          },
        });
        return null;
        break;
      case userDetailsFormData.email === "":
        setDialogData({
          title: "Validation Error",
          message: "Please Enter valid Email",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("Email");
          },
        });
        return null;
        break;
      default:
        // All validations passed, proceed with your logic
        break;
    }
    console.log("userDetailsFormData");
    console.log(userDetailsFormData);
    // Handle form submission logic here
  };

  return (
    <>
      <ValidationMessageDialog data={dialogData} />
      <Container
        fluid
        className="d-flex justify-content-center"
        style={{ height: "580px", backgroundColor: "rgb(228, 229, 230)" }} // Set a fixed height here
      >
        <Card>
          <CardBody>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => toggleTab("1")}
                >
                  ORGANIZATION
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => toggleTab("2")}
                >
                  USER DETAILS
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "3" })}
                  onClick={() => toggleTab("3")}
                >
                  COMMUNICATION
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row className="justify-content-center">
                  <Col sm="12">
                    <Label>Organization Name</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="text"
                        name="organization_name"
                        placeholder="Organization name"
                        value={userDetailsFormData.organization_name}
                        onChange={handleUserDetailsChange}
                        disabled={true}
                      />
                    </InputGroup>
                    <Label>Client Name</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="text"
                        name="client_name"
                        placeholder="Client Name"
                        value={userDetailsFormData.client_name}
                        onChange={handleUserDetailsChange}
                        disabled={true}
                      />
                    </InputGroup>
                    <Label>Role</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="text"
                        name="organization_role"
                        placeholder="Organization Role"
                        value={userDetailsFormData.organization_role}
                        onChange={handleUserDetailsChange}
                        disabled={true}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    <Label>Name</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={userDetailsFormData.name}
                        onChange={handleUserDetailsChange}
                      />
                    </InputGroup>
                    <Label>Gender</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="select"
                        name="gender"
                        value={userDetailsFormData.gender}
                        onChange={handleUserDetailsChange}
                      >
                        <option value="">Select an option</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        {/* Add more options as needed */}
                      </Input>
                    </InputGroup>
                    <Label>Password</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={userDetailsFormData.password}
                        onChange={handleUserDetailsChange}
                      />
                    </InputGroup>
                    <Label>Repeat Password</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="password"
                        name="repeat_password"
                        placeholder="Repeat Password"
                        value={userDetailsFormData.repeat_password}
                        onChange={handleUserDetailsChange}
                      />
                    </InputGroup>
                    <Label>Address</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="textarea"
                        name="address"
                        placeholder="address"
                        value={userDetailsFormData.address}
                        onChange={handleUserDetailsChange}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col sm="12">
                    <Label>Phone Number</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="number"
                        name="phone_number"
                        placeholder="Phone Number"
                        value={userDetailsFormData.phone_number}
                        onChange={handleUserDetailsChange}
                      />
                    </InputGroup>
                    <Label>Email</Label>
                    <InputGroup className="mb-3">
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={userDetailsFormData.email}
                        onChange={handleUserDetailsChange}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </CardBody>
          <Button
            color="primary"
            style={{ width: "18%", margin: "4px" }}
            type="submit"
            onClick={handleSubmit}
          >
            confirm
          </Button>
        </Card>
      </Container>
    </>
  );
};

export default ConfigureUser;
