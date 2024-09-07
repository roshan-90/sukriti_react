import React, { useEffect, useImperativeHandle, useRef } from "react";
import { Button } from "reactstrap";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import { executeGetComplexCompositionLambda } from "../../awsClients/complexLambdas";
import {
  colorTheme,
  whiteSurface,
  complexCompositionStyle,
  whiteSurfaceCircularBorder,
  selectedSurface,
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import "./ComplexComposition.css";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setPushComplexPosition,
  updateSelectedCabin,
  complexStore,
  removeComplexComposition,
} from "../../features/complesStoreSlice";
import { startLoading, stopLoading } from "../../features/loadingSlice";

const ComplexComposition = React.forwardRef((props, ref) => {
  // const messageDialog = useRef();
  // const loadingDialog = useRef();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const prevProps = useRef(props);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const complex_store = useSelector(complexStore);
  console.log("first complex composition -->", props);
  console.log("second complex composition -->", complex_store);
  // dispatch(startLoading()); // Dispatch the startLoading action

  // useEffect(() => {
  //   console.log("111complex-compostion--->");
  //   if (
  //     complex_store?.complex !== undefined &&
  //     complex_store?.complexStore[complex_store.complex?.name] == undefined
  //   )
  //     console.log(" props complex-compostion--->", props);
  //   fetchComplexComposition();
  // }, [props]);
  let name;
  const fetchComplexComposition = async () => {
    // loadingDialog.current.showDialog();
    console.log("fetchcomplexcompostion start");
    try {
      const result = await executeGetComplexCompositionLambda(
        complex_store?.complex?.name,
        user?.credentials
      );
      console.log("complex postion lamda", result);
      console.log("complex-store", complex_store?.complex?.name);
      dispatch(
        setPushComplexPosition({
          hierarchy: complex_store?.hierarchy,
          complexDetails: complex_store?.complex,
          complexComposition: result,
        })
      );
      dispatch(stopLoading()); // Dispatch the stopLoading action

      // loadingDialog.current.closeDialog();
    } catch (err) {
      dispatch(stopLoading()); // Dispatch the stopLoading action
      // loadingDialog.current.closeDialog();
      // messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };
  console.log("complex composition --", complex_store);
  console.log("complex_store value", Object.keys(complex_store)[2]);
  console.log("props is changed", complex_store?.complex?.name);

  if (
    Object.keys(complex_store)[2] == undefined ||
    Object.keys(complex_store)[2] !== complex_store?.complex?.name
  ) {
    if (
      Object.keys(complex_store)[2] !== undefined &&
      Object.keys(complex_store)[2] == complex_store?.complex?.name
    ) {
      console.log("return null");
      return null;
    } else {
      if (Object.keys(complex_store)[2] !== complex_store?.complex?.name) {
        console.log("not equal", Object.keys(complex_store)[2]);
        dispatch(
          removeComplexComposition({ key: Object.keys(complex_store)[2] })
        );
      }
      console.log(" props complex-compostion--->", props);
      if (complex_store?.complex?.name) {
        fetchComplexComposition();
      }
      console.log("props is changed", complex_store?.complex?.name);
    }
  }

  // useEffect(() => {
  //   // Check if specific props have changed
  //   if (prevProps) {
  //     // Execute your desired function
  //     console.log("props is changed", complex_store?.complex?.name);
  //     console.log("props is 222", complex_store[complex_store.complex]);
  //   }
  //   // Update prevProps for the next render
  //   prevProps.current = props;
  // }, [props]);

  // React.useImperativeHandle(ref, () => ({
  //   Cabin,
  //   cabinPayload,
  //   complex,
  //   complexStore,
  //   hierarchy,
  //   updatedCabinPayload,
  // }));

  // if (!complex_store.complexStore) {
  //   return null;
  // }
  if (Object.keys(complex_store)[2] == undefined) {
    return null;
  }
  name = complex_store?.complex?.name;

  console.log("checking new value", complex_store?.[name]);

  const ComponentSelector = () => {
    const complex = complex_store?.[name];
    if (complex !== undefined) {
      return (
        <>
          <ComplexHeader />
          <CabinList />
        </>
      );
    }
    return <div></div>;
  };

  const ComplexHeader = () => {
    console.log("complex header is working--->");
    const complex = complex_store?.[name];
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
            {"Complex: " + complex.complexDetails.name}
          </div>
          <div style={{ ...complexCompositionStyle.complexTitle }}>
            {"Client: " + complex.complexDetails.client}
          </div>
          <div style={{ ...complexCompositionStyle.complexSubTitle }}>
            {complex.hierarchy.state +
              ": " +
              complex.hierarchy.district +
              ": " +
              complex.hierarchy.city}
          </div>
        </div>
      </div>
    );
  };

  const CabinList = () => {
    const complex = complex_store?.[name];
    const cabinList = [];

    const pushCabinDetails = (cabinDetails) => {
      cabinList.push(cabinDetails);
    };

    if (complex.complexComposition.mwcCabins !== undefined)
      complex.complexComposition.mwcCabins.forEach(pushCabinDetails);

    if (complex.complexComposition.fwcCabins !== undefined)
      complex.complexComposition.fwcCabins.forEach(pushCabinDetails);

    if (complex.complexComposition.pwcCabins !== undefined)
      complex.complexComposition.pwcCabins.forEach(pushCabinDetails);

    if (complex.complexComposition.murCabins !== undefined)
      complex.complexComposition.murCabins.forEach(pushCabinDetails);

    if (complex.complexComposition.bwtCabins !== undefined)
      complex.complexComposition.bwtCabins.forEach(pushCabinDetails);

    if (cabinList.length !== 0)
      return cabinList.map((cabinDetails, index) => {
        if (
          complex_store.cabin !== undefined &&
          complex_store.cabin.thingName === cabinDetails.thingName
        )
          return <CabinSelected cabin={cabinDetails} />;
        return <Cabin cabin={cabinDetails} />;
      });

    return null;
  };

  const Cabin = (props) => {
    return (
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
        <div style={{ ...complexCompositionStyle.cabinTitle, float: "left" }}>
          {props.cabin.shortThingName}
        </div>
        {renderConnectionStatus(props.cabin)}
        <Button
          style={{ float: "right", padding: "0px 0px 0px 0px" }}
          color="primary"
          className="px-4"
          onClick={() => setSelectedCabin(props.cabin)}
        >
          Details
        </Button>
      </div>
    );
  };

  const CabinSelected = (props) => {
    return (
      <div
        style={{
          ...selectedSurface,
          background: "white",
          width: "100%",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ ...complexCompositionStyle.cabinTitle, float: "left" }}>
          {props.cabin.shortThingName}
        </div>
        {renderConnectionStatus(props.cabin)}
        <Button
          style={{ float: "right", padding: "0px 0px 0px 0px" }}
          color="primary"
          className="px-4"
          onClick={() => setSelectedCabin(props.cabin)}
        >
          Details
        </Button>
      </div>
    );
  };

  const setSelectedCabin = (cabin) => {
    dispatch(startLoading()); // Dispatch the startLoading action

    console.log("updateSelectedCabin", cabin);
    dispatch(updateSelectedCabin({ cabin: cabin }));
  };

  const renderConnectionStatus = (cabin) => {
    if (
      complex_store.cabinPayload !== undefined &&
      complex_store.cabinPayload.clientId === cabin.thingName &&
      complex_store.cabinPayload.eventType === "connected"
    ) {
      return (
        <div
          style={{
            float: "left",
            width: "8px",
            height: "8px",
            background: "green",
            borderRadius: "10px",
          }}
        ></div>
      );
    } else if (
      complex_store.cabinPayload !== undefined &&
      complex_store.cabinPayload.clientId === cabin.thingName &&
      complex_store.cabinPayload.eventType === "disconnected"
    ) {
      return (
        <div
          style={{
            float: "left",
            width: "8px",
            height: "8px",
            background: "red",
            borderRadius: "10px",
          }}
        ></div>
      );
    } else if (cabin.connectionStatus === "OFFLINE") {
      return (
        <div
          style={{
            float: "left",
            width: "8px",
            height: "8px",
            background: "red",
            borderRadius: "10px",
          }}
        ></div>
      );
    } else {
      return (
        <div
          style={{
            float: "left",
            width: "8px",
            height: "8px",
            background: "green",
            borderRadius: "10px",
          }}
        ></div>
      );
    }
  };

  return (
    <div
      className="row complex-composition"
      style={{ marginTop: "10px", background: "white", padding: "5px" }}
    >
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}
      <ComponentSelector />
    </div>
  );
});

export default ComplexComposition;
