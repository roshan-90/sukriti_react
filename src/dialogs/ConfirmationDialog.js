import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InputGroup,
  Input,
} from "reactstrap";

const ConfirmationDialog = React.forwardRef((props, ref) => {
  const [confirmAction, setConfirmAction] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [message, setMessage] = useState("");
  const [action, setAction] = useState("none");
  const [title, setTitle] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);

  const inputRef = useRef();

  const toggle = () => {
    setVisibility((prevVisibility) => !prevVisibility);
  };

  const showDialog = (newTitle, newMessage, newAction, newOnClickAction) => {
    setAction(newAction);
    setTitle(newTitle);
    setMessage(newMessage);
    setOnClickAction(() => newOnClickAction || undefined);
    setVisibility((prevVisibility) => !prevVisibility);
  };

  const onClick = () => {
    toggle();
    if (onClickAction !== undefined) {
      onClickAction(); // Execute the callback when Confirm is clicked
    }
  };

  const checkConfirmation = (text) => {
    setConfirmAction(text.toUpperCase() === action.toUpperCase());
  };

  useEffect(() => {
    if (visibility) {
      setConfirmAction(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [visibility]);

  React.useImperativeHandle(ref, () => ({
    showDialog,
  }));

  return (
    <Modal
      isOpen={visibility}
      toggle={toggle}
      className={"modal-sm"}
      style={{ width: "600px" }}
    >
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody style={{ width: "100%" }}>
        <div
          className={"row justify-content-center"}
          style={{ margin: "auto", width: "90%" }}
        >
          {message}
        </div>
        <InputGroup className="mb-3" style={{ marginTop: "20px" }}>
          <Input
            type="text"
            placeholder="Action"
            style={{ textTransform: "uppercase" }}
            onChange={(event) => checkConfirmation(event.target.value)}
            innerRef={inputRef}
          />
        </InputGroup>
      </ModalBody>
      <ModalFooter>
        {confirmAction ? (
          <Button color="primary" onClick={onClick}>
            Confirm
          </Button>
        ) : (
          <Button color="primary" disabled onClick={onClick}>
            Confirm
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
});

export default ConfirmationDialog;
