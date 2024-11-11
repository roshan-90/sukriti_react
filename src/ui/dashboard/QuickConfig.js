import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
// import LoadingDialog from "../../dialogs/LoadingDialog";
// import MessageDialog from "../../dialogs/MessageDialog";
import QuickConfigDialog from "./quickConfig/QuickConfigDialog";
import { setDashboardConfig, dashboard } from "../../features/dashboardSlice";
import { dashboardStyle, whiteSurface, colorTheme } from "../../jsStyles/Style";
import {
  UsageChargeConfigView,
  PreFlushConfigView,
  MiniFlushConfigView,
  FullFlushConfigView,
  FloorCleanConfigView,
  LightConfigView,
  FanConfigView,
  DataRequestConfigView,
} from "../../components/QuickConfigLabels";
import { QuickConfigTabs } from "../../nomenclature/nomenclature";
import {
  validateConfigData,
  getLambdaPayload,
  getPublishTopicName,
} from "./quickConfig/utils/ConfigValidationHelper";
import { executePublishConfigLambda } from "../../awsClients/quickConfigLambdas";
import { setClientList } from "../../features/adminstrationSlice";
import { executelistClientsLambda } from "../../awsClients/administrationLambdas";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { selectUser } from "../../features/authenticationSlice";
import QuickConfigUsageModal from './quickConfig/QuickConfigUsageModal';
import QuickConfigFlushModal from './quickConfig/QuickConfigFlushModal';
import QuickConfigFloorModal from './quickConfig/QuickConfigFloorModal';
import QuickConfigLightFanModal from './quickConfig/QuickConfigLightFanModal';

