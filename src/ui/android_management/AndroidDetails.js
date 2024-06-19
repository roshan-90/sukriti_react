import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  lazy,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "../../components/ErrorBoundary";
import NoDataComponent from "../../components/NoDataComponent";
import {
  colorTheme,
  whiteSurfaceCircularBorder,
  complexCompositionStyle,
  whiteSurface,
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import "./android.css";
import {
  executelistEnterprisesAndroidManagementLambda,
  executelistDevicesAndroidManagementLambda,
  executeCreateEnterpriseAndroidManagementLambda,
  executeDeleteEnterpriseAndroidManagementLambda,
  executeUpdateEnterpriseLambda,
  executelistIotDynamicLambda
} from "../../awsClients/androidEnterpriseLambda";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { selectUser } from "../../features/authenticationSlice";
import { setListEnterprise , setSelectedOptionEnterprise , setSelectedDevice} from "../../features/androidManagementSlice";
import { Card, CardBody, CardTitle, CardText, Row, Col } from "reactstrap";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button  
} from "reactstrap";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'; // Importing react-select
import ModalEditEnterprise from './ModalEditEnterprise';
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import ModalConfirmDialog from "../../dialogs/ModalConfirmDialog";
import ComplexNavigationCompact from "./ComplexNavigationCompact";


