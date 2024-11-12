import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { executeGetComplexCompositionLambda } from "../../awsClients/complexLambdas";
import { setClientList } from "../../features/adminstrationSlice";
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
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setPushComplexPosition,
  updateSelectedCabin,
  emptyComplexStore,
} from "../../features/complesStoreSlice";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Select from 'react-select'; // Importing react-select

const CreateNewTicket = () => {
  const complexSelectTree = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const complexStore = useSelector((state) => state.complexStore);
  const credentials = useSelector((state) => state.authentication.credentials);
  const user = useSelector((state) => state.authentication.user);
  const hierarchy = complexStore?.hierarchy;
  const [dialogData, setDialogData] = useState(null);
  const [buttonOne, setButtonOne] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageName, setImageName] = useState([]);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const formDetails = {};
  const [ticketCondition, setTicketCondition] = useState(null);
  const selectTicketCondition = [
    { label: 'Normal: A non-critical malfunction', value: 'Normal' },
    { label: 'Urgent: A critical malfunction', value: 'Urgent' },
    { label: 'Possible Fault: Possible Malfunction', value: 'Possible' }
  ];
  const [formDataTicket,  setFormDataTicket] = React.useState({
   assigned_by: "",
    assignemt_type: "",
    assignment_comment: "",
    city_code: "",
    city_name: "",
    client_name: "",
    complex_name: "",
    creator_id: "",
    creator_role: "",
    criticality: "",
    description: "",
    district_code: "",
    district_name: "",
    fileList: [],
    lead_id: "",
    lead_role: "",
    short_thing_name: "",
    state_code: "",
    state_name: "",
    thing_name: "",
    ticket_id: "",
    ticket_status: "",
    timestamp: 0,
    title: "",
    yearMonthCode: ""
  })

  useEffect(() => {
    if (
      complexStore?.complex !== undefined &&
      complexStore[complexStore?.complex.name] == undefined
    )
      fetchComplexComposition();
  }, [complexStore?.complex, complexStore]);

  const handleError = (err, Custommessage, onclick = null) => {
    console.log("error -->", err);
    let text = err.message.includes("expired");
    if (text) {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    } else {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    }
  };

  const fetchComplexComposition = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    console.log("getcomplexcomposition lambda", complexStore?.complex);
    try {
      var result = await executeGetComplexCompositionLambda(
        complexStore?.complex.name,
        credentials
      );
      dispatch(
        setPushComplexPosition({
          hierarchy: hierarchy,
          complexDetails: complexStore?.complex,
          complexComposition: result,
        })
      );
    } catch (err) {
      handleError(err, "fetchComplexComposition");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
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
      setDialogData({
        title: "Limit exceeds",
        message: "Only 5 images are allowed",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.error("selectFiles Error");
        },
      });
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        images.push(URL.createObjectURL(event.target.files[i]));
        imageName.push(event.target.files[i]);
      }
    }
    setImageName(imageName);
    setPreviewImages(images);
  };

  const initCreateTicketRequest = async () => {
    let createUserRequest  = {
        assigned_by: "",
        assignemt_type: "",
        assignment_comment: "",
        city_code: complexSelectTree.current?.complex?.hierarchy?.cityCode,
        city_name: complexSelectTree.current?.complex?.hierarchy?.city,
        client_name: complexSelectTree.current?.complex?.complexDetails?.client,
        complex_name: complexSelectTree.current?.complex?.complexDetails?.name,
        creator_id: user.userName,
        creator_role: user.userRole,
        criticality: formDataTicket.criticality,
        description: formDataTicket.description,
        district_code: complexSelectTree.current?.complex?.hierarchy?.districtCode,
        district_name: complexSelectTree.current?.complex?.hierarchy?.district,
        fileList: [],
        lead_id: "",
        lead_role: "",
        short_thing_name: "",
        state_code: complexSelectTree.current?.complex?.hierarchy?.stateCode,
        state_name: complexSelectTree.current?.complex?.hierarchy?.state,
        thing_name: "",
        ticket_id: "",
        ticket_status: "",
        timestamp: 0,
        title: formDataTicket.title,
        yearMonthCode: complexSelectTree.current?.yearMonthCode
    }
    console.log('complexSelectTree.current?',complexSelectTree.current);
    console.log('createUserRequest',createUserRequest);
    console.log('imageName', imageName);

    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var requestCopy = { ...createUserRequest };
      let res = [];
      console.log("requestCopy", requestCopy);
      res.push(await executeCreateTicketLambda(requestCopy, credentials));
      let ticketId = res[0].ticketId;
      console.log("res", res);
      if (ticketId && imageName) {
        Promise.all(imageName).then((values) => {
          imageName.forEach((element, index) => {
            let fileId = element;
            let NewUpdatedName = "Raise-" + "Photo-" + "10" + index;
            let fileName = NewUpdatedName;
            executeUploadFileS3(ticketId, fileName, fileId, credentials);
          });
        });
      }
      setDialogData({
        title: "Ticket Submitted",
        message:
          "Ticket successfully submitted, your reference id is: " + ticketId,
        onClickAction: () => {
          dispatch(emptyComplexStore());
          navigate("/incidence/tickets");
          console.error("Ticket successfully submitted");
        },
      });
    } catch (err) {
      handleError(err, "initCreateTicketRequest");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const onSubmit = () => {
    console.log("formDataTicket", formDataTicket);
    console.log('formticket', complexSelectTree.current);
    if (formDataTicket.title == "") {
      setDialogData({
        title: "Validation Error",
        message: "Please enter a title.",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.error("onSubmit Error");
        },
      });
    } else if (formDataTicket.description == "") {
      setDialogData({
        title: "Validation Error",
        message: "Please enter a valid description",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.error("onSubmit Error");
        },
      });
    } else if (complexSelectTree.current?.complex?.complexDetails?.name == "" || complexSelectTree.current?.complex == undefined) {
      setDialogData({
        title: "Validation Error",
        message: "Please enter a valid complex_name.",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.error("onSubmit Error");
        },
      });
    } else {
      console.log("formDetails", formDetails);
      console.log("formDataTicket22", formDataTicket);
      initCreateTicketRequest(formDetails);
    }
  };


  const ComponentSelector = () => {
    var complex = undefined;
    // if (complex !== undefined)
    complex = complexStore[complexStore?.complex?.name];
    if (complex == undefined) return null;
    console.log("checking component selector", complexStore?.complex.name);
    console.log(
      "checking component selector--2",
      complexStore[complexStore?.complex.name]
    );
    console.log("checking component selector--3", complex);
    if (complex !== undefined) return <ComplexHeader />;
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
    var complex = complexStore[complexStore?.complex.name];

    formDetails.assigned_by = "";
    formDetails.assignemt_type = "";
    formDetails.assignment_comment = "";
    formDetails.city_code = complex.hierarchy.cityCode;
    formDetails.city_name = "";
    formDetails.client_name = complex.complexDetails.client;
    formDetails.complex_name = "";
    formDetails.creator_id = user.userName;
    formDetails.creator_role = user.userRole;
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

    complexSelectTree.current = {yearMonthCode, complex}
    console.log('222')    
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

  const handleUpdateCritical = (selection) => {
    console.log('selection', selection);
    formDetails.criticality = selection.value
    setTicketCondition(selection)
    setFormDataTicket( prevFormData => ({
      ...prevFormData,
      criticality: selection.value,
    }));
  }

  const handleUpdateTitle = (e) => {
    console.log('handleUpdateTitle', e.target.value);
    formDetails.title = e.target.value;
    setFormDataTicket( prevFormData => ({
      ...prevFormData,
      title: e.target.value,
    }));
  }

  const handleUpdateDes = (e) => {
    console.log('handleUpdateDes', e.target.value);
    formDetails.description = e.target.value;
    setFormDataTicket( prevFormData => ({
      ...prevFormData,
      description: e.target.value,
    }));
  }


  return (
    <div className="col-md-12">
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <MessageDialog data={dialogData} />

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
                  <InputGroup className="mb-3">
                    <InputGroupText>
                      <LockOutlinedIcon />{" "}
                    </InputGroupText>
                    <div style={{ width: "70%" }}>
                      <Select 
                        options={selectTicketCondition} 
                        value={ticketCondition} 
                        onChange={handleUpdateCritical} 
                        placeholder="Select" 
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            width: "100%",
                          }),
                        }}
                      />
                    </div>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroupText>
                      <PersonOutlineOutlinedIcon />{" "}
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Title"
                      onChange={(e) => handleUpdateTitle(e)}
                    />
                  </InputGroup>

                  <InputGroup className="mb-4">
                    <InputGroupText>
                      <LockOutlinedIcon />{" "}
                    </InputGroupText>
                    <Input
                      type="textarea"
                      placeholder="Description"
                      onChange={(e) => handleUpdateDes(e)}
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

        <div className={"row justiy-content-center"} style={{ marginLeft: "30%", width: "40%" }}>
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
export default CreateNewTicket;
