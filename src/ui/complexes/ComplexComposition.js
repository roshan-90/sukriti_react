import React, { useEffect, useImperativeHandle } from "react";
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
} from "../../features/complesStoreSlice";

const ComplexComposition = React.forwardRef((props, ref) => {
  // const messageDialog = useRef();
  // const loadingDialog = useRef();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const complex_store = useSelector(complexStore);
  console.log("complex composition -->", props);
  const fetchComplexComposition = async () => {
    // loadingDialog.current.showDialog();
    try {
      const result = await executeGetComplexCompositionLambda(
        user?.username,
        user?.credentials
      );
      console.log("complex postion lamda", result);
      dispatch(
        setPushComplexPosition(
          complex_store?.hierarchy,
          complex_store.complex,
          result
        )
      );
      // loadingDialog.current.closeDialog();
    } catch (err) {
      // loadingDialog.current.closeDialog();
      // messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  useEffect(() => {
    console.log("complex-compostion--->");
    if (
      complex_store.complex !== undefined &&
      complex_store.complexStore[complex_store.complex?.name] == undefined
    )
      console.log("complex-compostion--->");
    fetchComplexComposition();
  }, [complex_store.complex]);

  // React.useImperativeHandle(ref, () => ({
  //   Cabin,
  //   cabinPayload,
  //   complex,
  //   complexStore,
  //   hierarchy,
  //   updatedCabinPayload,
  // }));

  if(!complex_store.complexStore) {
    return null;
  }
  const ComponentSelector = () => {
    const complex =
      complex_store?.complexStore[complex_store?.complex?.name] ?? undefined;
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
    const complex = complex_store.complexStore[complex_store.complex.name];
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
    const complex = complex_store.complexStore[complex_store.complex.name];
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
    dispatch(updateSelectedCabin(cabin));
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
      className="row"
      style={{ marginTop: "10px", background: "white", padding: "5px" }}
    >
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}
      <ComponentSelector />
    </div>
  );
});

export default ComplexComposition;
