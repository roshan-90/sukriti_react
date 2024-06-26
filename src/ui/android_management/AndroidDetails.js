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
  executePolicyDeleteLambda
} from "../../awsClients/androidEnterpriseLambda";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { selectUser } from "../../features/authenticationSlice";
import { setListEnterprise , setSelectedOptionEnterprise , setSelectedDevice , setListOfPolicy, setPolicyName , setPolicyDetails,setResetData} from "../../features/androidManagementSlice";
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
import ModalDeletePolicy from './ModalDeletePolicy';

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
  const [listDevices, setListDevices] = useState(undefined);
  const [dialogUpdatePolicy, setDialogUpdatePolicy] = useState(false);
  const confirmationDialog = useRef();

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

  const handleCheckboxChange = (event) => {
      setIsChecked(event.target.checked);
  };

  const handleChangeIotEnterprise = async (selectionOption) => {
    console.log('selectionOption',selectionOption);
    dispatch(setSelectedOptionEnterprise(selectionOption))
    ListofPolicyFunction(selectionOption.value)
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
            value: item.name.split("/")[3],
            label: item.name.split("/")[3]
          }));
          console.log('options',options)
          dispatch(setListOfPolicy(options));
        }
      } else if(listPolicy.statusCode == 400)  {
        setDialogData({
          title: "Empty",
          message: 'Data Not found',
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
        setDialogDeleteData({
          title: `${selectedOptionEnterprise.label} Delete Enterprise`,
          message: "Are You Sure Delete this Enterprise",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`clicked ${selectedOptionEnterprise.label} Delete Enterprise `);
            handleEnterprises(selectedOptionEnterprise.value)
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

  const handleDeleteDevice = async (deviceId) => {
    console.log('handleDeleteDevice device id :->', deviceId);
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
       let object = {
         enterpriseId : selectedOptionEnterprise?.value,
         deviceId : deviceId,
         command : "delete_device"
       }
       console.log('check object', object);
      //  let result_data = await executeDeleteDeviceLambda(user?.credentials, object);
      //  console.log("result_data", result_data);
      //  if(result_data.statusCode == 200) {
      //     setDialogData({
      //       title: "Success",
      //       message: result_data.body,
      //       onClickAction: async () => {
      //         console.log("Response handleDeleteDevice");
      //       },
      //     })
      //   } else {
      //     setDialogData({
      //       title: "Error",
      //       message: "Something went wrong",
      //       onClickAction: () => {
      //         // Handle the action when the user clicks OK
      //         console.log("error handleDeleteDevice");
      //       },
      //     })
      //   }
     }

  };

  const handleEditDevice = async (deviceId) => {
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
              requestBody: data
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
        "To delete the Vendor Details permanently, type 'DELETE' below",
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
          },
        })
      } else {
        setDialogData({
          title: "Error",
          message: result_data.body,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("error handleConfirmDeletePolicy");
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
  };

  // Rename the function to start with an uppercase letter
  const ListEnterpriseComponent = () => {
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
                              {data.cabin_name.split('_')[3] + '_' + data.cabin_name.split('_')[4]}
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
              <img src={selectedDeviceFetch?.qr_details?.qr} alt="QR Code Image" />
            </div>
            <div className="container">
            <Row>
              <Button
                onClick={() => handleEditDevice(selectedDeviceFetch?.android_data?.name)}
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
              <Button
                  onClick={() => handleDeleteDevice(selectedDeviceFetch?.android_data?.name)}
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
        <ModalEditDevices data={dialogEditDevice} />
        <ModalCreatePolicy data={dialogCreatePolicy} />
        <ModalUpdatePolicy data={dialogUpdatePolicy} />
        <ConfirmationDialog ref={confirmationDialog} />
        <ModalDeletePolicy data={dialogDeletePolicy} />
        <div className="row">
          <div className="col-md-2" style={{}}>
            {/* <MessageDialog ref={messageDialog} /> */}
            <ErrorBoundary>{memoizedDeviceComponent}</ErrorBoundary>
            <ErrorBoundary>{memoizedListsDeviceComponent}</ErrorBoundary>
          </div>
          <div className="col-md-10" style={{}}>
            <div className="row">
              <div className="col-6"> 
                <div className="container-item ">   
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
                    </>
                  )}
                </div>
                </div>
                <div className="col-6"> 
                <div className="container-item policy-container">   
                  <div className="select-container">               
                    <Select
                      options={listofPolicy || []}
                      value={policyName}
                      onChange={handleChangePolicy}
                      placeholder="Select Policy"
                      className="select-dropdown"
                    />
                  </div>
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
            <ErrorBoundary>{memoizedDeviceInfoComponent}</ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AndroidDetails;
