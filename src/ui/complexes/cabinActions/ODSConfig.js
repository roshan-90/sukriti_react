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
import { OdsConfigList } from "../../../components/ConfigLabels";
import {
  getOdsConfigData,
  getKeyOdsConfig,
  getTopicName,
  getPublishPayloadOds,
  getPublishMetadata,
} from "../utils/ComplexUtils";
import { executePublishConfigLambda } from "../../../awsClients/complexLambdas";
import { selectUser } from "../../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";

const ODSConfig = React.forwardRef((props, ref) => {
  const [visibility, setVisibility] = useState(false);
  const [title, setTitle] = useState("");
  const [odsConfig, setOdsConfig] = useState(undefined);
  const user = useSelector(selectUser);
  const complex = useSelector((state) => state.complexStore);

  const messageDialog = useRef();
  const loadingDialog = useRef();

  const submitConfig = async () => {
    // loadingDialog.current.showDialog();
    try {
      const topic = getTopicName(
        "ODS_CONFIG",
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin,
        complex[complex?.complex?.name]?.hierarchy
      );
      const payload = getPublishPayloadOds(
        odsConfig,
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin
      );
      const metadata = getPublishMetadata(
        "ODS",
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

  const showDialog = (odsConfig) => {
    setOdsConfig(odsConfig);
    setTitle("ODS Config");
    setVisibility(!visibility);
  };

  React.useImperativeHandle(ref, () => ({
    showDialog,
  }));

  const onClick = () => {
    submitConfig();
  };

  const updateConfig = (configName, configValue) => {
    const updatedConfig = { ...odsConfig };
    updatedConfig.data[getKeyOdsConfig(configName)] = configValue;
    setOdsConfig(updatedConfig);
  };

  const ComponentSelector = () => {
    if (odsConfig === undefined) return <div></div>;

    return (
      <div>
        <OdsConfigList
          handleUpdate={updateConfig}
          data={getOdsConfigData(odsConfig.data)}
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

export default ODSConfig;
