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
} from "../../awsClients/androidEnterpriseLambda";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { selectUser } from "../../features/authenticationSlice";
import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";

function AndroidDetails() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);
  const [listEnterprise, setListEnterprise] = useState(undefined);
  const [listDevices, setListDevices] = useState(undefined);
  const [showDeviceData, setShowDeviceData] = useState(undefined);

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
              width: "30px",
              height: "30px",
              borderRadius: "5%",
            }}
          />
        </div>

        <div style={{ float: "left", marginLeft: "10px" }}>
          <div style={{ ...complexCompositionStyle.complexTitleClient }}>
            {"Android Enterprise"}
          </div>
        </div>
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
    fontSize: "8px",
    fontWeight: "normal",
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
                return (
                  <>
                    <div className="row" style={rowStyle} key={index}>
                      <div className="col-md-2" style={colStyle}>
                        <div style={circleStyle}></div>
                      </div>
                      <div
                        className="col-md-8"
                        style={textStyle}
                        onClick={() => handleClickDevice(data)}
                      >
                        {data.name}
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
                          {showDeviceData.softwareInfo.androidVersion}
                        </p>
                        <p>
                          Build Number:{" "}
                          {showDeviceData.softwareInfo.androidBuildNumber}
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
            <Button
              style={{ float: "right", padding: "0px 0px 0px 0px" }}
              color="primary"
              className="px-4"
              //   onClick={() => setSelectedCabin(props.cabin)}
            >
              + Create Enterprise
            </Button>
            <ErrorBoundary>{memoizedDeviceInfoComponent}</ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AndroidDetails;
