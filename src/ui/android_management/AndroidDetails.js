import React, {
  useState,
  useEffect,
  useMemo,
  useRef
} from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "../../components/ErrorBoundary";
import {
  colorTheme,
  whiteSurfaceCircularBorder,
  complexCompositionStyle,
  whiteSurface,
  borderCssStyle
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import "./android.css";
import {
  executelistEnterprisesAndroidManagementLambda,
  executelistDevicesAndroidManagementLambda,
  executeCreateEnterpriseAndroidManagementLambda,
  executeDeleteEnterpriseAndroidManagementLambda,
  executeUpdateEnterpriseLambda,
  executeListPolicyLambda,
  executePatchDeviceLambda,
  executeCreatePolicyLambda,
  executePolicyDetailsLambda,
  executePolicyDeleteLambda,
  executelistIotSingleLambda,
  executeDeleteDeviceLambda,
  executeShareQrLambda,
  executeKioskDeviceLambda,
  executeEnterpriseGetLambda,
  executeReintiate_DEVICE_PROV_GET_INFO_RESP_INITLambda,
  executeSoftDeleteEnterpriseLambda,
  executeUndoSoftDeleteEnterpriseLambda
} from "../../awsClients/androidEnterpriseLambda";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { selectUser } from "../../features/authenticationSlice";
import { setListEnterprise , setSelectedOptionEnterprise , setSelectedDevice , setListOfPolicy, setPolicyName , setPolicyDetails,setResetData , setClientName, setBillingGroup , setComplexName,setEnterpriseDetail, setListDevice} from "../../features/androidManagementSlice";
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
import ModalEditDevices from './ModalEditDevices';
import ModalCreatePolicy from './ModalCreatePolicy';
import ModalUpdatePolicy from './ModalUpdatePolicy';
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import DeleteEnterpriseDialog from "./DeleteEnterpriseDialog";
import ModalDeletePolicy from './ModalDeletePolicy';
import RegisterComplex from './RegisterComplex';
import UpdateComplex from './UpdateComplex'
import ModalReinitiate from './ModalReinitiate';
import ShareIcon from '@mui/icons-material/Share';
import ModalShareQR from "./ModalShareQR";

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
  const [dialogDeletePolicy , setDialogDeletePolicy] = useState(null);
  const [dialogCreatePolicy, setDialogCreatePolicy] = useState(false);
  const [showDeviceData, setShowDeviceData] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [showEnterpriseCheck, setShowEnterpriseCheck] = useState(false)
  const [selectedEnterprises, setSelectedEnterprises] = useState([]);
  const [modal, setModal] = useState(false); 
  const toggle = () => setModal(!modal);
  const navigate = useNavigate();
  const [dialogEditEnterprise , setDialogEditEnterprise] = useState(null);
  const [dialogDeleteData, setDialogDeleteData] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [dialogEditDevice , setDialogEditDevice] = useState(null);
  const listofPolicy = useSelector((state) => state.androidManagement.listOfPolicy);
  const policyName = useSelector((state) => state.androidManagement.policyName);
  const policyDetails = useSelector((state) => state.androidManagement.policyDetails);
  const enterpriseDetail = useSelector((state) => state.androidManagement.enterpriseDetail);
  const [listDevices, setListDevices] = useState(undefined);
  const [dialogUpdatePolicy, setDialogUpdatePolicy] = useState(false);
  const confirmationDialog = useRef();
  const Dialogdelete = useRef();
  const [complexDetailShow, setComplexDetailShow] = useState(3);
  const ComplexIotDetails = useSelector((state) => state.androidManagement.complexIotDetail);
  const [registerComplex, setRegisterComplex] = useState(false);
  const [complexChanged, setComplexChanged] = useState(false);
  const [selectedOptionIotComplex, setSelectedOptionIotComplex] = useState(null); // State for react-select
  const [reinitiate, setReinitiate] = useState(null)
  const [qrShare , setQrShare] = useState(null);
  const [kioskState, setkioskState] = useState(false);


  
  const handleClickFunction = async (data) => {
    console.log('data',data);
    ListOfIotClientName();
    ListOfIotBillingGroup();
    dispatch(setComplexName(data.complex_details.Name))
    setSelectedOptionIotComplex({label: data.complex_details.Name , value: data.complex_details.Name})
    if(Object.keys(ComplexIotDetails).length === 0)
    setComplexDetailShow(1);
  }

  const handleResetComplex = () => {
    console.log('handleResetComplex clicked')
    setComplexDetailShow(3)
    dispatch(setListDevice(null));
    dispatch(setSelectedDevice(null));
  }

  const OpenRegisterModal = () => {
    setRegisterComplex(!registerComplex);
  }

  const OpenUpdateComplexModal = () => {
    setComplexChanged(true)
  }

  const ListOfIotClientName = async () => {
    try {
      dispatch(startLoading());
      let command = "list-iot-clientName";
      var result = await executelistIotSingleLambda(user.username, user?.credentials, command);
      console.log('result ClientName', result.body);
      const options = result.body.map(item => ({
        value: item.Name,
        label: item.Name
      }));
      dispatch(setClientName(options));
    } catch (error) {
      handleError(error, 'Error ListOfIotClientName')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotBillingGroup = async () => {
    try {
      dispatch(startLoading());
      let command = "list-billing-groups";
      var result = await executelistIotSingleLambda(user.username, user?.credentials, command);
      console.log('result ListOfIotBillingGroup', result.body);
      const options = result.body.map(item => ({
        value: item.Name,
        label: item.Name
      }));
      dispatch(setBillingGroup(options));
    } catch (error) {
      handleError(error, 'Error ListOfIotBillingGroup')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }


  const handleChangePolicy = async (selectionOption) => {
    try {
      dispatch(startLoading()); // Dispatch the startLoading action
      let object = {
        enterprises_id: selectedOptionEnterprise?.value,
        policy_name: selectionOption.value
      }
      console.log('selectionOption',selectionOption);
      let policyDetail = await executePolicyDetailsLambda(user?.credentials, object)
      console.log('policyDetail',policyDetail);
      if(policyDetail.statusCode == 200) {
          dispatch(setPolicyName(selectionOption))
          dispatch(setPolicyDetails(policyDetail.body));
      } else if(policyDetail.statusCode == 400) {
        setDialogData({
          title: "Not Found",
          message: policyDetail.body,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`handleChangePolicy -->`);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: 'SomethingWent wrong Please try again',
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`handleChangePolicy -->`);
          },
        });
      }
    } catch (err) {
      handleError(err, "fetchListDevicesData");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleGetEnterprise = async (enterpriseId) => {
    try {
      dispatch(startLoading()); // Dispatch the startLoading action
      console.log('enterpriseId',enterpriseId);
      let enterpriseDetail = await executeEnterpriseGetLambda(user?.credentials, enterpriseId)
      console.log('enterpriseDetail',enterpriseDetail);
      if(enterpriseDetail.statusCode == 200) {
          dispatch(setEnterpriseDetail(enterpriseDetail.body))
      } else if(enterpriseDetail.statusCode == 400) {
        setDialogData({
          title: "Error found",
          message: "Something went wrong Please try again later",
          onClickAction: () => {
            // Handle the action when the user clicks OK
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: 'SomethingWent wrong Please try again later',
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`handleGetEnterprise -->`);
          },
        });
      }
    } catch (err) {
      handleError(err, "fetchListDevicesData");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleCheckboxChange = (event) => {
      setIsChecked(event.target.checked);
  };

  const handleChangeIotEnterprise = async (selectionOption) => {
    setComplexDetailShow(0)
    dispatch(setListDevice(null));
    dispatch(setListOfPolicy(null));
    dispatch(setPolicyName(null));
    dispatch(setPolicyDetails(null));
    dispatch(setSelectedDevice(null));
    console.log('selectionOption',selectionOption);
    console.log('enterprise value', selectionOption.value)
    dispatch(setSelectedOptionEnterprise(selectionOption))
    await handleGetEnterprise(selectionOption.value)
    await ListofPolicyFunction(selectionOption.value)
  }

  

  async function ListofPolicyFunction(value) {
    try {
      console.log('list of policy value',value);
      dispatch(startLoading()); // Dispatch the startLoading action
      let listPolicy = await executeListPolicyLambda(user?.credentials, value);
      console.log('listPolicy', listPolicy);
      if(listPolicy.statusCode == 200) {
        if(listPolicy.body.length > 0) {
          const options = listPolicy.body.map(item => ({
            value: item.name,
            label: item.name
          }));
          console.log('options',options)
          dispatch(setListOfPolicy(options));
        }
      } else if(listPolicy.statusCode == 400)  {
        setDialogData({
          title: "Empty",
          message: 'List of Policy Not found',
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`ListofPolicyFunction -->`);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: 'SomethingWent wrong Please try again later',
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`ListofPolicyFunction -->`);
          },
        });
      }
    } catch (err) {
      handleError(err, "ListofPolicyFunction");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  let size = function (bytes) {
    if (bytes === 0) {
      return "0.00 B";
    }
    
    let e = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, e)).toFixed(2) +
      ' ' + ' KMGTP'.charAt(e) + 'B';
  }
  
  const handlekiosk = async (e,data) => {
    try {
      dispatch(startLoading()); // Dispatch the startLoading action
      console.log('data',data);
      let check; 
      let message = '';
      if(data.isKioskEnabled == true) {
        check = false;
        message = "Device successfully switched to maintenance mode"
      } else {
        check = true;
        message = "Device successfully switched to handover mode"
      }
      let object = {
        command : "kiosk_device",
        serial_number: data?.serial_number,
        kiosk_device: check
      }
      console.log('object', object);
        let result_data =  await executeKioskDeviceLambda(user?.credentials, object);
          console.log('result_data',result_data);
          if(result_data.statusCode == 200) {
            setListDevices(null)
            setDialogData({
              title: "Success",
              message: message,
              onClickAction: async () => {
                console.log('handle kiosk success');
                window.location.reload();
                
              },
            })
            dispatch(stopLoading()); // Dispatch the stopLoading action
          } else {
            setDialogData({
              title: "Error",
              message: "Something went wrong",
              onClickAction: () => {
                // Handle the action when the user clicks OK
                console.log("error handlekiosk");
              },
            })
            dispatch(stopLoading()); // Dispatch the stopLoading action
          }
      } catch( err) {
        handleError(err, 'Error handlekiosk')
        dispatch(stopLoading()); // Dispatch the stopLoading action
      }
  }

  const handleEnterprises = async () => {

    console.log('handleEnterprise Function clicked ddd', selectedOptionEnterprise?.value)
    try {
        dispatch(startLoading()); // Dispatch the startLoading action
        console.log('handleDeleteEnterprises');
        var result = await executeSoftDeleteEnterpriseLambda(user?.credentials, selectedOptionEnterprise?.value);
        console.log('result',result);
        if(result.statusCode == 200) {
          setDialogData({
            title: "Success",
            message: "Delete apply on this enterprise Successfully",
            onClickAction: async () => {
              dispatch(setSelectedOptionEnterprise(null))
              dispatch(setEnterpriseDetail(null))
              setSelectedEnterprises([]);
            },
          })
        } else {
          setDialogData({
            title: "Error",
            message: "Something went wrong Please try again later",
            onClickAction: async () => {
            },
          })
        }
    } catch( err) {
      handleError(err, 'Error handle soft delete enterprise')
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const handleEnrollDevice = () => {  
    if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) 
      { 
         setDialogData({
         title: "Validation Error",
         message: "Please Select Enterprise",
         onClickAction: () => {
           // Handle the action when the user clicks OK
           console.log("handleEnrollDevice");
         },
       })
       return
     } else {
          if(enterpriseDetail?.state !== 'active') {
            console.log('can not enroll device because this enterprise in inactive state',enterpriseDetail)
            setDialogData({
              title: "Validation Error",
              message: "Can not enroll device because this enterprise in inactive state",
              onClickAction: () => {
                // Handle the action when the user clicks OK
                console.log("handleEnrollDevice");
              },
            })
            return
          } else {
            navigate("/android_management/enroll_device")
          }
     }
  }

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
        onClickAction: async (data, contactInfo) => {
          try{
            dispatch(startLoading()); // Dispatch the startLoading action
            // Handle the action when the user clicks OK
            console.log("edit is click",data);
            let object = {
              object_key: "enterpriseDisplayName",
              enterpriseId: selectedOptionEnterprise?.value,
              command: "patch_enterprise",
              value: data,
              contactInfo: contactInfo
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
    // Get the current timestamp in milliseconds
    var timestamp = Date.now();
    console.log('Current timestamp (milliseconds):', timestamp);

    // Create a Date object for the current timestamp
    var currentDate = new Date(timestamp);
    console.log('Current date and time:', currentDate.toString());

    // Set the TTL to 7 days from now
    const ttlInSeconds = parseInt((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000); // 7 days in seconds
    console.log('TTL (7 days later) in seconds:', ttlInSeconds);

    // Create a Date object for the TTL date (7 days later)
    var ttlDate = new Date(ttlInSeconds * 1000);
    console.log('TTL date (7 days later):', ttlDate.toString());

    // Calculate 20 minutes before the TTL date
    const twentyMinutesBeforeTTL = new Date(ttlDate.getTime() - 15 * 60 * 1000);
    console.log('Date 20 minutes before TTL:', twentyMinutesBeforeTTL.toString());

    try{
      if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) 
      { 
          setDialogData({
          title: "Validation Error",
          message: "Please Select Enterprise",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("handleDeleteEnterprise");
          },
        })
      } else {
        Dialogdelete.current.showDialog(
          `${selectedOptionEnterprise.label} Delete Enterprise`,
          `These Device will be delete and will reset. You have until ${twentyMinutesBeforeTTL} to undo delete .`,
          "DELETE",
          handleEnterprises
        );
        // setDialogDeleteData({
        //   title: `${selectedOptionEnterprise.label} Delete Enterprise`,
        //   message: "Are You Sure you want to Delete this Enterprise",
        //   onClickAction: () => {
        //     // Handle the action when the user clicks OK
        //     console.log(`clicked ${selectedOptionEnterprise.label} Delete Enterprise `);
        //     handleEnterprises(selectedOptionEnterprise.value)
        //   },
        // });
      }
    } catch( err) {
      handleError(err, 'Error handleDeleteEnterprise')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleUndoSoftDelete = async () => {
    try {
      if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) 
        { 
            setDialogData({
            title: "Validation Error",
            message: "Please Select Enterprise",
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log("handleDeleteEnterprise");
            },
          })
        } else {
          dispatch(startLoading()); // Dispatch the startLoading action
          console.log('handleUndoSoftDelete');
          var result = await executeUndoSoftDeleteEnterpriseLambda(user?.credentials, selectedOptionEnterprise?.value);
          console.log('result',result);
          if(result.statusCode == 200) {
            setDialogData({
              title: "Success",
              message: "Undo Delete this enterprise Successfully",
              onClickAction: async () => {
                dispatch(setSelectedOptionEnterprise(null))
                dispatch(setEnterpriseDetail(null))
                setSelectedEnterprises([]);
                setSelectedEnterprises([]);
              },
            })
          } else {
            setDialogData({
              title: "Error",
              message: "Something went wrong Please try again later",
              onClickAction: async () => {
              },
            })
          }
          dispatch(stopLoading()); // Dispatch the stopLoading action
        }
    } catch( err) {
      handleError(err, 'Error handleUndoSoftDelete')
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

  const EnterpriseCreate = async() => {
    try {
            dispatch(startLoading()); // Dispatch the startLoading action
            // Handle the action when the user clicks OK
            var result = await executeCreateEnterpriseAndroidManagementLambda(user?.credentials, true);
            console.log('executeCreateEnterpriseAndroidManagementLambda',result);
            if(result.statusCode == 200) {
              window.open(`${result?.body?.signupUrl}`,"_blank");
              dispatch(stopLoading()); // Dispatch the stopLoading action
            } else {
              setDialogData({
                title: "Previous Enterprise already exists",
                message: "can you overwrite previous enterprise click Yes otherwise Cancel",
                onClickAction: () => {
                  // Handle the action when the user clicks OK
                  console.log("error EnterpriseCreate");
                  
                },
              });
              dispatch(stopLoading()); // Dispatch the stopLoading action
              return;
            }
        } catch( err) {
          handleError(err, 'Error EnterpriseCreate')
        } finally {
          dispatch(stopLoading()); // Dispatch the stopLoading action
        }
  }
 

  const createEnterprise = async () => {
    try {
      dispatch(startLoading()); // Dispatch the startLoading action
      console.log('create android enterprise',isChecked);
      var result = await executeCreateEnterpriseAndroidManagementLambda(user?.credentials, isChecked);
      console.log('executeCreateEnterpriseAndroidManagementLambda',result);
      if(result.statusCode == 200) {
        window.open(`${result?.body?.signupUrl}`,"_blank");
      } else {
        confirmationDialog.current.showDialog(
          "Enterprise creation already inprogress",
          "To cancel the previous enterprise creation request, Please type 'PROCEED' below Or ( Please try again after 20min )",
          "PROCEED",
          EnterpriseCreate
        );

        // setDialogData({
        //   title: "Previous Enterprise already exists",
        //   message: "can you overwrite previous enterprise click Yes otherwise Cancel",
        //   onClickAction: async () => {
        //     dispatch(startLoading()); // Dispatch the startLoading action
        //     // Handle the action when the user clicks OK
        //     var result = await executeCreateEnterpriseAndroidManagementLambda(user?.credentials, true);
        //     console.log('executeCreateEnterpriseAndroidManagementLambda',result);
        //     if(result.statusCode == 200) {
        //       window.open(`${result?.body?.signupUrl}`,"_blank");
        //       dispatch(stopLoading()); // Dispatch the stopLoading action
        //     } else {
        //       setDialogData({
        //         title: "Previous Enterprise already exists",
        //         message: "can you overwrite previous enterprise click Yes otherwise Cancel",
        //         onClickAction: () => {
        //           // Handle the action when the user clicks OK
        //           console.log("error createEnterprise");
                  
        //         },
        //       });
        //       dispatch(stopLoading()); // Dispatch the stopLoading action
        //       return;
        //     }
        //   },
        //   checkbtn: true
        // });
        // dispatch(stopLoading()); // Dispatch the stopLoading action
        // return;
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

  const handleDeviceDelete = async (object) => {
    setDialogData({
      title: " Delete Device",
      message: "Are you want to sure Delete Device",
      onClickAction: async () => {
        try{
          dispatch(startLoading()); // Dispatch the startLoading action
        console.log('check object', object);

        let result_data = await executeDeleteDeviceLambda(user?.credentials, object);
        console.log("result_data", result_data);
        if(result_data.statusCode == 200) {
           setDialogData({
             title: "Success",
             message: "Device deleted successfully",
             onClickAction: async () => {
               console.log("Response handleDeleteDevice");
               handleResetComplex();
             },
           })
         } else {
           setDialogData({
             title: "Error",
             message: "Something went wrong",
             onClickAction: () => {
               // Handle the action when the user clicks OK
               console.log("error handleDeleteDevice");
             },
           })
         }
      } catch( err) {
        handleError(err, 'Error handleDeleteDevice')
      } finally {
        dispatch(stopLoading()); // Dispatch the stopLoading action
      }
    },
    })
  }

  const handleReinitateDevice = async (device) => {

    console.log('device',device);
    if(device.DEVICE_POLICY_STATE == 'FAIL' || device.DEVICE_APPLICATION_STATE == 'FAIL'|| device.QR_CREATED_STATE == 'FAIL')
    {
      setReinitiate({
        title: "Reinitiate Device",
        message: "reinitate",
        data: device,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("handleDeleteDevice");
        },
      })
    } else {
      if(device.DEVICE_PROV_GET_INFO_PUBLISH == 'FAIL') {
        setDialogData({
          title: "Do One of the following things",
          message: (
            <>
              1. Scan QR and enroll device <br /><br />
              2. Launch Sukriti Iot Admin app and enter the serial number (if asked) and sign in to the control panel
            </>
          ),
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("error handleReinitateDevice");
          },
        })
      } else if (device.DEVICE_PROV_GET_INFO_RESP_INIT == 'FAIL' ) {
        try{
          dispatch(startLoading()); // Dispatch the startLoading action
          let object = {
            command : "reinitate_init_topic",
            topic: `PROVISIONING/${device.serial_number}/RECEIVE_PROV_INFO`,
            serial_number: device.serial_number
          }
          console.log('object',object);
          let result_data = await executeReintiate_DEVICE_PROV_GET_INFO_RESP_INITLambda(user?.credentials, object);
          if(result_data.statusCode == 200) {
            setDialogData({
              title: "Success",
              message: result_data.body,
              onClickAction: async () => {
                console.log("Response handleReinitateDevice");
              },
            })
          } else {
            setDialogData({
              title: "Error",
              message: "Something went wrong",
              onClickAction: () => {
                // Handle the action when the user clicks OK
                console.log("error handleReinitateDevice");
              },
            })
          }
        } catch( err) {
          handleError(err, 'Error handleReinitateDevice')
        } finally {
          dispatch(stopLoading()); // Dispatch the stopLoading action
        }
      } else if (device.DEVICE_PROV_COMPLETED_INFO_RESP_INIT == 'FAIL' ) {
        setDialogData({
          title: "Do One of the following things",
          message: "Please Login to the Sukriti IoT Admin application's control panel and tap the reinitiate button",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("error handleReinitateDevice");
          },
        })
      }
      
    }
  }

  const handleDeleteDevice = async (device) => {
    console.log('handleDeleteDevice device id :->', device);
    let AwsCommissionStatus = device.DEVICE_PROV_COMPLETED_INFO_RESP_INIT;
    let enrollmentstatus = device.DEVICE_PROV_GET_INFO_PUBLISH
    let deviceId = device?.deviceId;
    let serialNumber = device?.serial_number ?? null;
    console.log('check',{AwsCommissionStatus, enrollmentstatus ,deviceId,serialNumber});

    if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined || serialNumber == null || serialNumber == undefined) 
      { 
         setDialogData({
         title: "Validation Error",
         message: "Please Select Enterprise and valid Device",
         onClickAction: () => {
           // Handle the action when the user clicks OK
           console.log("handleDeleteDevice");
         },
       })
       return;
     }

    if(AwsCommissionStatus == "FAIL" || enrollmentstatus == "FAIL") {
      if (serialNumber !== null && deviceId != null && serialNumber !== undefined && deviceId != undefined) {
        console.log('first if abandoned false')
        let object = {
          enterpriseId : selectedOptionEnterprise?.value,
          command : "delete_device",
          abandonDevice: false,
          value : {
            [serialNumber] : deviceId
          }
        }
         await handleDeviceDelete(object);
      } else {
        console.log('Second if else abandon true device');
        let object = {
          enterpriseId : selectedOptionEnterprise?.value,
          command : "delete_device",
          serialNumber: serialNumber,
          abandonDevice: true,
          value: {
            serial_number : serialNumber 
          }
        }
        await handleDeviceDelete(object);
      }
    } else if (serialNumber !== null && deviceId != null && serialNumber !== undefined && deviceId != undefined) {
      console.log('Third else if abandoned false')
      let object = {
        enterpriseId : selectedOptionEnterprise?.value,
        command : "delete_device",
        abandonDevice: false,
        value : {
          [serialNumber] : deviceId
        }
      }
       await handleDeviceDelete(object);
    } else {
      console.log('waiting for handle ')
    }
    // return;
    // if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined || serialNumber == null || serialNumber == undefined) 
    //   { 
    //      setDialogData({
    //      title: "Validation Error",
    //      message: "Please Select Enterprise and valid Device",
    //      onClickAction: () => {
    //        // Handle the action when the user clicks OK
    //        console.log("handleDeleteDevice");
    //      },
    //    })
    //  } else {
    //   setDialogData({
    //     title: " Delete Device",
    //     message: "Are you want to sure Delete Device",
    //     onClickAction: async () => {
    //       try{
    //         dispatch(startLoading()); // Dispatch the startLoading action
    //       // Handle the action when the user clicks OK
    //       console.log("handleDeleteDevice else");
    //       let object = {
    //         enterpriseId : selectedOptionEnterprise?.value,
    //         deviceId : deviceId,
    //         command : "delete_device",
    //         serialNumber: serialNumber
    //       }
    //       console.log('check object', object);
    //       let result_data = await executeDeleteDeviceLambda(user?.credentials, object);
    //       console.log("result_data", result_data);
    //       if(result_data.statusCode == 200) {
    //          setDialogData({
    //            title: "Success",
    //            message: "Device with ID deleted successfully",
    //            onClickAction: async () => {
    //              console.log("Response handleDeleteDevice");
    //            },
    //          })
    //        } else {
    //          setDialogData({
    //            title: "Error",
    //            message: "Something went wrong",
    //            onClickAction: () => {
    //              // Handle the action when the user clicks OK
    //              console.log("error handleDeleteDevice");
    //            },
    //          })
    //        }
    //     } catch( err) {
    //       handleError(err, 'Error handleDeleteDevice')
    //     } finally {
    //       dispatch(stopLoading()); // Dispatch the stopLoading action
    //     }
    //   },

    //   })
      
    //  }

  };

  const handleQr = async (qr, serialNumber) => {
    console.log('qr',qr);
    setQrShare({
      title: "Share QR",
      message: "Share Qr",
      onClickAction: async (data) => {
        try{
          console.log('check qr', qr);
          console.log('data',data);
          dispatch(startLoading()); // Dispatch the startLoading action
          // Handle the action when the user clicks OK
          let result_data =  await executeShareQrLambda(user?.credentials, data, qr,serialNumber);
          console.log('result_data',result_data);
          if(result_data.statusCode == 200) {
            setDialogData({
              title: "Success",
              message: " Qr is sent to your email successfully",
              onClickAction: async () => {
                // Handle the action when the user clicks OK
                console.log("handleQr");
                
              },
            })
          } else {
            setDialogData({
              title: "Error",
              message: "Something went wrong please try again later",
              onClickAction: () => {
                // Handle the action when the user clicks OK
                console.log("error handleQr");
              },
            })
          }
        } catch( err) {
          handleError(err, 'Error handleQr')
        } finally {
          dispatch(stopLoading()); // Dispatch the stopLoading action
        }
      },
    })
  }

  const handleEditDevice = async (data) => {
    let deviceId = data?.android_data?.name;
    let serial_number = data?.serial_number
    console.log('handleEditDevice device id :->', deviceId);
    console.log('clicked',selectedOptionEnterprise?.value);
    if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) 
     { 
        setDialogData({
        title: "Validation Error",
        message: "Please Select Enterprise",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("handleEditDevice");
        },
      })
    } else {
      setDialogEditDevice({
        title: "Edit Device",
        message: selectedOptionEnterprise.label,
        onClickAction: async (data) => {
          console.log('data',data);
            let object = {
              command : "patch_device",
              deviceId : deviceId,
              enterpriseId: selectedOptionEnterprise?.value,
              requestBody: data,
              serial_number: serial_number
            }
          console.log("edit is click check :->",object);
          try{
            dispatch(startLoading()); // Dispatch the startLoading action
            
            let result_data =  await executePatchDeviceLambda(user?.credentials, object);
            console.log('result_data',result_data);
            if(result_data.statusCode == 200) {
              setDialogData({
                title: "Success",
                message: "Device update is successfully",
                onClickAction: async () => {
                  
                  console.log("handleEditDevice");
                },
              })
            } else {
              setDialogData({
                title: "Error",
                message: "Something went wrong",
                onClickAction: () => {
                  // Handle the action when the user clicks OK
                  console.log("error handleEditDevice");
                },
              })
            }
          } catch( err) {
            handleError(err, 'Error handleEditDevice')
          } finally {
            dispatch(stopLoading()); // Dispatch the stopLoading action
          }
        },
      })
    }
  }

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

  const handleDeletePolicy = async () => {
    if(policyDetails.DynamoDB.length > 0) {
      setDialogDeletePolicy({
        title: "Can't Delete Policy",
        message: "Data found",
        data: policyDetails.DynamoDB,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("handleDeletePolicy");
        },
      })
    } else {
      confirmationDialog.current.showDialog(
        "Confirm Action",
        "To delete the policy permanently, type 'DELETE' below",
        "DELETE",
        handleConfirmDeletePolicy
      );
    }
  }

  const handleConfirmDeletePolicy = async() => {
    console.log('confirm button is clicked');
    try{
      dispatch(startLoading()); 
      let result_data =  await executePolicyDeleteLambda(user?.credentials, selectedOptionEnterprise.value, policyName.value);
      console.log('result_data',result_data);
      dispatch(setResetData())
      if(result_data.statusCode == 200) {
        setDialogData({
          title: "Success",
          message: "Policy Deleted is successfully",
          onClickAction: async () => {
            console.log("handleConfirmDeletePolicy function");
            window.location.reload();
          },
        })
      } else {
        setDialogData({
          title: "Error",
          message: result_data.body,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("error handleConfirmDeletePolicy");
            window.location.reload();
          },
        })
      }
    } catch( err) {
      handleError(err, 'Error handleConfirmDeletePolicy')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const createPolicy =  async() => {
    console.log('createPolicy clicked',selectedOptionEnterprise?.value);
    if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) 
     { 
        setDialogData({
        title: "Validation Error",
        message: "Please Select Enterprise",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("handleEditDevice");
        },
      })
    } else {
      setDialogCreatePolicy({
        title: "Create Policy",
        message: selectedOptionEnterprise.label,
        onClose: async()=>{
          setDialogCreatePolicy(false)
        },
        onClickAction: async (data) => {
          data.enterprises_id = selectedOptionEnterprise.value;
          console.log('data',data);
          try{
            dispatch(startLoading()); // Dispatch the startLoading action
            
            let result_data =  await executeCreatePolicyLambda(user?.credentials, data);
            console.log('result_data',result_data);
            if(result_data.statusCode == 200) {
              setDialogData({
                title: "Success",
                message: "Policy Created is successfully",
                onClickAction: async () => {
                  // window.location.reload();
                  console.log("createPolicy function");
                },
              })
            } else {
              setDialogData({
                title: "Error",
                message: "Something went wrong",
                onClickAction: () => {
                  // Handle the action when the user clicks OK
                  console.log("error createPolicy");
                  window.location.reload();
                },
              })
            }
          } catch( err) {
            handleError(err, 'Error createPolicy')
          } finally {
            dispatch(stopLoading()); // Dispatch the stopLoading action
          }
        },
      })
    }
  }

  const updatePolicy = async() => {
    console.log('updatePolicy clicked',selectedOptionEnterprise?.value);
    console.log('policyName', policyDetails);
    if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined || policyDetails == null) 
     { 
        setDialogData({
        title: "Validation Error",
        message: "Please Select Enterprise and policies",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("updatePolicy");
        },
      })
    } else {
      setDialogUpdatePolicy({
        title: "Update Policy",
        message: selectedOptionEnterprise.label,
        policyDetails: policyDetails,
        onClickAction: async (data) => {
          console.log('data',data);
          data.enterprises_id = selectedOptionEnterprise.value;
          console.log('data',data);
          try{
            dispatch(startLoading()); // Dispatch the startLoading action
            
            let result_data =  await executeCreatePolicyLambda(user?.credentials, data);
            console.log('result_data',result_data);
            if(result_data.statusCode == 200) {
              setDialogData({
                title: "Success",
                message: "Policy Updated is successfully",
                onClickAction: async () => {
                  window.location.reload();
                  console.log("updatePolicy function");
                },
              })
            } else {
              setDialogData({
                title: "Error",
                message: "Something went wrong",
                onClickAction: () => {
                  // Handle the action when the user clicks OK
                  console.log("error updatePolicy");
                  window.location.reload();
                },
              })
            }
          } catch( err) {
            handleError(err, 'Error updatePolicy')
          } finally {
            dispatch(stopLoading()); // Dispatch the stopLoading action
          }
        },
      })
    }
  }

  const  AttributeFilter = (data,value) => {
    if (value == 1) {
        const stateNameAttribute = data.Attributes.find(attribute => attribute.Name === 'STATE_NAME');
        const stateName = stateNameAttribute ? stateNameAttribute.Value : 'Not Found';
        return stateName;
    } else if (value == 2) {
        const districtNameAttribute = data.Attributes.find(attribute => attribute.Name === 'DISTRICT_NAME');
        const districtName = districtNameAttribute ? districtNameAttribute.Value : 'Not Found';
        return districtName;
    } else if (value == 3) {
        const cityNameAttribute = data.Attributes.find(attribute => attribute.Name === 'CITY_NAME');
        const cityName = cityNameAttribute ? cityNameAttribute.Value : 'Not Found';
        return cityName;
    } else if (value == 4) {
      const BILL = data.Attributes.find(attribute => attribute.Name === 'BILL');
      const BILL_result = BILL ? BILL.Value : 'Not Found';
      return BILL_result;
    } else if (value == 5) {
      const CLNT = data.Attributes.find(attribute => attribute.Name === 'CLNT');
      const CLNT_result = CLNT ? CLNT.Value : 'Not Found';
        return CLNT_result;
    } else if (value == 6) {
      const COCO = data.Attributes.find(attribute => attribute.Name === 'COCO');
      const COCO_result = COCO ? COCO.Value : 'Not Found';
      return COCO_result;
    } else if (value == 7) {
      const Complex_DATE = data.Attributes.find(attribute => attribute.Name === 'DATE');
      const Complex_DATE_result = Complex_DATE ? Complex_DATE.Value : 'Not Found';
      return Complex_DATE_result;
    } else if (value == 11) {
      const BILLING_GROUP = data.Attributes.find(attribute => attribute.Name === 'BILLING_GROUP');
      const BILLING_GROUP_filter = BILLING_GROUP ? BILLING_GROUP.Value : 'Not Found';
      return BILLING_GROUP_filter;
    } else if(value == 12) {
      const CLIENT = data.Attributes.find(attribute => attribute.Name === 'CLIENT');
      const CLIENT_filter = CLIENT ? CLIENT.Value : 'Not Found';
      return CLIENT_filter;
    } else if(value == 13) {
      const DATE = data.Attributes.find(attribute => attribute.Name === 'DATE');
      const DATE_filter = DATE ? DATE.Value : 'Not Found';
      return DATE_filter;
    } else if(value == 14) {
      const SMART_LEVEL = data.Attributes.find(attribute => attribute.Name === 'SMART_LEVEL');
      const SMART_LEVEL_filter = SMART_LEVEL ? SMART_LEVEL.Value : 'Not Found';
      return SMART_LEVEL_filter;
    } else if(value == 15) {
      const USAGE_CHARGE = data.Attributes.find(attribute => attribute.Name === 'USAGE_CHARGE');
      const USAGE_CHARGE_filter = USAGE_CHARGE ? USAGE_CHARGE.Value : 'Not Found';
      return USAGE_CHARGE_filter;
    } else if(value == 16) {
      const USER_TYPE = data.Attributes.find(attribute => attribute.Name === 'USER_TYPE');
      const USER_TYPE_filter = USER_TYPE ? USER_TYPE.Value : 'Not Found';
      return USER_TYPE_filter;
    } else {
        
    }
}

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
                {"Android Device List"} &nbsp;
              </div>
            </div>
              <Button
                    onClick={() => handleEnrollDevice()}
                    color="primary"
                    className="px-2 d-flex align-items-center" // Adjust padding and add flex properties
                    style={{
                      ...whiteSurfaceCircularBorder,
                      width: "50px",
                      height: "30px",
                      // borderRadius: "8%",
                      fontSize: "14px", // Adjust font size here
                    }}
                  >
              <span style={{ marginRight: '2px', color: "blue"}}><AddIcon/></span>
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
    dispatch(setSelectedDevice(data));
    setComplexDetailShow(2);
  };

  // Rename the function to start with an uppercase letter
  const ListEnterpriseComponent = () => {
  const TreeComponent = () => {
    console.log("hellog");
    return (
      <>
        <ComplexNavigationCompact clicked={handleClickFunction}/>
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
                              className="col-md-3"
                              style={textStyle}
                              onClick={() => handleClickDevice(data)}
                            >
                              {data.cabin_name.split('_')[3] + '_' + data.cabin_name.split('_')[4]}
                            </div>
                            {(data.deviceId && data.DEVICE_PROV_COMPLETED_INFO_RESP_INIT) && (
                            <div
                            className="col-md-5">
                              <Form>
                                <FormGroup switch>
                                <Input
                                  type="switch"
                                  checked={data.isKioskEnabled}
                                  onClick={(e) => handlekiosk(e,data)}
                                />
                                <p>Handover</p>
                                </FormGroup>
                              </Form>
                            </div>
                            )}
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
  }, [listDeviceFetch,selectedOptionEnterprise,kioskState,enterpriseDetail]);

  const DeviceInfoComponent = () => {
    console.log("selectedDeviceFetch", selectedDeviceFetch);
    return (
      <>
        {selectedDeviceFetch && (
          <div className="container">
            <div className="Qr_image">
              <img src={selectedDeviceFetch?.qr_details?.qr} alt="QR Code Image" />
            </div>
            <div className="container">
            <Row>
              <Button
                onClick={() => handleEditDevice(selectedDeviceFetch)}
                color="primary"
                className="px-2 d-flex align-items-center edit_button_device" // Adjust padding and add flex properties
                style={{
                  ...whiteSurfaceCircularBorder,
                  width: "50px",
                  height: "35px",
                  fontSize: "14px", // Adjust font size here
                  marginRight: "18px"
                }}
              >
                <span style={{ marginRight: '2px', color: "blue"}}><EditIcon/></span>
              </Button>
              {(selectedDeviceFetch.DEVICE_POLICY_STATE == "FAIL" || selectedDeviceFetch.DEVICE_APPLICATION_STATE == "FAIL" || selectedDeviceFetch.QR_CREATED_STATE == "FAIL" || selectedDeviceFetch.DEVICE_PROV_GET_INFO_PUBLISH == "FAIL" || selectedDeviceFetch.DEVICE_PROV_GET_INFO_RESP_INIT == "FAIL" ||selectedDeviceFetch.DEVICE_PROV_COMPLETED_INFO_RESP_INIT == "FAIL") && (
                <>
              <Button
                onClick={() => handleReinitateDevice(selectedDeviceFetch)}
                color="primary"
                className="px-2 d-flex align-items-center edit_button_device" // Adjust padding and add flex properties
                style={{
                  ...whiteSurfaceCircularBorder,
                  width: "70px",
                  height: "35px",
                  fontSize: "14px", // Adjust font size here
                  marginRight: "18px"
                }}
              >
                <span style={{ marginRight: '2px', color: "blue"}}>Reinitiate</span>
              </Button>
              </>
              )}
                    <Button
                      onClick={() => handleDeleteDevice(selectedDeviceFetch)}
                      color="primary"
                      className="px-2 d-flex align-items-center delete_button_device" // Adjust padding and add flex properties
                      style={{
                        ...whiteSurfaceCircularBorder,
                        width: "50px",
                        height: "35px",
                        fontSize: "14px", // Adjust font size here
                      }}
                    >
                      <span style={{ marginRight: '2px', color: "red"}}>
                        <DeleteIcon/>
                        </span>
                    </Button>
                  {selectedDeviceFetch?.qr_details?.qr && (
                    <Button
                      onClick={() => handleQr(selectedDeviceFetch?.qr_details?.qr,selectedDeviceFetch?.serial_number)}
                      color="primary"
                      className="px-2 d-flex align-items-center edit_button_device" // Adjust padding and add flex properties
                      style={{
                        ...whiteSurfaceCircularBorder,
                        width: "50px",
                        height: "35px",
                        fontSize: "14px", // Adjust font size here
                        marginLeft: "15px"
                      }}
                        // Add the inert attribute conditionally
                        inert={"true"}
                    >
                      <span style={{ marginRight: '2px', color: "blue"}}><ShareIcon/></span>
                    </Button>
                  )}
              </Row>
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
                        <b>Device State</b>
                      </CardTitle>
                      <CardText>
                        <p>CREATED_STATE: <b>{selectedDeviceFetch.CREATED_STATE}</b></p>
                        <p>PROVISIONING_THING_CREATED_STATE: <b>{selectedDeviceFetch.PROVISIONING_THING_CREATED_STATE}</b></p>
                        <p>CERT_ATTACH_STATE: <b>{selectedDeviceFetch.CERT_ATTACH_STATE}</b></p>
                        <p>DEVICE_POLICY_STATE: <b>{selectedDeviceFetch.DEVICE_POLICY_STATE}</b></p>
                        <p>DEVICE_APPLICATION_STATE: <b>{selectedDeviceFetch.DEVICE_APPLICATION_STATE}</b></p>
                        <p>QR_CREATED_STATE: <b>{selectedDeviceFetch.QR_CREATED_STATE}</b></p>
                        <p>DEVICE_PROV_GET_INFO_PUBLISH: <b>{selectedDeviceFetch.DEVICE_PROV_GET_INFO_PUBLISH}</b></p>
                        <p>DEVICE_PROV_GET_INFO_RESP_INIT: <b>{selectedDeviceFetch.DEVICE_PROV_GET_INFO_RESP_INIT}</b></p>
                        <p>DEVICE_PROV_COMPLETED_INFO_RESP_INIT: <b>{selectedDeviceFetch.DEVICE_PROV_COMPLETED_INFO_RESP_INIT}</b></p>
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
                        <b>Complex Details</b>
                      </CardTitle>
                      <CardText>
                        <p>Complex: {selectedDeviceFetch.complex_details.Name}</p>
                        <p>State: { AttributeFilter(selectedDeviceFetch.complex_details,1)}</p>
                        <p>District: {AttributeFilter(selectedDeviceFetch.complex_details,2)}</p>
                        <p>
                          City:{" "}
                          {AttributeFilter(selectedDeviceFetch.complex_details,3)}
                        </p>
                        <p>BILL: {AttributeFilter(selectedDeviceFetch.complex_details,4)}</p>
                        <p>CLNT: {AttributeFilter(selectedDeviceFetch.complex_details,5)}</p>
                        <p>COCO: {AttributeFilter(selectedDeviceFetch.complex_details,6)}</p>
                        <p>DATE: {AttributeFilter(selectedDeviceFetch.complex_details,7)}</p>
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
                        <b>Hardware Info</b>
                      </CardTitle>
                      <CardText>
                        <p>Brand: {selectedDeviceFetch?.android_data?.hardwareInfo.brand}</p>
                        <p>Model: {selectedDeviceFetch?.android_data?.hardwareInfo.model}</p>
                        <p>
                          Serial Number:{" "}
                          {selectedDeviceFetch.android_data?.hardwareInfo?.serialNumber}
                        </p>
                        <p>
                          Device:{" "}
                          {selectedDeviceFetch.deviceId}
                        </p>
                        <p>
                          Maintenance Mode:{" "}
                          {selectedDeviceFetch.isKioskEnabled == false ? 'False' : 'True'}
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
                        <b>Cabin Details</b>
                      </CardTitle>
                      <CardText>
                        <p>Name: {selectedDeviceFetch.cabin_details.Name}</p>
                        <p>ThingType: {selectedDeviceFetch.cabin_details.ThingType}</p>
                        <p>BILLING_GROUP: {AttributeFilter(selectedDeviceFetch.cabin_details,11)}</p>
                        <p>CLIENT: {AttributeFilter(selectedDeviceFetch.cabin_details,12)}</p>
                        <p>DATE: {AttributeFilter(selectedDeviceFetch.cabin_details,13)}</p>
                        <p>SMART_LEVEL: {AttributeFilter(selectedDeviceFetch.cabin_details,14)}</p>
                        <p>USAGE_CHARGE: {AttributeFilter(selectedDeviceFetch.cabin_details,15)}</p>
                        <p>USER_TYPE: {AttributeFilter(selectedDeviceFetch.cabin_details,16)}</p>
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
        <ModalShareQR data={qrShare} />
        <ModalEditDevices data={dialogEditDevice} />
        <ModalCreatePolicy data={dialogCreatePolicy} />
        <ModalUpdatePolicy data={dialogUpdatePolicy} />
        <ConfirmationDialog ref={confirmationDialog} />
        <DeleteEnterpriseDialog ref={Dialogdelete} />
        <ModalDeletePolicy data={dialogDeletePolicy} />
        <ModalReinitiate data={reinitiate} />
        {(registerComplex) && (
          <RegisterComplex openModal={registerComplex} selected={registerComplex} setModalToggle={OpenRegisterModal} /> // Pass complexChanged as a prop
        )}
        {(ComplexIotDetails['key'] !== null && complexChanged) && (
          <UpdateComplex complexChanged={complexChanged} selected={selectedOptionIotComplex} setComplexChanged={setComplexChanged} handleResetComplex={handleResetComplex}/> // Pass complexChanged as a prop
        )}
        <div className="row">
          <div className="col-md-2" style={{}}>
            {/* <MessageDialog ref={messageDialog} /> */}
            <ErrorBoundary>{memoizedDeviceComponent}</ErrorBoundary>
            <ErrorBoundary>{memoizedListsDeviceComponent}</ErrorBoundary>
          </div>
          <div className="col-md-10" style={{}}>
            <div className="row" style={{ width:"96%", marginLeft: "5%"}}>
              <div className="col-6" style={{...borderCssStyle, }} > 
                <div className="container-item">   
                <b><span> &nbsp;Enterprise : &nbsp; </span></b>
                  <div className="select-container">               
                    <Select
                      options={listEnterprise || []}
                      value={selectedOptionEnterprise}
                      onChange={handleChangeIotEnterprise}
                      placeholder="Select Enterprise"
                      className="select-dropdown"
                    />
                  </div>
                    {/* <div>
                      <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          className="big-checkbox"
                      />
                    </div> */}
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
                  {(selectedOptionEnterprise?.value !== "" && selectedOptionEnterprise !== null && selectedOptionEnterprise?.value !== undefined) 
                  && (
                    <>
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
                  {enterpriseDetail?.state == 'active' ? <Button
                      onClick={() => {
                        handleDeleteEnterprise();
                      }}
                      outline
                      color="primary"
                      className="delete-button"
                    >
                      <DeleteIcon  color="error"/>
                    </Button>  : (
                    null
                  )}
                    </>
                  )}
                </div>
                </div>
                <div className="col-6" style={{...borderCssStyle}}> 
                <div className="container-item policy-container"> 
                <b><span> &nbsp; Policy :  &nbsp; </span> </b>  
                  <div className="select-container">               
                    <Select
                      options={listofPolicy || []}
                      value={policyName}
                      onChange={handleChangePolicy}
                      placeholder="Select Policy"
                      className="select-dropdown"
                    />
                  </div>
                  {enterpriseDetail?.state == 'active' && (
                  <Button
                    onClick={() => {
                      createPolicy();
                    }}
                    outline
                    color="primary"
                    className="add-button"
                  >
                    <AddIcon />
                  </Button>
                  )}
                  {
                   (selectedOptionEnterprise?.value !== "" && selectedOptionEnterprise !== null && selectedOptionEnterprise?.value !== undefined && policyDetails !== null) 
                   &&  (
                    <>
                  <Button
                    onClick={() => {
                      updatePolicy();
                    }}
                    outline
                    color="primary"
                    className="edit-button"
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeletePolicy();
                    }}
                    outline
                    color="primary"
                    className="delete-button"
                  >
                    <DeleteIcon  color="error"/>
                  </Button>
                    </>
                   )
                  }
                </div>
                </div>
            </div>
            {complexDetailShow == 1 ? 
               <ErrorBoundary>{
                <div className="container">
                  <Row>
                    <Col md="12">
                      <b>Complex Details</b> 
                      <Button
                          onClick={() => {
                            OpenRegisterModal();
                          }}
                          outline
                          color="primary"
                          className="add-button"
                        >
                          <AddIcon />
                        </Button>
                        <Button
                        onClick={() => {
                          OpenUpdateComplexModal();
                        }}
                        outline
                        color="primary"
                        className="edit-button"
                      >
                        <EditIcon />
                      </Button>
                    </Col>
                    <Col md="3">
                          
                    </Col>
                  </Row>
                <Row style={{width: "95%"}}>
                  <Col md="6">
                    <Card
                        style={{
                          ...whiteSurface,
                          background: "white",
                          margin: "10px",
                        }}
                      >
                        <CardBody>
                        <CardText>
                            <pre>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>State: </b> {ComplexIotDetails.STATE_NAME}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>District: </b> {ComplexIotDetails.DISTRICT_NAME}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>City: </b> {ComplexIotDetails.CITY_NAME}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>STATE_CODE: </b> {ComplexIotDetails.STATE_CODE}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>DISTRICT_CODE: </b> {ComplexIotDetails.DISTRICT_CODE}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>CITY_CODE: </b> {ComplexIotDetails.CITY_CODE}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>BILL: </b> {ComplexIotDetails.BILL}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>CLNT: </b> {ComplexIotDetails.CLNT}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>COCO: </b> {ComplexIotDetails.COCO}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>DATE: </b> {ComplexIotDetails.DATE}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>Address: </b> {ComplexIotDetails.ADDR}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>CIVL: </b> {ComplexIotDetails.CIVL}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>DEVT: </b> {ComplexIotDetails.DEVT}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>LATT: </b> {ComplexIotDetails.LATT}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>LONG: </b> {ComplexIotDetails.LONG}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>MANU: </b> {ComplexIotDetails.MANU}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>MODIFIED_BY: </b> {ComplexIotDetails.MODIFIED_BY}</p>
                            </pre>
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
                          <CardText>
                            <pre>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>UUID:  </b>              {ComplexIotDetails.UUID}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>THINGGROUPTYPE:  </b>    {ComplexIotDetails.THINGGROUPTYPE}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>TECH:  </b>              {ComplexIotDetails.TECH}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>SLVL:  </b>              {ComplexIotDetails.SLVL}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>ROUTER_IMEI:  </b>       {ComplexIotDetails.ROUTER_IMEI}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>ROUTER_MOBILE:  </b>     {ComplexIotDetails.ROUTER_MOBILE}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>MSNI:  </b>              {ComplexIotDetails.MSNI}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>MSNV:  </b>              {ComplexIotDetails.MSNV}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>ONMP:  </b>              {ComplexIotDetails.ONMP}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>QBWT:  </b>              {ComplexIotDetails.QBWT}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>QFWC:  </b>              {ComplexIotDetails.QFWC}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>QMWC:  </b>              {ComplexIotDetails.QMWC}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>QPWC:  </b>              {ComplexIotDetails.QPWC}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>QSNI:  </b>              {ComplexIotDetails.QSNI}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>QSNV:  </b>              {ComplexIotDetails.QSNV}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>QURC:  </b>              {ComplexIotDetails.QURC}</p>
                            <p style={{border: '1px solid black', padding: '10px'}}><b>QURI:  </b>              {ComplexIotDetails.QURI}</p>
                            </pre>
                          </CardText>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </div>
                }
                </ErrorBoundary>
              :
              <>
              {complexDetailShow == 2 ? 
              <ErrorBoundary>{memoizedDeviceInfoComponent}</ErrorBoundary>
              : <>
              {complexDetailShow == 0 ?  
              <ErrorBoundary>{
                <div className="container">
                  <Row style={{marginTop: "10px" , width: "35%"}}>
                    <Col md="7">
                      <b>Enterprise Details</b> 
                    </Col>
                    <Col md="5">
                        {enterpriseDetail?.state == 'inactive' && (
                          <>
                          <p> <span style={{ color: 'red' }}>
                            {new Date(enterpriseDetail?.ttl * 1000).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span></p>
                            <Button
                              onClick={() => {
                                handleUndoSoftDelete();
                              }}
                              outline
                              color="primary"
                              className="delete-button"
                            >
                              <span color="red">Undo Delete</span>
                            </Button>
                            </>
                          )} 
                    </Col>
                  </Row>     
                <Row style={{width: "95%"}}>
                  <Col md="12">
                    <Card
                        style={{
                          ...whiteSurface,
                          background: "white",
                          margin: "10px",
                        }}
                      >
                        <CardBody>
                        <CardText>
                            <pre>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>name: </b> {enterpriseDetail?.name ?? ''}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>Enterprise Display Name: </b> {enterpriseDetail?.enterpriseDisplayName ?? ''} </p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>Contact Email: </b> {enterpriseDetail?.contactInfo?.contactEmail ?? ''} </p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>Data Protection Officer Name: </b> {enterpriseDetail?.contactInfo?.dataProtectionOfficerName ?? ''} </p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>Data Protection Officer Email: </b> {enterpriseDetail?.contactInfo?.dataProtectionOfficerEmail ?? ''} </p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>Data Protection Officer Phone: </b> {enterpriseDetail?.contactInfo?.dataProtectionOfficerPhone ?? ''} </p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>Representative Name: </b> {enterpriseDetail?.contactInfo?.euRepresentativeName ?? ''}</p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>Representative Email: </b> {enterpriseDetail?.contactInfo?.euRepresentativeEmail ?? ''} </p>
                              <p style={{border: '1px solid black', padding: '10px'}}><b>Representative Phone: </b> {enterpriseDetail?.contactInfo?.euRepresentativePhone ?? ''} </p>
                            </pre>
                          </CardText>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </div>
                }
                </ErrorBoundary> : <></>}
              </>}</>
            }
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AndroidDetails;
