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
import { startLoading, stopLoading } from "../../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../../dialogs/MessageDialog"; // Adjust the path based on your project structure

const ODSConfig = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [visibility, setVisibility] = useState(false);
  const [title, setTitle] = useState("");
  const [odsConfig, setOdsConfig] = useState(undefined);
  const user = useSelector(selectUser);
  const complex = useSelector((state) => state.complexStore);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);
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
      setDialogData({
        title: "Success",
        message: "New config submitted successfully",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("ODS config Okay");
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
      console.log("ODS submitConfig", "_err", err);
      let text = err.message ? err.message.includes("expired") : null;
      if (text) {
        setDialogData({
          title: "Error",
          message: `${err.message} Please Login again`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("ODS submitConfig Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("ODS submitConfig Error", err);
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
    // setOdsConfig(updatedConfig);
  };

  const ComponentSelector = () => {
    if (odsConfig === undefined) return <div></div>;

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
            Submit
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default ODSConfig;
