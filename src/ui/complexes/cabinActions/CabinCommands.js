import React, { useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  CommandsLabel,
  CommandsLabelOverride,
  CommandsSelectionLabel,
} from "../../../components/ConfigLabels";
import {
  getCommand,
  getCommandNames,
  getTopicName,
  getPublishPayloadCommand,
  getPublishMetaCommanddata,
} from "../utils/ComplexUtils";
import { settingsModal } from "../../../jsStyles/Style";
import { executePublishCommandLambda } from "../../../awsClients/complexLambdas";
import { selectUser } from "../../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../../dialogs/MessageDialog"; // Adjust the path based on your project structure

const CabinCommands = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [visibility, setVisibility] = useState(false);
  const [command, setCommand] = useState(getCommand("Light"));
  const [commandData, setCommandData] = useState({
    Duration: 10,
    Action: 1,
    Override: 1,
  });
  const [title, setTitle] = useState("");
  const user = useSelector(selectUser);
  const complex = useSelector((state) => state.complexStore);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);
  // const messageDialog = useRef();
  // const loadingDialog = useRef();

  const toggle = () => {
    setVisibility(!visibility);
  };

  const showDialog = () => {
    setTitle("Cabin Commands");
    setVisibility(!visibility);
  };

  React.useImperativeHandle(ref, () => ({
    showDialog,
  }));

  const onClick = () => {
    submitConfig();
  };

  const submitConfig = async () => {
    console.log("_commands", commandData);
    // loadingDialog.current.showDialog();
    localStorage.removeItem("selection_key");
    try {
      const topic = getTopicName(
        "Command",
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin,
        complex[complex?.complex?.name]?.hierarchy
      );
      const payload = getPublishPayloadCommand(
        command,
        commandData,
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin
      );
      const metadata = getPublishMetaCommanddata(
        "Command",
        complex[complex?.complex?.name]?.complexDetails,
        complex?.cabin,
        user?.user
      );
      console.log("_commands", topic);
      console.log("_commands", payload);
      console.log("_commands", metadata);
      const result = await executePublishCommandLambda(
        topic,
        payload,
        metadata,
        user?.credentials
      );
      setDialogData({
        title: "Success",
        message: "Command submitted successfully",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("Command config Okay");
          setDialogData(null);
          setVisibility(false);
        },
      });
      // messageDialog.current.showDialog(
      //   "Success",
      //   "Command submitted successfully",
      //   toggle()
      // );
      // loadingDialog.current.closeDialog();
    } catch (err) {
      console.log("Command submitConfig", "_err", err);
      let text = err.message ? err.message.includes("expired") : null;
      if (text) {
        setDialogData({
          title: "Error",
          message: `${err.message} Please Login again`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("Command submitConfig Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("Command submitConfig Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const handleCommandSelection = (commandName) => {
    const selectedCommand = getCommand(commandName);
    console.log("_command", selectedCommand, commandName);
    setCommand(selectedCommand);
  };

  const handleCommandUpdate = (configName, configValue) => {
    console.log("_updateCommand", configName, configValue);
    if (configValue === "Switch ON") {
      setCommandData({ ...commandData, Action: 1 });
    } else if (configValue === "Switch OFF") {
      setCommandData({ ...commandData, Action: 2 });
    } else if (configValue === "Override Command") {
      setCommandData({ ...commandData, Action: 1 });
    } else if (configValue === "Do Not Override") {
      setCommandData({ ...commandData, Action: 2 });
    }
    if (configName === "Duration") {
      commandData.Duration = configValue;
      console.log("command", command);
      // setCommandData({ ...commandData, Duration: configValue });
    }
    console.log("checing handlecommandupdate -->", commandData);
  };

  const CommandSelector = () => {
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
        <CommandsSelectionLabel
          handleCommandSelection={handleCommandSelection}
          label={"Commands"}
          options={getCommandNames()}
        />

        <div
          style={{
            ...settingsModal.labelTimestamp,
            width: "100%",
            textAlign: "left",
          }}
        >
          {command.name}
        </div>

        <CommandUi />
      </div>
    );
  };

  const CommandUi = () => {
    console.log("_command", "CommandUi", command);
    if (command.value == 0) {
      return (
        <CommandsLabel
          value={commandData.Duration}
          handleUpdate={handleCommandUpdate}
        />
      );
    }

    return <CommandsLabelOverride handleUpdate={handleCommandUpdate} />;
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
          <CommandSelector />
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

export default CabinCommands;
