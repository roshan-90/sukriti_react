import React, { useState, useRef } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
} from "reactstrap";
import { CmsConfigList } from "../../../components/ConfigLabels";
import {
  getCmsConfigData,
  getKeyCmsConfig,
  getTopicName,
  getPublishPayloadCms,
  getPublishMetadata,
} from "../utils/ComplexUtils";
import { executePublishConfigLambda } from "../../../awsClients/complexLambdas";

const CMSConfig = (props) => {
  const [visibility, setVisibility] = useState(false);
  const [title, setTitle] = useState("");
  const [cmsConfig, setCmsConfig] = useState(undefined);

  const messageDialog = useRef();
  const loadingDialog = useRef();

  const submitConfig = async () => {
    loadingDialog.current.showDialog();
    try {
      const topic = getTopicName(
        "CMS_CONFIG",
        props.complex.complexDetails,
        props.cabin,
        props.complex.hierarchy
      );
      const payload = getPublishPayloadCms(
        cmsConfig,
        props.complex.complexDetails,
        props.cabin
      );
      const metadata = getPublishMetadata(
        "CMS",
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
      messageDialog.current.showDialog(
        "Success",
        "New config submitted successfully",
        toggle
      );
      loadingDialog.current.closeDialog();
    } catch (err) {
      console.log("_fetchCabinDetails", "_err", err);
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const toggle = () => {
    setVisibility(!visibility);
  };

  const showDialog = (cmsConfig) => {
    setCmsConfig(cmsConfig);
    setTitle("CMS Config");
    setVisibility(!visibility);
  };

  const onClick = () => {
    submitConfig();
  };

  const updateConfig = (configName, configValue) => {
    const updatedConfig = { ...cmsConfig };
    updatedConfig.data[getKeyCmsConfig(configName)] = configValue;
    setCmsConfig(updatedConfig);
  };

  const ComponentSelector = () => {
    if (cmsConfig === undefined) return <div></div>;

    return (
      <div>
        <CmsConfigList
          handleUpdate={updateConfig}
          data={getCmsConfigData(cmsConfig.data)}
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
            OK
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CMSConfig;
