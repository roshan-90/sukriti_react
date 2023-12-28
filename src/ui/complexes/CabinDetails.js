import React, { useRef, useEffect, useState, forwardRef } from "react";
// import { connect } from "react-redux";
import UCEMSConfig from "./cabinActions/UCEMSConfig";
import CMSConfig from "./cabinActions/CMSConfig";
import ODSConfig from "./cabinActions/ODSConfig";
import CabinCommands from "./cabinActions/CabinCommands";
import BwtCommands from "./cabinActions/BwtCommands";
import BWTConfig from "./cabinActions/BWTConfig";
import BWTCabinHealth from "./cabinDetails/BWTCabinHealth";
import CabinStatus from "./cabinDetails/CabinStatus";
import CabinHealth from "./cabinDetails/CabinHealth";
import UsageProfile from "./cabinDetails/UsageProfile";
import BWTUsageProfile from "./cabinDetails/BWTUsageProfile";
import ResetProfile from "./cabinDetails/ResetProfile";
import CabinUsageFeedback from "./cabinDetails/CabinUsageFeedback";
import TurbidityAndWaterRecycled from "./cabinDetails/TurbidityAndWaterRecycled";
import CabinCommandsContainer from "./cabinDetails/CabinCommandsContainer";
import BWTCabinCommandsContainer from "./cabinDetails/BWTCabinCommandsContainer";
import LastSyncStatus from "./cabinDetails/LastSyncStatus";
import UpiPayment from "./cabinDetails/UpiPayment";
// import LoadingDialog from "../../dialogs/LoadingDialog";
// import MessageDialog from "../../dialogs/MessageDialog";
import { getBWTResetProfileDisplayData } from "./utils/BWTComplexUtils";
import {
  getResetProfileDisplayData,
  getUpiPaymentDisplayData,
} from "./utils/ComplexUtils";
import {
  executeGetCabinDetailsLambda,
  executeGetBWTComplexCompositionLambda,
} from "../../awsClients/complexLambdas";
import { complexStore } from "../../features/complesStoreSlice";
import { useDispatch, useSelector } from "react-redux";

