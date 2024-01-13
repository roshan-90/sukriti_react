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

const UCEMSConfig = React.forwardRef((props, ref) => {
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

  const submitConfig = async () => {
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
      // messageDialog.current.showDialog(
      //   "Success",
      //   "New config submitted successfully",
      //   toggle
      // );
      // loadingDialog.current.closeDialog();
    } catch (err) {
      console.log("_fetchCabinDetails", "_err", err);
      // loadingDialog.current.closeDialog();
      // messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const toggle = () => {
    setVisibility(!visibility);
  };

  const showDialog = (ucemsConfig, onClickAction) => {
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

  const updateConfig = (configName, configValue) => {
    const updatedConfig = { ...ucemsConfig };
    updatedConfig.data[getKeyUcemsConfig(configName)] = configValue;
    setUcemsConfig(updatedConfig);
  };

  const ComponentSelector = () => {
    if (ucemsConfig === undefined) return <div></div>;

    return (
      <div>
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
            OK ucemsConfig
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default UCEMSConfig;
