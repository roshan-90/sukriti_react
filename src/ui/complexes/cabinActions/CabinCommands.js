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

const CabinCommands = (props) => {
  const [visibility, setVisibility] = useState(false);
  const [command, setCommand] = useState(getCommand("Light"));
  const [commandData, setCommandData] = useState({
    Duration: 10,
    Action: 1,
    Override: 1,
  });
  const [title, setTitle] = useState("");

  const messageDialog = useRef();
  const loadingDialog = useRef();

  const toggle = () => {
    setVisibility(!visibility);
  };

  const showDialog = () => {
    setTitle("Cabin Commands");
    setVisibility(!visibility);
  };

  const onClick = () => {
    submitConfig();
  };

  const submitConfig = async () => {
    console.log("_commands", commandData);
    loadingDialog.current.showDialog();
    try {
      const topic = getTopicName(
        "Command",
        props.complex.complexDetails,
        props.cabin,
        props.complex.hierarchy
      );
      const payload = getPublishPayloadCommand(
        command,
        commandData,
        props.complex.complexDetails,
        props.cabin
      );
      const metadata = getPublishMetaCommanddata(
        "Command",
        props.complex.complexDetails,
        props.cabin,
        props.user
      );
      console.log("_commands", topic);
      console.log("_commands", payload);
      console.log("_commands", metadata);
      const result = await executePublishCommandLambda(
        topic,
        payload,
        metadata,
        props.credentials
      );
      messageDialog.current.showDialog(
        "Success",
        "Command submitted successfully",
        toggle()
      );
      loadingDialog.current.closeDialog();
    } catch (err) {
      console.log("_fetchCabinDetails", "_err", err);
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
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
      setCommandData({ ...commandData, Duration: configValue });
    }
  };

  const CommandSelector = () => {
    return (
      <div>
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
    if (command.value === 0) {
      return <CommandsLabel handleUpdate={handleCommandUpdate} />;
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
};

export default CabinCommands;
