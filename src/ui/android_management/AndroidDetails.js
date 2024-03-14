import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  lazy,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "../../components/ErrorBoundary";
import NoDataComponent from "../../components/NoDataComponent";
import {
  colorTheme,
  whiteSurfaceCircularBorder,
  complexCompositionStyle,
  whiteSurface,
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import { Button } from "reactstrap";
import "./android.css";
import {
  executelistEnterprisesAndroidManagementLambda,
  executelistDevicesAndroidManagementLambda,
  executeCreateEnterpriseAndroidManagementLambda,
} from "../../awsClients/androidEnterpriseLambda";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { selectUser } from "../../features/authenticationSlice";
import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const CreateEnterpriseModal = ({ isOpen, toggleModal }) => {
  const [formData, setFormData] = useState({
    // Define form fields and initial values here
    enterpriseName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, e.g., send data to server
    console.log(formData);
    // Close the modal after form submission
    toggleModal();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Create Enterprise</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="enterpriseName">Enterprise Name</Label>
            <Input
              type="text"
              name="enterpriseName"
              id="enterpriseName"
              value={formData.enterpriseName}
              onChange={handleChange}
            />
          </FormGroup>
          {/* Add more form fields as needed */}
          <Button type="submit" color="primary">
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

function AndroidDetails() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);
  const [listEnterprise, setListEnterprise] = useState(undefined);
  const [listDevices, setListDevices] = useState(undefined);
  const [showDeviceData, setShowDeviceData] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
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

  const createEnterprise = async () => {
    try {
      console.log('create android enterprise');
      var result = await executeCreateEnterpriseAndroidManagementLambda(user?.credentials);
      console.log('executeCreateEnterpriseAndroidManagementLambda',result);
      window.open(`${result?.body?.signupUrl}`,"_blank");
    } catch( err) {
      handleError(err, 'Error create android enterprise')
    }
  }

  const fetchListEnterprisesData = async () => {
    try {
      setListDevices(null);
      dispatch(startLoading()); // Dispatch the startLoading action
      var result = await executelistEnterprisesAndroidManagementLambda(
        user?.credentials
      );
      console.log("fetchListEnterprisesData", result);
      setListEnterprise(result.body.enterprises);
    } catch (err) {
      handleError(err, "fetchListEnterprisesData");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const fetchListDevicesData = async (enterpriseId) => {
    try {
      setListDevices(null);
      dispatch(startLoading()); // Dispatch the startLoading action
      var result = await executelistDevicesAndroidManagementLambda(
        enterpriseId,
        user?.credentials
      );
      console.log("fetchListDevicesData", result);
      setListDevices(result.body.devices);
    } catch (err) {
      handleError(err, "fetchListDevicesData");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  useEffect(() => {
    fetchListEnterprisesData();
  }, []);

  const Header = () => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: colorTheme.primary,
          padding: "10px",
        }}
      >
        <div
          style={{
            ...whiteSurfaceCircularBorder,
            float: "left",
            padding: "10px",
            width: "50px",
            height: "50px",
          }}
        >
          <img
            src={icToilet}
            alt=""
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "5%",
            }}
          />
        </div>

        <div style={{ float: "left", marginLeft: "10px",marginRight: "10px" }}>
          <div style={{ ...complexCompositionStyle.complexTitleClient }}>
            {"Enterprise"}
          </div>
        </div>
        <Button
              onClick={() => {
                createEnterprise();
              }}
              outline
              color="primary"
              className="px-2 d-flex align-items-center" // Adjust padding and add flex properties
              style={{
                width: "70px",
                height: "30px",
                borderRadius: "8%",
                fontSize: "14px", // Adjust font size here
              }}
            >
  <span style={{ marginRight: '5px' }}>+</span> New {/* Wrap the + sign in a span */}
            </Button>
      </div>
      
    );
  };

  const ListDeviceHeader = () => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: colorTheme.primary,
          padding: "10px",
        }}
      >
        <div
          style={{
            ...whiteSurfaceCircularBorder,
            float: "left",
            padding: "10px",
            width: "50px",
            height: "50px",
          }}
        >
          <img
            src={icToilet}
            alt=""
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "5%",
            }}
          />
        </div>

        <div style={{ float: "left", marginLeft: "10px" }}>
          <div style={{ ...complexCompositionStyle.complexTitleClient }}>
            {"Android Device List"}
          </div>
          
          {/* <div style={{ ...complexCompositionStyle.complexTitle }}>
            {"Client: " + "dsf"}
          </div>
          <div style={{ ...complexCompositionStyle.complexSubTitle }}>
            {"ds" + ": " + "sd" + ": " + "dsf"}
          </div> */}
        </div>
      </div>
    );
  };

  const circleStyle = {
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 8px 0px",
    backgroundColor: "green",
    borderRadius: "50%",
    width: "10px",
    height: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const rowStyle = {
    margin: "10px 0px 0px",
    padding: "10px",
    cursor: "pointer",
  };

  const colStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px",
  };

  const textStyle = {
    color: "black",
    fontSize: "11px",
    // fontWeight: "normal",
    fontWeight: "700",
    fontStyle: "normal",
  };

  const handleClickEnterpise = (data) => {
    fetchListDevicesData(data);
  };

  const handleClickDevice = (data) => {
    setShowDeviceData(null);
    console.log("data", data);
    setShowDeviceData(data);
  };

  // Rename the function to start with an uppercase letter
  const ListEnterpriseComponent = () => {
    console.log("listEnterprise", listEnterprise);
    return (
      <div className="row" style={{ background: "white", padding: "5px" }}>
        <Header />
        {/* <NoDataComponent /> */}
        {listEnterprise && (
          <div style={{ width: "100%" }}>
            <div style={{ padding: "10px", overflow: "auto" }}>
              {listEnterprise.map((data, index) => {
                console.log("chekcing dagta", data);
                return (
                  <div className="row" style={rowStyle} key={index}>
                    <div className="col-md-2" style={colStyle}>
                      <div style={circleStyle}></div>
                    </div>
                    <div
                      className="col-md-8"
                      style={textStyle}
                      onClick={() => handleClickEnterpise(data.name)}
                    >
                      {data.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const memoizedDeviceComponent = useMemo(() => {
    return <ListEnterpriseComponent />;
  }, [listEnterprise]);

  const deviceName = (name) => {
    let array = name.split("/");
    return `${array[2]}/${array[3]}`;
  };

  const ListsDeviceComponent = () => {
    console.log("listDevices", listDevices);
    return (
      <div
        className="row"
        style={{ marginTop: "10px", background: "white", padding: "5px" }}
      >
        {listDevices && (
          <>
            <ListDeviceHeader />
            <div
              style={{
                ...whiteSurface,
                background: "white",
                width: "100%",
                overflow: "auto",
                //   display: "flex",
                //   alignItems: "center",
                //   justifyContent: "space-between",
              }}
            >
              {listDevices.map((data, index) => {
                const circleColor =
                  data.state == "PROVISIONING" ? "red" : "green";

                let circleActive = {
                  boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 8px 0px",
                  backgroundColor: circleColor,
                  borderRadius: "50%",
                  width: "10px",
                  height: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                };
                return (
                  <>
                    <div className="row" style={rowStyle} key={index}>
                      <div className="col-md-2" style={colStyle}>
                        <div style={circleActive}></div>
                      </div>
                      <div
                        className="col-md-8"
                        style={textStyle}
                        onClick={() => handleClickDevice(data)}
                      >
                        {deviceName(data.name)} {/* Call the function here */}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const memoizedListsDeviceComponent = useMemo(() => {
    return <ListsDeviceComponent />;
  }, [listDevices]);

  const DeviceInfoComponent = () => {
    console.log("showDeviceData", showDeviceData);
    return (
      <>
        {showDeviceData && (
          <div className="container">
            <div className="Qr_image">
              <img src="assets/img/QRCopyimage.png" alt="QR Code Image" />
            </div>
            <div
              style={{
                ...whiteSurface,
                background: "white",
                width: "100%",
                overflow: "auto",
              }}
            >
              <Row>
                <Col md="6">
                  <Card
                    style={{
                      ...whiteSurface,
                      background: "white",
                      margin: "10px",
                    }}
                  >
                    <CardBody>
                      <CardTitle>
                        <b>Hardware Info</b>
                      </CardTitle>
                      <CardText>
                        <p>Brand: {showDeviceData.hardwareInfo.brand}</p>
                        <p>Model: {showDeviceData.hardwareInfo.model}</p>
                        <p>
                          Serial Number:{" "}
                          {showDeviceData.hardwareInfo.serialNumber}
                        </p>
                        {/* Add more hardware info fields as needed */}
                      </CardText>
                    </CardBody>
                  </Card>
                  <Card
                    style={{
                      ...whiteSurface,
                      background: "white",
                      margin: "10px",
                    }}
                  >
                    <CardBody>
                      <CardTitle>
                        <b>Software Info</b>
                      </CardTitle>
                      <CardText>
                        <p>
                          Android Version:{" "}
                          {showDeviceData?.softwareInfo?.androidVersion}
                        </p>
                        <p>
                          Build Number:{" "}
                          {showDeviceData?.softwareInfo?.androidBuildNumber}
                        </p>
                        {/* Add more software info fields as needed */}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="6">
                  <Card
                    style={{
                      ...whiteSurface,
                      background: "white",
                      margin: "10px",
                    }}
                  >
                    <CardBody>
                      <CardTitle>
                        <b>Memory Info</b>
                      </CardTitle>
                      <CardText>
                        <p>Total RAM: {showDeviceData.memoryInfo.totalRam}</p>
                        <p>
                          Total Internal Storage:{" "}
                          {showDeviceData.memoryInfo.totalInternalStorage}
                        </p>
                        {/* Add more memory info fields as needed */}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </>
    );
  };

  const memoizedDeviceInfoComponent = useMemo(() => {
    return <DeviceInfoComponent />;
  }, [showDeviceData]);

  return (
    <ErrorBoundary>
      <div className="animated fadeIn" style={{ padding: "10px" }}>
        {isLoading && (
          <div className="loader-container">
            <CircularProgress
              className="loader"
              style={{ color: "rgb(93 192 166)" }}
            />
          </div>
        )}
        <div className="row">
          <div className="col-md-2" style={{}}>
            {/* <MessageDialog ref={messageDialog} /> */}
            <ErrorBoundary>{memoizedDeviceComponent}</ErrorBoundary>
            <ErrorBoundary>{memoizedListsDeviceComponent}</ErrorBoundary>
          </div>
          <div className="col-md-10" style={{}}>
            {/* <Button
              style={{ float: "right", padding: "0px 0px 0px 0px" }}
              color="primary"
              className="px-4"
              onClick={toggleModal}
            >
              Add Enterprise
            </Button>
            <CreateEnterpriseModal
              isOpen={modalOpen}
              toggleModal={toggleModal}
            /> */}
            <Button
              onClick={() => {
                createEnterprise();
              }}
              outline
              color="primary"
              className="px-4"
              style={{
                float: "right",
                marginLeft: "3px"
              }}
            >
              Update
            </Button>
            <Button
              onClick={() => {
                createEnterprise();
              }}
              outline
              color="primary"
              className="px-4"
              style={{
                float: "right",
              }}
            >
              Delete
            </Button>
            
            <ErrorBoundary>{memoizedDeviceInfoComponent}</ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AndroidDetails;
