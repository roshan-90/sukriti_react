import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  lazy,
  useCallback,
  useMemo,
} from "react";
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

function AndroidDetails() {
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

  // Rename the function to start with an uppercase letter
  const DevicesComponent = () => {
    console.log("hellog");
    return (
      <div className="row" style={{ background: "white", padding: "5px" }}>
        <Header />
        {/* <NoDataComponent /> */}
        <div style={{ width: "100%" }}>
          <div style={{ padding: "10px", overflow: "auto" }}>
            <div className="row" style={rowStyle}>
              <div className="col-md-2" style={colStyle}>
                <div style={circleStyle}></div>
              </div>
              <div className="col-md-8" style={textStyle}>
                Android lists
              </div>
            </div>
            <div className="row" style={rowStyle}>
              <div className="col-md-2" style={colStyle}>
                <div style={circleStyle}></div>
              </div>
              <div className="col-md-8" style={textStyle}>
                Android lists2
              </div>
            </div>
            <div className="row" style={rowStyle}>
              <div className="col-md-2" style={colStyle}>
                <div style={circleStyle}></div>
              </div>
              <div className="col-md-8" style={textStyle}>
                Android lists3
              </div>
            </div>
            <div className="row" style={rowStyle}>
              <div className="col-md-2" style={colStyle}>
                <div style={circleStyle}></div>
              </div>
              <div className="col-md-8" style={textStyle}>
                Android lists4
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const memoizedDeviceComponent = useMemo(() => {
    return <DevicesComponent />;
  }, []);

  const ListsDeviceComponent = () => {
    console.log("hellog");
    return (
      <div
        className="row"
        style={{ marginTop: "10px", background: "white", padding: "5px" }}
      >
        <ListDeviceHeader />
        <div
          style={{
            ...whiteSurface,
            background: "white",
            width: "100%",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={circleStyle}></div>{" "}
          <div style={{ ...complexCompositionStyle.cabinTitle, float: "left" }}>
            {"child android device"}
          </div>
          <Button
            style={{ float: "right", padding: "0px 0px 0px 0px" }}
            color="primary"
            className="px-4"
            //   onClick={() => setSelectedCabin(props.cabin)}
          >
            Details
          </Button>
        </div>
      </div>
    );
  };

  const memoizedListsDeviceComponent = useMemo(() => {
    return <ListsDeviceComponent />;
  }, []);

  const DeviceInfoComponent = () => {
    console.log("hellog");
    return (
      <>
        <h2>helo this is</h2>
      </>
    );
  };

  const memoizedDeviceInfoComponent = useMemo(() => {
    return <DeviceInfoComponent />;
  }, []);

  return (
    <ErrorBoundary>
      <div className="animated fadeIn" style={{ padding: "10px" }}>
        {/* <Mqtt5 /> */}
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