const CreateEnterpriseModal = ({ isOpen, toggleModal }) => {
  const [formData, setFormData] = useState({
    // Define form fields and initial values here
    enterpriseName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, e.g., send data to server
    console.log(formData);
    // Close the modal after form submission
    toggleModal();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Create Enterprise</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="enterpriseName">Enterprise Name</Label>
            <Input
              type="text"
              name="enterpriseName"
              id="enterpriseName"
              value={formData.enterpriseName}
              onChange={handleChange}
            />
          </FormGroup>
          {/* Add more form fields as needed */}
          <Button type="submit" color="primary">
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

function AndroidDetails() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const listEnterprise = useSelector((state) => state.androidManagement.listEnterprise)
  const selectedOptionEnterprise = useSelector((state) => state.androidManagement.selectedOptionEnterprise);
  const listDeviceFetch = useSelector((state) => state.androidManagement.listDevice);
  const selectedDeviceFetch = useSelector((state) => state.androidManagement.selectedDevice);
  const [dialogData, setDialogData] = useState(null);
  // const [listEnterprise, setListEnterprise] = useState(undefined);
  const [listDevices, setListDevices] = useState(undefined);
  const [showDeviceData, setShowDeviceData] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [showEnterpriseCheck, setShowEnterpriseCheck] = useState(false)
  const [selectedEnterprises, setSelectedEnterprises] = useState([]);
  const [modal, setModal] = useState(false); 
  const toggle = () => setModal(!modal);
  const navigate = useNavigate();
  // const [selectedOptionEnterprise, setSelectedOptionEnterprise] = useState(null);
  const [dialogEditEnterprise , setDialogEditEnterprise] = useState(null);
  const [dialogDeleteData, setDialogDeleteData] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
      setIsChecked(event.target.checked);
  };

  const handleChangeIotEnterprise = async (selectionOption) => {
    console.log('selectionOption',selectionOption);
    dispatch(setSelectedOptionEnterprise(selectionOption))
  }

  let size = function (bytes) {
    if (bytes === 0) {
      return "0.00 B";
    }
    
    let e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(2) +
      ' ' + ' KMGTP'.charAt(e) + 'B';
  }
  

  const handleEnterprises = async (enterprise) => {
    try {
        dispatch(startLoading()); // Dispatch the startLoading action
        console.log('handleDeleteEnterprises');
        var result = await executeDeleteEnterpriseAndroidManagementLambda(user?.credentials, enterprise);
        console.log('enterprise:-->', enterprise);
        console.log('result',result);
        setSelectedEnterprises([]);
    } catch( err) {
      handleError(err, 'Error create android enterprise')
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const handleEditEnterprise = async () => {
    console.log('clicked',selectedOptionEnterprise?.value);
    if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) 
     { 
        setDialogData({
        title: "Validation Error",
        message: "Please Select Enterprise",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("handleEditEnterprise");
        },
      })
    } else {
      setDialogEditEnterprise({
        title: "Edit Enterprise",
        message: selectedOptionEnterprise.label,
        onClickAction: async (data) => {
          try{
            dispatch(startLoading()); // Dispatch the startLoading action
            // Handle the action when the user clicks OK
            console.log("edit is click",data);
            let object = {
              object_key: "enterpriseDisplayName",
              enterpriseId: selectedOptionEnterprise?.value,
              command: "patch_enterprise",
              value: data
            }
            let result_data =  await executeUpdateEnterpriseLambda(user?.credentials, object);
            console.log('result_data',result_data);
            if(result_data.statusCode == 200) {
              setDialogData({
                title: "Success",
                message: "Enterprise update is successfully",
                onClickAction: async () => {
                  dispatch(setSelectedOptionEnterprise(null))
                  // Handle the action when the user clicks OK
                  console.log("handleEditEnterprise");
                  await fetchListEnterprisesData()
                },
              })
            } else {
              setDialogData({
                title: "Error",
                message: "Something went wrong",
                onClickAction: () => {
                  // Handle the action when the user clicks OK
                  console.log("error handleEditEnterprise");
                },
              })
            }
          } catch( err) {
            handleError(err, 'Error handleEditEnterprise')
          } finally {
            dispatch(stopLoading()); // Dispatch the stopLoading action
          }
        },
      })
    }
  }

  const handleDeleteEnterprise = async () => {
    try{
    console.log('clicked',selectedOptionEnterprise?.value);
      if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) 
      { 
          setDialogData({
          title: "Validation Error",
          message: "Please Select Enterprise",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("handleEditEnterprise");
          },
        })
      } else {
        setDialogDeleteData({
          title: `${selectedOptionEnterprise.label} Delete Enterprise`,
          message: "Are You Sure Delete this Enterprise",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log( `clicked ${selectedOptionEnterprise.label} Delete Enterprise `);
            // handleEnterprises(selectedOptionEnterprise.value)
          },
        });
      }
    } catch( err) {
      handleError(err, 'Error handleDeleteEnterprise')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }


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

  const createEnterprise = async () => {
    try {
      dispatch(startLoading()); // Dispatch the startLoading action
      console.log('create android enterprise');
      var result = await executeCreateEnterpriseAndroidManagementLambda(user?.credentials, isChecked);
      console.log('executeCreateEnterpriseAndroidManagementLambda',result);
      if(result.statusCode == 200) {
        window.open(`${result?.body?.signupUrl}`,"_blank");
      } else {
        setDialogData({
          title: "Error",
          message: result?.body,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("error createEnterprise");
          },
        });
        return;
      }
    } catch( err) {
      handleError(err, 'Error create android enterprise')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const fetchListEnterprisesData = async () => {
    try {
      setListDevices(null);
      dispatch(startLoading()); // Dispatch the startLoading action
      var result = await executelistEnterprisesAndroidManagementLambda(
        user?.credentials
      );
      console.log("fetchListEnterprisesData", result);
      const options = result.body.enterprises.map(item => ({
        value: item.name,
        label: item.enterpriseDisplayName
      }));
      dispatch(setListEnterprise(options));
    } catch (err) {
      handleError(err, "fetchListEnterprisesData");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const fetchListDevicesData = async (enterpriseId) => {
    try {
      setListDevices(null);
      dispatch(startLoading()); // Dispatch the startLoading action
      var result = await executelistDevicesAndroidManagementLambda(
        enterpriseId,
        user?.credentials
      );
      console.log("fetchListDevicesData", result);
      setListDevices(result.body.devices);
    } catch (err) {
      handleError(err, "fetchListDevicesData");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  useEffect(() => {
    fetchListEnterprisesData();
  }, []);

  const Header = () => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: colorTheme.primary,
          padding: "10px",
        }}
      >
        <div
          style={{
            ...whiteSurfaceCircularBorder,
            float: "left",
            padding: "10px",
            width: "50px",
            height: "50px",
          }}
        >
          <img
            src={icToilet}
            alt=""
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "5%",
            }}
          />
        </div>

        <div style={{ float: "left", marginLeft: "10px",marginRight: "10px" }}>
          <div style={{ ...complexCompositionStyle.complexTitleClient }}>
            {"Enterprise"}
          </div>
        </div>
        <Button
              onClick={() => {
                createEnterprise();
              }}
              color="primary"
              className="px-2 d-flex align-items-center" // Adjust padding and add flex properties
              style={{
                ...whiteSurfaceCircularBorder,
                width: "70px",
                height: "30px",
                // borderRadius: "8%",
                fontSize: "14px", // Adjust font size here
              }}
            >
         <span style={{ marginRight: '5px', color: "black"}}>+ New</span>
            </Button>
      </div>
      
    );
  };

  const ListDeviceHeader = () => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: colorTheme.primary,
          padding: "10px",
        }}
      >
        <div
          style={{
            ...whiteSurfaceCircularBorder,
            float: "left",
            padding: "10px",
            width: "50px",
            height: "50px",
          }}
        >
          <img
            src={icToilet}
            alt=""
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "5%",
            }}
          />
        </div>

        <div style={{ float: "left", marginLeft: "10px" }}>
          <div style={{ ...complexCompositionStyle.complexTitleClient }}>
            {"Android Device List"}
          </div>
        </div>
        <Button
              onClick={() => {
                navigate("/android_management/enroll_device")
              }}
              color="primary"
              className="px-2 d-flex align-items-center" // Adjust padding and add flex properties
              style={{
                ...whiteSurfaceCircularBorder,
                width: "90px",
                height: "30px",
                // borderRadius: "8%",
                fontSize: "14px", // Adjust font size here
              }}
            >
         <span style={{ marginRight: '2px', color: "black"}}>+ New</span>
            </Button>
      </div>
    );
  };

  const circleStyle = {
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 8px 0px",
    backgroundColor: "green",
    borderRadius: "50%",
    width: "10px",
    height: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  
  const rowStyle = {
    margin: "10px 0px", // Adjusted margin to add space between rows
    padding: "10px",
    cursor: "pointer",
  };
  
  const colStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0px",
  };
  
  const textStyle = {
    color: "black",
    fontSize: "11px",
    fontWeight: "700",
    fontStyle: "normal",
    marginRight: "5px", // Added margin to separate text from checkbox
  };

  const checkboxStyle = {
    width: "22px"
  }

  const handleClickEnterpise = (data) => {
    fetchListDevicesData(data);
  };

  const handleClickDevice = (data) => {
    // dispatch(setSelectedDevice(null));
    console.log("data", data);
    dispatch(setSelectedDevice(data));
  };

  // Rename the function to start with an uppercase letter
  const ListEnterpriseComponent = () => {
    console.log("listEnterprise", listEnterprise);

  // const handleCheckboxChange = (name) => {
  //   setSelectedEnterprises((prevSelected) => {
  //     if (prevSelected.includes(name)) {
  //       return prevSelected.filter((enterprise) => enterprise !== name);
  //     } else {
  //       return [...prevSelected, name];
  //     }
  //   });
  // };



  const TreeComponent = () => {
    console.log("hellog");
    return (
      <>
        <ComplexNavigationCompact />
      </>
    );
  };

  const memoizedTreeComponent = useMemo(() => {
    return <TreeComponent />;
  }, []);

  return (
    <>
    
    <div className="row" style={{  padding: "5px" , width: "150%"}}>
      {/* Header Component */}
    {memoizedTreeComponent}
      {/* <Header /> */}

      {/* {listEnterprise && (
        <div style={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}>
            {listEnterprise.map((data, index) => (
              <div className="row" style={rowStyle} key={index}>
                <div className="col-md-2" style={colStyle}>
                  {showEnterpriseCheck && (
                    <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(data.name)}
                    checked={selectedEnterprises.includes(data.name)}
                    />
                  )}
                  {showEnterpriseCheck == false && (
                    <div style={circleStyle}></div>
                  )}
                </div>
                <div className="col-md-7" style={{ ...textStyle, alignSelf: 'center' }}
                onClick={ () => handleClickEnterpise(data.name)}>
                  {data.name}
                </div>
              </div>
            ))}
          </div>

      )} */}
    </div>
    </>
  );
  };

  const memoizedDeviceComponent = useMemo(() => {
    return <ListEnterpriseComponent />;
  }, [listEnterprise,showEnterpriseCheck,selectedEnterprises]);

  const deviceName = (name) => {
    let array = name.split("/");
    return `${array[2]}/${array[3]}`;
  };

  const ListsDeviceComponent = () => {
    console.log("listDeviceFetch", listDeviceFetch);
    return (
      <div
        className="row"
        style={{ marginTop: "10px", background: "white", padding: "5px", width: "140%" }}
      >
          <>
            <ListDeviceHeader />
        {listDeviceFetch && (
            <div
              style={{
                ...whiteSurface,
                background: "white",
                width: "100%",
                overflow: "auto",
                maxHeight: "200px",
              }}
            >
              {listDeviceFetch.map((data, index) => {
                const circleColor =
                  data.DEVICE_PROV_COMPLETED_INFO_RESP_INIT == "TRUE" ? "green" : "red";

                let circleActive = {
                  boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 8px 0px",
                  backgroundColor: circleColor,
                  borderRadius: "50%",
                  width: "10px",
                  height: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                };
                return (
                  <>
                    <div className="row" style={rowStyle} key={index}>
                      <div className="col-md-2" style={colStyle}>
                        <div style={circleActive}></div>
                      </div>
                      <div
                        className="col-md-8"
                        style={textStyle}
                        onClick={() => handleClickDevice(data)}
                      >
                        {data.serial_number} {/* Call the function here */}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
        )}
        </>
      </div>
    );
  };

  const memoizedListsDeviceComponent = useMemo(() => {
    return <ListsDeviceComponent />;
  }, [listDeviceFetch]);

  const DeviceInfoComponent = () => {
    console.log("selectedDeviceFetch", selectedDeviceFetch);
    return (
      <>
        {selectedDeviceFetch && (
          <div className="container">
            <div className="Qr_image">
              <img src={selectedDeviceFetch.qr_details.qr} alt="QR Code Image" />
            </div>
            <div
              style={{
                ...whiteSurface,
                background: "white",
                width: "100%",
                overflow: "auto",
              }}
            >
              <Row>
                <Col md="6">
                  <Card
                    style={{
                      ...whiteSurface,
                      background: "white",
                      margin: "10px",
                    }}
                  >
                    <CardBody>
                      <CardTitle>
                        <b>Hardware Info</b>
                      </CardTitle>
                      <CardText>
                        <p>Brand: {selectedDeviceFetch?.android_data?.hardwareInfo.brand}</p>
                        <p>Model: {selectedDeviceFetch?.android_data?.hardwareInfo.model}</p>
                        <p>
                          Serial Number:{" "}
                          {selectedDeviceFetch.android_data?.hardwareInfo?.serialNumber}
                        </p>
                        {/* Add more hardware info fields as needed */}
                      </CardText>
                    </CardBody>
                  </Card>
                  <Card
                    style={{
                      ...whiteSurface,
                      background: "white",
                      margin: "10px",
                    }}
                  >
                    <CardBody>
                      <CardTitle>
                        <b>Software Info</b>
                      </CardTitle>
                      <CardText>
                        <p>
                          Android Version:{" "}
                          {selectedDeviceFetch?.android_data?.softwareInfo?.androidVersion}
                        </p>
                        <p>
                          Build Number:{" "}
                          {selectedDeviceFetch?.android_data?.softwareInfo?.androidBuildNumber}
                        </p>
                        {/* Add more software info fields as needed */}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
                <Col md="6">
                  <Card
                    style={{
                      ...whiteSurface,
                      background: "white",
                      margin: "10px",
                    }}
                  >
                    <CardBody>
                      <CardTitle>
                        <b>Memory Info</b>
                      </CardTitle>
                      <CardText>
                        <p>Total RAM: {size(selectedDeviceFetch?.android_data?.memoryInfo.totalRam)}</p>
                        <p>
                          Total Internal Storage:{" "}
                          {size(selectedDeviceFetch?.android_data?.memoryInfo.totalInternalStorage)}
                        </p>
                      </CardText>
                    </CardBody>
                  </Card>
                  <Card
                    style={{
                      ...whiteSurface,
                      background: "white",
                      margin: "10px",
                    }}
                  >
                    <CardBody>
                      <CardTitle>
                        <b> General Details</b>
                      </CardTitle>
                      <CardText>
                        <p> <b>Name: </b>{selectedDeviceFetch?.android_data?.name}</p>
                        <p>
                           <b>Management Mode: </b>{" "}
                          {selectedDeviceFetch?.android_data?.managementMode}
                        </p>
                        <p>
                          <b>Applied State:</b>{" "}
                          {selectedDeviceFetch?.android_data?.appliedState}
                        </p>
                        <p>
                          <b>Policy:</b>{" "}
                          {selectedDeviceFetch?.android_data?.policyName}
                        </p>
                        <p>
                          <b>Enrollment Time:</b>{" "}
                          {selectedDeviceFetch?.android_data?.enrollmentTime}
                        </p>
                        <p>
                          <b>API Level:</b>{" "}
                          {selectedDeviceFetch?.android_data?.apiLevel}
                        </p>
                        <p>
                          <b>Last Policy Sync Time:</b>{" "}
                          {selectedDeviceFetch?.android_data?.lastPolicySyncTime}
                        </p>
                        <p>
                          <b>Enrollment Token Name:</b>{" "}
                          {selectedDeviceFetch?.android_data?.enrollmentTokenName}
                        </p>
                        <p>
                          <b>Enrollment Token Data:</b>{" "}
                          {selectedDeviceFetch?.android_data?.enrollmentTokenData}
                        </p>
                        <p>
                          <b>Username:</b>{" "}
                          {selectedDeviceFetch?.android_data?.userName}
                        </p>
                        <p>
                          <b>Ownership:</b>{" "}
                          {selectedDeviceFetch?.android_data?.ownership}
                        </p>
                        <p>
                          <b>Applied Policy Name:</b>{" "}
                          {selectedDeviceFetch?.android_data?.appliedPolicyName}
                        </p>
                        <p>
                          <b>Last Status Report Time:</b>{" "}
                          {selectedDeviceFetch?.android_data?.lastStatusReportTime}
                        </p>
                        <p>
                          <b>Applied Policy Version:</b>{" "}
                          {selectedDeviceFetch?.android_data?.appliedPolicyVersion}
                        </p>
                        <p>
                          <b>Policy Compliant: </b>{" "}
                          {selectedDeviceFetch?.android_data?.policyCompliant}
                        </p>
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </>
    );
  };

  const memoizedDeviceInfoComponent = useMemo(() => {
    return <DeviceInfoComponent />;
  }, [selectedDeviceFetch]);

  console.log('selectedEnterprises.length',selectedEnterprises.length);
  return (
    <ErrorBoundary>
      <div className="animated fadeIn" style={{ padding: "10px" }}>
        {isLoading && (
          <div className="loader-container">
            <CircularProgress
              className="loader"
              style={{ color: "rgb(93 192 166)" }}
            />
          </div>
        )}
        <MessageDialog data={dialogData} />
        <ModalConfirmDialog data={dialogDeleteData} />
        <ModalEditEnterprise data={dialogEditEnterprise} />
        <div className="row">
          <div className="col-md-2" style={{}}>
            {/* <MessageDialog ref={messageDialog} /> */}
            <ErrorBoundary>{memoizedDeviceComponent}</ErrorBoundary>
            <ErrorBoundary>{memoizedListsDeviceComponent}</ErrorBoundary>
          </div>
          <div className="col-md-10" style={{}}>
            
                  <div className="container-item">   
                  <div className="select-container">               
                    <Select
                      options={listEnterprise || []}
                      value={selectedOptionEnterprise}
                      onChange={handleChangeIotEnterprise}
                      placeholder="Select Enterprise"
                      className="select-dropdown"
                    />
                  </div>
                    <div>
                      <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          className="big-checkbox"
                      />
                </div>
                  <Button
                    onClick={() => {
                      createEnterprise();
                    }}
                    outline
                    color="primary"
                    className="add-button"
                  >
                    <AddIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleEditEnterprise();
                    }}
                    outline
                    color="primary"
                    className="edit-button"
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeleteEnterprise();
                    }}
                    outline
                    color="primary"
                    className="delete-button"
                  >
                    <DeleteIcon  color="error"/>
                  </Button>
                </div>
            <ErrorBoundary>{memoizedDeviceInfoComponent}</ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AndroidDetails;