const QuickConfig = (props) => {
  const dispatch = useDispatch();
  const configData = useSelector((state) => state.dashboard.configData);
  const clientList = useSelector((state) => state.adminstration.clientList);
  const userDetails = useSelector((state) => state.authentication.user);
  const user = useSelector(selectUser);

  useEffect(() => {
    if(clientList.length == 0) {
      const fetchClientList = async () => {
        await fetchAndInitClientList();
      };
      fetchClientList();
    }
  }, [clientList])

  const configViewData = {};
  const dialogQuickConfigUsageCharge = useRef(null);
  const dialogQuickConfigFlush = useRef(null);
  const dialogQuickConfigFloorClean = useRef(null);
  const dialogQuickConfigLightAndFan = useRef(null);
  const dialogQuickConfigDataRequest = useRef(null);
  const [dialogData, setDialogData] = useState(null);
  const [clientListUpdate, setClientListUpdate] = useState([]);
  const [isConfigUsageModalVisible, setIsConfigUsageModalVisible] = useState(false);
  const [isConfigFlushModalVisible, setIsConfigFlushModalVisible] = useState(false);
  const [isConfigFloorModalVisible, setIsConfigFloorModalVisible] = useState(false);
  const [isConfigLightFanModalVisible, setIsConfigLightFanModalVisible] = useState(false);

  console.log('client list', clientList);
  console.log('client list length', clientList.length);

  const UsageConfigtoggleModal = () => setIsConfigUsageModalVisible(!isConfigUsageModalVisible);
  const FlushConfigtoggleModal = () => setIsConfigFlushModalVisible(!isConfigFlushModalVisible);
  const FloorConfigtoggleModal = () => setIsConfigFloorModalVisible(!isConfigFloorModalVisible);
  const LightFanConfigtoggleModal = () => setIsConfigLightFanModalVisible(!isConfigLightFanModalVisible);

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
  
  const fetchAndInitClientList = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var result = await executelistClientsLambda(user?.credentials);
      console.log("QuickConfig fetchAndInitClientList", result);
      const options = result.clientList.map(item => ({
        value: item.name,
        label: item.name
      }));
      dispatch(setClientList(result.clientList));
      setClientListUpdate(options)
    } catch (err) {
      handleError(err, "fetchAndInitClientList");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  console.log("sdf props quickConfig", props);
  const usageChargeConfigView = () => (
    <UsageChargeConfigView
      data={{
        defaultEntryCharge: "",
        defaultPaymentMode: "",
      }}
      handleUpdate={handleConfigUpdate}
    />
  );

  const preFlushConfigView = () => (
    <PreFlushConfigView handleUpdate={handleConfigUpdate} />
  );

  const miniFlushConfigView = () => (
    <MiniFlushConfigView handleUpdate={handleConfigUpdate} />
  );

  const fullFlushConfigView = () => (
    <FullFlushConfigView handleUpdate={handleConfigUpdate} />
  );

  const floorCleanConfigView = () => (
    <FloorCleanConfigView handleUpdate={handleConfigUpdate} />
  );

  const lightConfigView = () => (
    <LightConfigView handleUpdate={handleConfigUpdate} />
  );

  const fanConfigView = () => (
    <FanConfigView handleUpdate={handleConfigUpdate} />
  );

  const dataRequestConfigView = () => (
    <DataRequestConfigView handleUpdate={handleDataRequestConfigUpdate} />
  );

  const submitConfig = async (configType, topic, payload, metadata) => {
    // loadingDialog.current.showDialog();
    try {
      payload = JSON.stringify(payload);
      metadata = JSON.stringify(metadata);
      console.log("submit config", payload, metadata);
      return;
      const result = await executePublishConfigLambda(
        topic,
        payload,
        metadata,
        props.credentials
      );
      closeActiveQuickConfigDialogue(configType);
      //   messageDialog.current.showDialog(
      //     "Success",
      //     "New config submitted successfully"
      //   );
      //   loadingDialog.current.closeDialog();
    } catch (err) {
      console.log("_fetchCabinDetails", "_err", err);
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const handleConfigUpdate = (configTab, id, value) => {
    let obj = configViewData[configTab];
    if (obj === undefined) obj = {};

    obj[id] = value;
    configViewData[configTab] = obj;
    console.log("_handleConfigUpdate", configViewData);
    dispatch(setDashboardConfig(configViewData));
    // props.setConfigData(configViewData);
  };

  const handleSubmitConfig = (configType) => {
    console.log("handlesubmitconfig", configType, configViewData);
    const validationResult = validateConfigData(configType, configViewData);
    console.log("_validateConfigData", "validationResult", validationResult);

    if (validationResult.isValidated) {
      const lambdaPayload = getLambdaPayload(
        configType,
        configViewData,
        userDetails
      );
      const publishTopic = getPublishTopicName(configType, configViewData);
      console.log("_lambdaPayload", publishTopic, lambdaPayload);

      submitConfig(
        configType,
        publishTopic,
        lambdaPayload.lambdaPayload,
        lambdaPayload.lambdaPayloadInfo
      );
    } else {
      //   messageDialog.current.showDialog(
      //     "Validation Alert!",
      //     validationResult.message
      //   );
    }
  };

  const closeActiveQuickConfigDialogue = (configType) => {
    if (configType === QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG) {
      dialogQuickConfigUsageCharge.current.toggleDialog();
    }
  };

  const handleDataRequestConfigUpdate = () => {};

  const handleOnClick = (data) => {
  }

  const handleOnClickLightFan = (data) => {
  }
  
  return (
    <div
      className="animated fadeIn"
      style={{ ...whiteSurface, background: "white", marginTop: "20px" }}
    >
      <QuickConfigUsageModal
        visibility={isConfigUsageModalVisible}
        toggleDialog={UsageConfigtoggleModal}
        title="Quick Config"
        tabData={[
          {
            type: QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG,
            label: "Usage Charge",
            configView: usageChargeConfigView,
          },
        ]}
        onClick={handleOnClick}
        clientList={clientListUpdate}
      />
      <QuickConfigFlushModal
        visibility={isConfigFlushModalVisible}
        toggleDialog={FlushConfigtoggleModal}
        title="Flush Config"
        tabData = {[
          {
            type: QuickConfigTabs.TAB_PRE_FLUSH_CONFIG,
            label: "Pre Flush",
            configView: preFlushConfigView,
          },
          {
            type: QuickConfigTabs.TAB_MINI_FLUSH_CONFIG,
            label: "Mini Flush",
            configView: miniFlushConfigView,
          },
          {
            type: QuickConfigTabs.TAB_FULL_FLUSH_CONFIG,
            label: "Full Flush",
            configView: fullFlushConfigView,
          },
        ]}
        onClick={handleOnClick}
        clientList={clientListUpdate}
      />
      <QuickConfigFloorModal
        visibility={isConfigFloorModalVisible}
        toggleDialog={FloorConfigtoggleModal}
        title="Floor Clean Config"
        tabData = {[
          {
            type: QuickConfigTabs.TAB_FLOOR_CLEAN_CONFIG,
            label: "Floor Clean Config",
            configView: floorCleanConfigView,
          },
        ]}
        onClick={handleOnClick}
        clientList={clientListUpdate}
      />

      <QuickConfigLightFanModal
        visibility={isConfigLightFanModalVisible}
        toggleDialog={LightFanConfigtoggleModal}
        title="Light and Fan Config"
        tabData = {[
          {
            type: QuickConfigTabs.TAB_LIGHT_CONFIG,
            label: "Light Config",
            configView: lightConfigView,
          },
          {
            type: QuickConfigTabs.TAB_FAN_CONFIG,
            label: "Fan Config",
            configView: fanConfigView,
          },
        ]}
        onClick={handleOnClick}
        clientList={clientListUpdate}
        />
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}

      <QuickConfigDialog
        ref={dialogQuickConfigUsageCharge}
        handleUpdate={handleConfigUpdate}
        handleClick={handleSubmitConfig}
        clientList={clientList}
        activeTab={QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG}
        tabData={[
          {
            type: QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG,
            label: "Usage Charge",
            configView: usageChargeConfigView,
          },
        ]}
        configData={configData}
      />
      <QuickConfigDialog
        ref={dialogQuickConfigFlush}
        handleUpdate={handleConfigUpdate}
        handleClick={handleSubmitConfig}
        clientList={clientList}
        activeTab={QuickConfigTabs.TAB_PRE_FLUSH_CONFIG}
        tabData={[
          {
            type: QuickConfigTabs.TAB_PRE_FLUSH_CONFIG,
            label: "Pre Flush",
            configView: preFlushConfigView,
          },
          {
            type: QuickConfigTabs.TAB_MINI_FLUSH_CONFIG,
            label: "Mini Flush",
            configView: miniFlushConfigView,
          },
          {
            type: QuickConfigTabs.TAB_FULL_FLUSH_CONFIG,
            label: "Full Flush",
            configView: fullFlushConfigView,
          },
        ]}
        configData={configData}
      />
      <QuickConfigDialog
        ref={dialogQuickConfigFloorClean}
        handleUpdate={handleConfigUpdate}
        handleClick={handleSubmitConfig}
        clientList={clientList}
        activeTab={QuickConfigTabs.TAB_FLOOR_CLEAN_CONFIG}
        tabData={[
          {
            type: QuickConfigTabs.TAB_FLOOR_CLEAN_CONFIG,
            label: "Floor Clean Config",
            configView: floorCleanConfigView,
          },
        ]}
      />
      <QuickConfigDialog
        ref={dialogQuickConfigLightAndFan}
        handleUpdate={handleConfigUpdate}
        handleClick={handleSubmitConfig}
        clientList={clientList}
        activeTab={QuickConfigTabs.TAB_LIGHT_CONFIG}
        tabData={[
          {
            type: QuickConfigTabs.TAB_LIGHT_CONFIG,
            label: "Light Config",
            configView: lightConfigView,
          },
          {
            type: QuickConfigTabs.TAB_FAN_CONFIG,
            label: "Fan Config",
            configView: fanConfigView,
          },
        ]}
        configData={configData}
      />
      <QuickConfigDialog
        ref={dialogQuickConfigDataRequest}
        handleUpdate={handleConfigUpdate}
        handleClick={handleSubmitConfig}
        clientList={clientList}
        activeTab={QuickConfigTabs.TAB_DATA_REQUEST_CONFIG}
        tabData={[
          {
            type: QuickConfigTabs.TAB_DATA_REQUEST_CONFIG,
            label: "Data Request Config",
            configView: dataRequestConfigView,
          },
        ]}
        configData={configData}
      />

      <div style={{ ...dashboardStyle.title }}>Quick Config</div>
      <div
        className="row"
        style={{
          width: "100%",
          padding: "10px",
          height: "200px",
          display: "flexbox",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        {props?.uiResult?.usage_charge === "true" && (
          <DescriptionItem
            title={"Usage Charge Config"}
            label={
              "Configure payment charge and payment mode settings in one go."
            }
            onClick={() => {
              UsageConfigtoggleModal()
              // dialogQuickConfigUsageCharge.current.showDialog();
            }}
          />
        )}
        <DescriptionItem
          title={"Flush Config"}
          label={
            "Configure payment charge and payment mode settings in one go."
          }
          onClick={() => {
            console.log("showDialogdsfdsfa", dialogQuickConfigFlush);
            // dialogQuickConfigFlush.current.showDialog();
            FlushConfigtoggleModal();
          }}
        />
        <DescriptionItem
          title={"Floor Clean Config"}
          label={
            "Configure payment charge and payment mode settings in one go."
          }
          onClick={() => {
            // dialogQuickConfigFloorClean.current.showDialog();
            FloorConfigtoggleModal();
          }}
        />
        <DescriptionItem
          title={"Light and Fan Config"}
          label={
            "Configure payment charge and payment mode settings in one go."
          }
          onClick={() => {
            // dialogQuickConfigLightAndFan.current.showDialog();
            LightFanConfigtoggleModal();
          }}
        />
        {/* <DescriptionItem
          title={"Data Request Config"}
          label={
            "Configure payment charge and payment mode settings in one go."
          }
          onClick={() => {
            dialogQuickConfigDataRequest.current.showDialog();
          }}
        /> */}
      </div>
    </div>
  );
};

const DescriptionItem = (props) => {
  return (
    <div className="col-md-4" style={{}}>
      <div
        style={{ border: "2px solid #5DC0A6", height: "110px", margin: "10px" }}
      >
        <div
          style={{
            background: colorTheme.primary,
            height: "60px",
            padding: "10px",
          }}
        >
          <div style={{ ...dashboardStyle.itemTitle, float: "left" }}>
            {props.title}
          </div>
          <div style={{ ...dashboardStyle.itemTitle, float: "right" }}>
            <Button
              style={{
                color: "white",
                border: "2px solid white",
                margin: "auto",
              }}
              color="primary"
              className="px-4"
              outline
              onClick={props.onClick}
            >
              View
            </Button>
          </div>
        </div>
        <div
          style={{
            ...whiteSurface,
            background: "white",
            margin: "-8px 10px 0px 10px",
            height: "40px",
            padding: "10px",
          }}
        >
          <div style={{ ...dashboardStyle.itemDescriprtion }}>
            {props.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickConfig;
