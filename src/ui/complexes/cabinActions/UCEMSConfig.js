import React, { useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { UcemsConfigList } from "../../../components/ConfigLabels";
import {
  getUcemsConfigData,
  getPublishPayloadUcems,
  getTopicName,
  getKeyUcemsConfig,
  getPublishMetadata,
} from "../utils/ComplexUtils";
import { settingsModal } from "../../../jsStyles/Style";
import { executePublishConfigLambda } from "../../../awsClients/complexLambdas";
import { selectUser } from "../../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../../dialogs/MessageDialog"; // Adjust the path based on your project structure

const UCEMSConfig = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [visibility, setVisibility] = useState(false);
  const [title, setTitle] = useState("");
  const [ucemsConfig, setUcemsConfig] = useState(undefined);
  const [onClickAction, setOnClickAction] = useState(undefined);
  const user = useSelector(selectUser);
  const complex = useSelector((state) => state.complexStore);
  console.log("checking complex -->", complex);
  console.log("checking complex --> 22", complex[complex?.complex?.name]);
  const messageDialog = useRef();
  const loadingDialog = useRef();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);

  const submitConfig = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    // loadingDialog.current.showDialog();
    console.log("console is clicked", props);
    try {
      const topic = getTopicName(
        "UCEMS_CONFIG",
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin,
        complex[complex?.complex?.name]?.hierarchy
      );
      console.log("console is topic", topic);
      const payload = getPublishPayloadUcems(
        ucemsConfig,
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin
      );
      console.log("console is payload", payload);
      const metadata = getPublishMetadata(
        "UCEMS",
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin,
        user?.user
      );
      console.log("console is metadata", metadata);

      console.log(
        "ucemsconfig data",
        topic,
        payload,
        metadata,
        user?.credentials
      );
      const result = await executePublishConfigLambda(
        topic,
        payload,
        metadata,
        user?.credentials
      );
      setDialogData({
        title: "Success",
        message: "New config submitted successfully",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("submitConfig Okay");
          setDialogData(null);
          setVisibility(false);
        },
      });
      // messageDialog.current.showDialog(
      //   "Success",
      //   "New config submitted successfully",
      //   toggle
      // );
      // loadingDialog.current.closeDialog();
    } catch (err) {
      console.log("_fetchCabinDetails", "_err", err);
      let text = err.message ? err.message.includes("expired") : null;
      if (text) {
        setDialogData({
          title: "Error",
          message: `${err.message} Please Login again`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("submitConfig Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("submitConfig Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const toggle = () => {
    setVisibility(!visibility);
  };

  const showDialog = (ucemsConfig, onClickAction) => {
    console.log("show modal to check data", ucemsConfig);
    setUcemsConfig(ucemsConfig);
    setTitle("UCEMS Config");
    setOnClickAction(onClickAction);
    setVisibility(!visibility);
  };

  React.useImperativeHandle(ref, () => ({
    showDialog,
  }));

  const onClick = () => {
    submitConfig();
  };

  const updateConfig = React.useCallback(
    (configName, configValue) => {
      console.log("updateConfig check data -->1", ucemsConfig);
      const updatedConfig = { ...ucemsConfig };
      console.log("updatedConfig", updatedConfig);
      console.log("updatedConfig--1", configName);
      console.log("updatedConfig--2", configValue);
      console.log(
        "updateConfig check data -->2",
        updatedConfig.data[getKeyUcemsConfig(configName)]
      );
      updatedConfig.data[getKeyUcemsConfig(configName)] = configValue;
      // setUcemsConfig(updatedConfig);
    },
    [ucemsConfig]
  );

  const ComponentSelector = () => {
    if (ucemsConfig === undefined) return <div></div>;

    return (
      <div>
        {isLoading && (
          <div className="loader-container">
            <CircularProgress
              className="loader"
              style={{ color: "rgb(93 192 166)" }}
            />
          </div>
        )}
        <MessageDialog data={dialogData} />
        <div
          style={{
            ...settingsModal.labelTimestamp,
            width: "100%",
            textAlign: "right",
          }}
        >
          Default Values
        </div>
        <UcemsConfigList
          handleUpdate={updateConfig}
          data={getUcemsConfigData(ucemsConfig.data)}
        />
      </div>
    );
  };

  return (
    <div>
      <Modal
        isOpen={visibility}
        toggle={toggle}
        className={"modal-la"}
        style={{ width: "900px" }}
      >
        <ModalHeader
          style={{ background: "#5DC0A6", color: `white` }}
          toggle={toggle}
        >
          {title}
        </ModalHeader>
        <ModalBody
          style={{
            width: "100%",
            height: "600px",
            overflowY: "scroll",
          }}
        >
          <ComponentSelector />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onClick}>
            Submit
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default UCEMSConfig;
