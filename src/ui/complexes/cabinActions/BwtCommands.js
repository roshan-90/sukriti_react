import React, { useState, useRef } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  BwtCommandsLabel,
  BwtBlowerLabel,
  CommandsLabelOverride,
  CommandsSelectionLabel,
} from "../../../components/ConfigLabels";
import {
  getBwtCommand,
  getBwtCommandNames,
  getBwtTopicName,
  getBwtPublishPayloadCommand,
  getPublishMetaCommanddata,
} from "../utils/BWTComplexUtils";
import { settingsModal } from "../../../jsStyles/Style";
import { executePublishCommandLambda } from "../../../awsClients/complexLambdas";

const BwtCommands = (props) => {
  const [visibility, setVisibility] = useState(false);
  const [command, setCommand] = useState(getBwtCommand("Pump"));
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
      const topic = getBwtTopicName(
        "Command",
        props.complex.complexDetails,
        props.cabin,
        props.complex.hierarchy
      );
      const payload = getBwtPublishPayloadCommand(
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
    const selectedCommand = getBwtCommand(commandName);
    console.log("_command", selectedCommand, commandName);
    setCommand(selectedCommand);
  };

  const handleCommandUpdate = (configName, configValue) => {
    console.log("_updateCommand", configName, configValue);
    if (configValue === "Active mode") {
      setCommandData({ ...commandData, Action: 1 });
    } else if (configValue === "Drain mode") {
      setCommandData({ ...commandData, Action: 2 });
    } else if (configValue === "Rinse mode") {
      setCommandData({ ...commandData, Action: 3 });
    } else if (configValue === "BackWash mode") {
      setCommandData({ ...commandData, Action: 4 });
    } else if (configValue === "Switch ON") {
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
          options={getBwtCommandNames()}
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
      return <BwtCommandsLabel handleUpdate={handleCommandUpdate} />;
    } else if (command.value === 2) {
      return <BwtBlowerLabel handleUpdate={handleCommandUpdate} />;
    }

    return <CommandsLabelOverride handleUpdate={handleCommandUpdate} />;
  };

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
        <CommandSelector />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClick}>
          OK
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BwtCommands;
