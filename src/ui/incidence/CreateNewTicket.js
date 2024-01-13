import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
// import {
//   pushComplexComposition,
//   updateSelectedCabin,
// } from "../../store/actions/complex-actions";
// import {
//   addTeamMember,
//   setClientList,
// } from "../../store/actions/administration-actions";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import { executeGetComplexCompositionLambda } from "../../awsClients/complexLambdas";

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import {
  executeCreateTicketLambda,
  executeUploadFileS3,
} from "../../awsClients/incidenceLambdas";
import IncidenceNavigation from "./IncidenceNavigation";
import moment from "moment";
import { whiteSurface } from "../../jsStyles/Style";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const CreateNewTicket = ({
  complexStore,
  complex,
  updateSelectedCabin,
  credentials,
  hierarchy,
  history,
}) => {
  const [buttonOne, setButtonOne] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageName, setImageName] = useState([]);

  //   const messageDialog = useRef();
  //   const loadingDialog = useRef();

  const formDetails = {};

  useEffect(() => {
    if (complex !== undefined && complexStore[complex.name] == undefined)
      fetchComplexComposition();
  }, [complex, complexStore]);

  const fetchComplexComposition = async () => {
    // loadingDialog.current.showDialog();
    try {
      var result = await executeGetComplexCompositionLambda(
        complex.name,
        credentials
      );
      //   pushComplexComposition(hierarchy, complex, result);
      //   loadingDialog.current.closeDialog();
    } catch (err) {
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const handleClick = () => {
    setButtonOne((prevButtonOne) => !prevButtonOne);
  };

  const selectFiles = (event) => {
    let images = [];
    let imageName = [];
    let limit = 5;
    if (event.target.files.length > limit) {
      event.preventDefault();
      //   messageDialog.current.showDialog(
      //     "Limit exceeds",
      //     "Only 5 images are allowed"
      //   );
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        images.push(URL.createObjectURL(event.target.files[i]));
        imageName.push(event.target.files[i]);
      }
    }
    setImageName(imageName);
    setPreviewImages(images);
  };

  const initCreateTicketRequest = async (createUserRequest) => {
    // loadingDialog.current.showDialog();
    try {
      var requestCopy = { ...createUserRequest };
      let res = [];
      res.push(await executeCreateTicketLambda(requestCopy, credentials));
      let ticketId = res[0].ticketId;
      //   messageDialog.current.showDialog(
      //     "Ticket Submitted",
      //     "Ticket successfully submitted, your reference id is: " + ticketId,
      //     () => {
      //       history.goBack();
      //     }
      //   );

      if (ticketId && imageName) {
        Promise.all(imageName).then((values) => {
          imageName.forEach((element, index) => {
            let fileId = element;
            let NewUpdatedName = "Raise-" + "Photo-" + "10" + index;
            let fileName = NewUpdatedName;
            executeUploadFileS3(ticketId, fileName, fileId);
          });
        });
      }
      //   loadingDialog.current.closeDialog();
    } catch (err) {
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const onSubmit = () => {
    if (formDetails.title === "") {
      //   messageDialog.current.showDialog(
      //     "Validation Error",
      //     "Please enter a title."
      //   );
    } else if (formDetails.description === "") {
      //   messageDialog.current.showDialog(
      //     "Validation Error",
      //     "Please enter a valid description."
      //   );
    } else if (formDetails.complex_name === "") {
      //   messageDialog.current.showDialog(
      //     "Validation Error",
      //     "Please enter a valid complex_name."
      //   );
    } else {
      initCreateTicketRequest(formDetails);
    }
  };

  const ComponentSelector = () => {
    var complex = undefined;
    if (complex !== undefined) complex = complexStore[complex.name];
    if (complex !== undefined) return <ComplexHeader />;
    return null;
  };

  const ComplexHeader = () => {
    var currentTime = new Date();
    var month = currentTime.getMonth();
    var monthCodes = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
    ];
    var index = monthCodes[month];
    var year = moment().format("YY");
    var yearMonthCode = year + "-" + index;
    var complex = complexStore[complex.name];

    formDetails.assigned_by = "";
    formDetails.assignemt_type = "";
    formDetails.assignment_comment = "";
    formDetails.city_code = complex.hierarchy.cityCode;
    formDetails.city_name = "";
    formDetails.client_name = complex.complexDetails.client;
    formDetails.complex_name = "";
    // formDetails.creator_id = location.state.user.userName;
    // formDetails.creator_role = location.state.user.userRole;
    formDetails.criticality = "";
    formDetails.description = "";
    formDetails.district_code = complex.hierarchy.districtCode;
    formDetails.district_name = complex.hierarchy.district;
    formDetails.fileList = [];
    formDetails.lead_id = "";
    formDetails.lead_role = "";
    formDetails.short_thing_name = "";
    formDetails.state_code = complex.hierarchy.stateCode;
    formDetails.state_name = complex.hierarchy.state;
    formDetails.thing_name = "";
    formDetails.ticket_id = "";
    formDetails.ticket_status = "";
    formDetails.timestamp = 0;
    formDetails.title = "";
    formDetails.yearMonthCode = yearMonthCode;

    return (
      <div style={{ width: "-webkit-fill-available" }}>
        <Form>
          <InputGroup className="mb-4">
            <InputGroupText>
              <LockOutlinedIcon />
            </InputGroupText>
            <Input
              type="text"
              placeholder="State"
              value={(formDetails.complex_name = complex.complexDetails.name)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroupText>
              <PersonOutlineOutlinedIcon />
            </InputGroupText>
            <Input
              type="text"
              placeholder="District"
              value={(formDetails.city_name = complex.hierarchy.city)}
            />
          </InputGroup>

          <InputGroup className="mb-4">
            <InputGroupText>
              <LockOutlinedIcon />{" "}
            </InputGroupText>
            <Input
              type="text"
              placeholder="City"
              value={
                complex.hierarchy.stateCode + ":" + complex.hierarchy.district
              }
            />
          </InputGroup>
        </Form>
      </div>
    );
  };

  return (
    <div className="col-md-12">
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}

      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <Card className="p-4">
              <CardBody>
                <Form>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p className="text-muted">Unit Selection</p>
                    <Button
                      color="primary"
                      className="px-4"
                      id="button_one"
                      onClick={handleClick}
                    >
                      Select Unit
                    </Button>
                  </div>
                </Form>
                {buttonOne ? (
                  <dvi>
                    <IncidenceNavigation />
                  </dvi>
                ) : (
                  ""
                )}
                <ComponentSelector />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            <Card className="p-4">
              <CardBody>
                <Form>
                  <p className="text-muted">Ticket Details</p>
                  <InputGroup className="mb-4">
                    <InputGroupText>
                      <LockOutlinedIcon />{" "}
                    </InputGroupText>
                    <Input
                      type="select"
                      onChange={(event) =>
                        (formDetails.criticality = event.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="Normal">
                        Normal: A non-critical malfunction
                      </option>
                      <option value="Urgent">
                        Urgent: A critical malfunction
                      </option>
                      <option value="Possible Fault">
                        Possible Fault: Possible Malfunction
                      </option>
                    </Input>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroupText>
                      <PersonOutlineOutlinedIcon />{" "}
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Title"
                      onChange={(event) =>
                        (formDetails.title = event.target.value)
                      }
                    />
                  </InputGroup>

                  <InputGroup className="mb-4">
                    <InputGroupText>
                      <LockOutlinedIcon />{" "}
                    </InputGroupText>
                    <Input
                      type="textarea"
                      placeholder="Description"
                      onChange={(event) =>
                        (formDetails.description = event.target.value)
                      }
                    />
                  </InputGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md="8">
            <Card className="p-4">
              <CardBody>
                <div className="form-group multi-preview">
                  {previewImages && (
                    <div>
                      {previewImages.map((img, i) => {
                        return (
                          <img
                            style={{
                              ...whiteSurface,
                              background: "white",
                              width: "200px",
                              height: "200px",
                              margin: "10px",
                              borderRadius: "10px",
                              border: "5px solid white",
                            }}
                            src={img}
                            alt={"image-" + i}
                            key={i}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={selectFiles}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <div className={"row justiy-content-center"} style={{ width: "100%" }}>
          <Button
            style={{ margin: "auto" }}
            color="primary"
            className="px-4"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    complexStore: state.complexStore,
    complex: state.complexStore.complex,
    credentials: state.authentication.credentials,
    hierarchy: state.complexStore.hierarchy,
  };
};

// const mapActionsToProps = {
//   pushComplexComposition,
//   updateSelectedCabin,
//   addMember: addTeamMember,
//   setClientList,
// };

export default CreateNewTicket;