const CabinDetails = (props, ref) => {
  const [cabinDetails, setCabinDetails] = useState();
  const dispatch = useDispatch();
  const complex_store = useSelector(complexStore);
  // const messageDialog = useRef();
  // const loadingDialog = useRef();
  const ucemsConfig = useRef();
  const cmsConfig = useRef();
  const odsConfig = useRef();
  const bwtConfig = useRef();
  const cabinCommands = useRef();
  const bwtCommands = useRef();

  let currentCabinThingName = "";

  useEffect(() => {
    if (
      complex_store.cabin !== undefined &&
      currentCabinThingName !== complex_store.cabin.thingName
    ) {
      currentCabinThingName = complex_store.cabin.thingName;
      // loadingDialog.current.showDialog();
      fetchCabinDetails();
    }
  }, [complex_store.cabin, currentCabinThingName]);

  const fetchCabinDetails = async () => {
    // loadingDialog.current.showDialog();
    let thingGroupName = complex_store.cabin.thingName;
    try {
      if (thingGroupName.includes("BWT")) {
        var result = await executeGetBWTComplexCompositionLambda(
          complex_store.cabin.thingName,
          complex_store.credentials,
          complex_store.user.clientName
        );
        // loadingDialog.current.closeDialog();
        setCabinDetails(result);
      } else {
        var result = await executeGetCabinDetailsLambda(
          complex_store.cabin.thingName,
          complex_store.credentials,
          complex_store.user.clientName
        );
        // loadingDialog.current.closeDialog();
        setCabinDetails(result);
      }
    } catch (err) {
      console.log("_fetchCabinDetails", "_err", err);
      // loadingDialog.current.closeDialog();
      // messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const ComponenetSelector = () => {
    if (cabinDetails == undefined) {
      return <div />;
    } else if (complex_store.cabin.cabinType === "BWT") {
      return (
        <div style={{ width: "95%", margin: "auto" }}>
          <TurbidityAndWaterRecycled
            turbidityAndWaterRecycled={cabinDetails.turbidityAndWaterRecycled}
            uiResult={cabinDetails.uiResult.data}
          />
          <BWTCabinHealth
            cabinHealth={cabinDetails.health}
            uiResult={cabinDetails.uiResult.data}
          />
          <BWTCabinCommandsContainer
            // loadingDialog={loadingDialog}
            bwtConfig={bwtConfig}
            bwtCommands={bwtCommands}
            cabinDetails={cabinDetails}
          />
          <BWTUsageProfile
            usageProfile={cabinDetails.usageProfile}
            uiResult={cabinDetails.uiResult.data}
          />
          {cabinDetails.uiResult.data.collection_stats === "true" ? null : (
            <UpiPayment
              upiPaymentList={getUpiPaymentDisplayData(
                cabinDetails.upiPaymentList
              )}
            />
          )}
          <ResetProfile
            resetProfile={getBWTResetProfileDisplayData(
              cabinDetails.resetProfile
            )}
          />
        </div>
      );
    } else {
      return (
        <div style={{ width: "95%", margin: "auto" }}>
          <CabinUsageFeedback
            usageAndFeedback={cabinDetails.usageAndFeedback}
            uiResult={cabinDetails.uiResult.data}
          />
          <CabinStatus
            cabinStatus={cabinDetails.aqiLumen}
            uiResult={cabinDetails.uiResult.data}
          />
          <CabinHealth
            cabinHealth={cabinDetails.health}
            uiResult={cabinDetails.uiResult.data}
          />
          <CabinCommandsContainer
            // loadingDialog={loadingDialog}
            ucemsConfig={ucemsConfig}
            cmsConfig={cmsConfig}
            odsConfig={odsConfig}
            cabinCommands={cabinCommands}
            cabinDetails={cabinDetails}
          />
          <UsageProfile
            usageProfile={cabinDetails.usageProfile}
            uiResult={cabinDetails.uiResult.data}
          />
          {cabinDetails.uiResult.data.collection_stats === "true" ? (
            <UpiPayment
              upiPaymentList={getUpiPaymentDisplayData(
                cabinDetails.upiPaymentList
              )}
            />
          ) : null}
          <ResetProfile
            resetProfile={getResetProfileDisplayData(cabinDetails.resetProfile)}
          />
        </div>
      );
    }
  };

  return (
    <div className="row">
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}
      <UCEMSConfig
        ref={ucemsConfig}
        // loadingDialog={loadingDialog}
        // messageDialog={messageDialog}
        complex={complex_store.complex}
        cabin={complex_store.cabin}
        user={complex_store.user}
      />
      <CMSConfig
        ref={cmsConfig}
        // loadingDialog={loadingDialog}
        // messageDialog={messageDialog}
        complex={complex_store.complex}
        cabin={complex_store.cabin}
        user={complex_store.user}
      />
      <ODSConfig
        ref={odsConfig}
        // loadingDialog={loadingDialog}
        // messageDialog={messageDialog}
        complex={complex_store.complex}
        cabin={complex_store.cabin}
        user={complex_store.user}
      />
      <BWTConfig
        ref={bwtConfig}
        // loadingDialog={loadingDialog}
        // messageDialog={messageDialog}
        complex={complex_store.complex}
        cabin={complex_store.cabin}
        user={complex_store.user}
      />
      <CabinCommands
        ref={cabinCommands}
        // loadingDialog={loadingDialog}
        // messageDialog={messageDialog}
        complex={complex_store.complex}
        cabin={complex_store.cabin}
        user={complex_store.user}
      />
      <BwtCommands
        ref={bwtCommands}
        // loadingDialog={loadingDialog}
        // messageDialog={messageDialog}
        complex={complex_store.complex}
        cabin={complex_store.cabin}
        user={complex_store.user}
      />
      <ComponenetSelector />
    </div>
  );
};

export default CabinDetails;
