import React, { useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { BwtConfigList } from "../../../components/ConfigLabels";
import {
  getBwtConfigData,
  getKeyBwtConfig,
  getBwtTopicName,
  getPublishPayloadBwt,
  getPublishMetadata,
} from "../utils/BWTComplexUtils";
import { executePublishConfigLambda } from "../../../awsClients/complexLambdas";

const BWTConfig = (props) => {
  const [visibility, setVisibility] = useState(false);
  const [bwtConfig, setBwtConfig] = useState(undefined);
  const [title, setTitle] = useState("");

  const messageDialog = useRef();
  const loadingDialog = useRef();

  const toggle = () => {
    setVisibility(!visibility);
  };

  const showDialog = (bwtConfig, onClickAction) => {
    setBwtConfig(bwtConfig);
    setTitle("BWT Config");

    if (onClickAction !== undefined) {
      // Handle onClickAction if needed
    }

    setVisibility(!visibility);
  };

  const onClick = () => {
    submitConfig();
  };

  const submitConfig = async () => {
    loadingDialog.current.showDialog();
    try {
      const topic = getBwtTopicName(
        "BWT_CONFIG",
        props.complex.complexDetails,
        props.cabin,
        props.complex.hierarchy
      );
      const payload = getPublishPayloadBwt(
        bwtConfig,
        props.complex.complexDetails,
        props.cabin
      );
      const metadata = getPublishMetadata(
        "BWT",
        props.complex.complexDetails,
        props.cabin,
        props.user
      );
      const result = await executePublishConfigLambda(
        topic,
        payload,
        metadata,
        props.credentials
      );

      props.messageDialog.current.showDialog(
        "Success",
        "New config submitted successfully",
        toggle()
      );

      loadingDialog.current.closeDialog();
    } catch (err) {
      console.log("_fetchCabinDetails", "_err", err);
      loadingDialog.current.closeDialog();
      props.messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const renderData = () => {
    return (
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
          {ComponentSelector()}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onClick}>
            OK
          </Button>{" "}
        </ModalFooter>
      </Modal>
    );
  };

  const updateConfig = (configName, configValue) => {
    bwtConfig.data[getKeyBwtConfig(configName)] = configValue;
  };

  const ComponentSelector = () => {
    if (bwtConfig === undefined) return <div></div>;

    return (
      <div>
        <BwtConfigList
          handleUpdate={updateConfig}
          data={getBwtConfigData(bwtConfig.data)}
        />
      </div>
    );
  };

  return renderData();
};

export default BWTConfig;
