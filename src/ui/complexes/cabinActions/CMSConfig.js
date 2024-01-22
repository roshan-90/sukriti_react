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
import { startLoading, stopLoading } from "../../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../../dialogs/MessageDialog"; // Adjust the path based on your project structure

const CMSConfig = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [visibility, setVisibility] = useState(false);
  const [title, setTitle] = useState("");
  const [cmsConfig, setCmsConfig] = useState(undefined);
  const user = useSelector(selectUser);
  const complex = useSelector((state) => state.complexStore);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);

  // const messageDialog = useRef();
  // const loadingDialog = useRef();

  const submitConfig = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
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
      setDialogData({
        title: "Success",
        message: "New config submitted successfully",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("cms config Okay");
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
    // setCmsConfig(updatedConfig);
  };

  const ComponentSelector = () => {
    if (cmsConfig === undefined) return <div></div>;

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
            Submit
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
});

export default CMSConfig;
