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
import { selectUser } from "../../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";

const CMSConfig = React.forwardRef((props, ref) => {
  const [visibility, setVisibility] = useState(false);
  const [title, setTitle] = useState("");
  const [cmsConfig, setCmsConfig] = useState(undefined);
  const user = useSelector(selectUser);
  const complex = useSelector((state) => state.complexStore);

  // const messageDialog = useRef();
  // const loadingDialog = useRef();

  const submitConfig = async () => {
    // loadingDialog.current.showDialog();
    try {
      const topic = getTopicName(
        "CMS_CONFIG",
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin,
        complex[complex?.complex?.name]?.hierarchy
      );
      const payload = getPublishPayloadCms(
        cmsConfig,
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin
      );
      const metadata = getPublishMetadata(
        "CMS",
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin,
        user?.user
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

  const showDialog = (cmsConfig) => {
    setCmsConfig(cmsConfig);
    setTitle("CMS Config");
    setVisibility(!visibility);
  };

  React.useImperativeHandle(ref, () => ({
    showDialog,
  }));

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
});

export default CMSConfig;
