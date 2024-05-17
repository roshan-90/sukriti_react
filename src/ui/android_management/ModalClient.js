import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Select from 'react-select'; // Importing react-select
import { setStateIotList, setDistrictIotList, setCityIotList,setClientName, setBillingGroup , setComplexName} from "../../features/androidManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import {
  executeUpdateComplexLambda,
  executelistIotDynamicLambda,
  executelistIotSingleLambda,
  executelistDDbCityLambda,
  executeAddDdbStateLambda
} from "../../awsClients/androidEnterpriseLambda";
import { selectUser } from "../../features/authenticationSlice";
import {Row, Col, FormGroup, Label, Input } from 'reactstrap';
import { FaCheck } from "react-icons/fa";


const ModalClient = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const stateIotList = useSelector((state) => state.androidManagement.stateIotList);
  const [selectedOption, setSelectedOption] = useState(null); // State for react-select
  const districtIotList = useSelector((state) => state.androidManagement.districtIotList);
  const cityIotList = useSelector((state) => state.androidManagement.cityIotList);
  const [selectedOptionIotDistrict, setSelectedOptionIotDistrict] = useState(null); // State for react-select
  const [selectedOptionIotCity, setSelectedOptionIotCity] = useState(null); // State for react-select
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [dialogData, setDialogData] = useState(null);
  const [formData, setFormData] = useState({
    STATE: '',
    DISTRICT: '',
    CITY: '',
    HEALTH_LIGHT: false,
    HEALTH_FAN: false,
    HEALTH_FLUSH: false,
    HEALTH_FLOOR_CLEAN: false,
    AVERAGE_FEEDBACK: false,
    TOTAL_USAGE: false,
    WATER_LEVEL: false,
    AQI_NH3: false,
    AQI_CO: false,
    AQI_CH4: false,
    LUMINOSITY: false,
    DEVICE_THEFT: false,
    LATITUDE: false,
    LONGITUDE: false,
    TOTAL_WATER_RECYCLED: false,
    Description: '',
    Name: ''
  });
  const [complexVerify, setComplexVerify ] = useState(null);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setOnClickAction(() => data.onClickAction || undefined);
      setOpen(true);
      setStateIotList([]);
      setDistrictIotList([]);
      setCityIotList([]);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    setSelectedOption(null);
  };

  const handleButtonClick = () => {
    handleClose();
    if (onClickAction !== undefined) {
      onClickAction(formData);
      setOpen(false);
      setSelectedOption(null);
    }
  };

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

  const ListOfIotState = async () => {
    try {
      dispatch(startLoading());
      let command = "list-iot-state";
      var result = await executelistIotSingleLambda('test_rk_mandi',user?.credentials, command);
      console.log('result',result);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item.CODE,
        label: item.NAME
      }));
      dispatch(setStateIotList(options));
    } catch (error) {
      handleError(error, 'Error ListOfIotState')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }
  
  const handleChangeIotState = (selectedOption) => {
    console.log('check', selectedOption.value);
    dispatch(setDistrictIotList([]));
    dispatch(setCityIotList([]));
    setSelectedOptionIotDistrict(null)
    setSelectedOptionIotCity(null);
    setSelectedOption(selectedOption); // Update state if selectedOption is not null
    ListOfIotDistrict(selectedOption.value)
    setFormData({...formData,STATE: selectedOption.label.toUpperCase().replace(/ /g, "_")})
  };

  const ListOfIotDistrict = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-district";
      var result = await executelistIotDynamicLambda('test_rk_mandi', user?.credentials, value,command);
      console.log('result',result);
      console.log('result.body',result.body);
      if(result.statusCode !== 404){
        // Map raw data to react-select format
        const options = result.body.map(item => ({
          value: item.CODE,
          label: item.NAME
        }));
        dispatch(setDistrictIotList(options));
      }
    } catch (error) {
      handleError(error, 'Error ListOfIotDistrict')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotCity = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-city";
      var result = await executelistIotDynamicLambda('test_rk_mandi', user?.credentials, value, command);
      console.log('result',result);
      if(result.statusCode !== 404){
        // Map raw data to react-select format
        const options = result.body.map(item => ({
          value: item.CODE,
          label: item.NAME
        }));
        dispatch(setCityIotList(options));
      }
    } catch (error) {
      handleError(error, 'Error ListOfIotCity')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleChangeIotDistrict = (selectedOption) => {
    dispatch(setCityIotList([]));
    setSelectedOptionIotCity(null)
    console.log('handleChangeIotDistrict',selectedOption);
    setSelectedOptionIotDistrict(selectedOption);
    ListOfIotCity(selectedOption.value)
    setFormData({...formData, DISTRICT: selectedOption.label.toUpperCase().replace(/ /g, "_")})

  }

  const handleChangeIotCity = (selectedOption) => {
    console.log('handleChangeIotCity',selectedOption);
    setSelectedOptionIotCity(selectedOption);
    setFormData({...formData, CITY: selectedOption.label.toUpperCase().replace(/ /g, "_")})
  }

  const handleVerify = async () => {
    console.log('verify',formData);
    try {
      dispatch(startLoading());
      let command = "list-iot-clientName";
      var result = await executelistIotSingleLambda('test_rk_mandi', user?.credentials, command);
      console.log('result ClientName', result.body);
      // Value to check
      const valueToCheck = formData.Name.toUpperCase();

      // Check if the value exists
      const valueExists = result.body.some(item => item.Name === valueToCheck);

        if (valueExists) {
          setDialogData({
            title: "Not Verified",
            message: `The value "${valueToCheck}" exists .`,
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log(`The value "${valueToCheck}" exists in the array.`);
              },
            });
            setComplexVerify(false);
            return;
        }
        setComplexVerify(true);
    } catch (error) {
      handleError(error, 'Error handleVerify')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleChange = (e) => {
    const { name  } = e.target;
    console.log('name',name)
    if(name =='Name'){
      setFormData({...formData, [name]: e.target.value})
    } else if(name == 'Description') {
      setFormData({...formData, [name]: e.target.value})
    } else {
      setFormData({...formData, [name]: e.target.checked})
    }
  }

  
  if(data) {
    console.log('data.options',data.options);
    return (
      <Dialog className="dialog-selects" open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        style: {
          height: '95%', // Adjust the maximum height as needed
          maxWidth: '1223px'
        },
      }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div style={{ margin: "auto", width: "90%" }}>
          <FormGroup row>
            <Label
              for="Client Name"
              sm={2}
            >
            <b style={{fontSize:"small"}}> Client Name</b>
            </Label>
            <Col sm={9}>
              <Input
                id="Name"
                name="Name"
                placeholder="Client Name"
                type="text"
                onChange={handleChange}
              />
            </Col>
            <Col sm={1}>
              {complexVerify == true ? <>
                <Button color="success"  disabled>
                  <FaCheck />
                </Button>{' '}
              </> :
              <>
                <Button color="info" onClick={handleVerify}>
                  check
                </Button>{' '}
              </>}
            </Col>
            </FormGroup>
            <FormGroup row>
                <Label
                  for="State"
                  sm={2}
                >
                  <b style={{fontSize:"small"}}>State</b>
                </Label>
                <Col sm={10}>
                <Select options={stateIotList || []} value={selectedOption} onChange={handleChangeIotState}         
                  onMenuOpen={() => {
                    if (!stateIotList || stateIotList.length === 0) {
                      ListOfIotState();
                    }
                  }} placeholder="Select State" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label
                  for="District"
                  sm={2}
                >
                <b style={{fontSize:"small"}}> District</b>
                </Label>
                <Col sm={10}>
                  <Select options={districtIotList || []} value={selectedOptionIotDistrict} onChange={handleChangeIotDistrict} placeholder="Select District" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label
                  for="City"
                  sm={2}
                >
                <b style={{fontSize:"small"}}> City </b>
                </Label>
                <Col sm={10}>
                  <Select options={cityIotList || []} value={selectedOptionIotCity} onChange={handleChangeIotCity} placeholder="Select City" />
                </Col>
              </FormGroup>      
              <FormGroup row>
                <Label
                  for="Description"
                  sm={2}
                >
                <b style={{fontSize:"small"}}> Description </b> 
                </Label>
                <Col sm={10}>
                  <Input
                    id="Description"
                    name="Description"
                    type="textarea"
                    placeholder="Description"
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label
                    for=""
                    sm={2}
                  >
                </Label>
                <Col sm={3}>
                    <Input
                      id="HEALTH_LIGHT"
                      name="HEALTH_LIGHT"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="HEALTH_LIGHT"
                    >
                      Health Light
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="HEALTH_FAN"
                      name="HEALTH_FAN"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="HEALTH_FAN"
                    >
                      Health Fan
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="HEALTH_FLUSH"
                      name="HEALTH_FLUSH"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="HEALTH_FLUSH"
                    >
                      Health Flush
                  </Label> 
                </Col>
              </FormGroup>  
              <FormGroup row>
                <Label
                    for=""
                    sm={2}
                  >
                </Label>
                <Col sm={3}>
                    <Input
                      id="HEALTH_FLOOR_CLEAN"
                      name="HEALTH_FLOOR_CLEAN"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="HEALTH_FLOOR_CLEAN"
                    >
                      Health Floor Clean
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="AVERAGE_FEEDBACK"
                      name="AVERAGE_FEEDBACK"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="AVERAGE_FEEDBACK"
                    >
                      Average Feedback
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="TOTAL_USAGE"
                      name="TOTAL_USAGE"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="TOTAL_USAGE"
                    >
                      Total Usage
                  </Label> 
                </Col>
              </FormGroup>  
              <FormGroup row>
                <Label
                    for="Share Information"
                    sm={2}
                  >
                  <b style={{fontSize:"small"}}> Share Information </b>
                </Label>
                <Col sm={3}>
                    <Input
                      id="WATER_LEVEL"
                      name="WATER_LEVEL"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="WATER_LEVEL"
                    >
                      Water LEVEL
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="AQI_NH3"
                      name="AQI_NH3"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="AQI_NH3"
                    >
                      AQI_NH3
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="AQI_CO"
                      name="AQI_CO"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="AQI_CO"
                    >
                      AQI_CO
                  </Label> 
                </Col>
              </FormGroup>  
              <FormGroup row>
                <Label
                    for=""
                    sm={2}
                  >
                  
                </Label>
                <Col sm={3}>
                    <Input
                      id="AQI_CH4"
                      name="AQI_CH4"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="AQI_CH4"
                    >
                      AQI_CH4
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="LUMINOSITY"
                      name="LUMINOSITY"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="LUMINOSITY"
                    >
                      LUMINOSITY
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="DEVICE_THEFT"
                      name="DEVICE_THEFT"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="DEVICE_THEFT"
                    >
                      DEVICE THEFT
                  </Label> 
                </Col>
              </FormGroup>  
              <FormGroup row>
                <Label
                    for=""
                    sm={2}
                  >
                </Label>
                <Col sm={3}>
                    <Input
                      id="LATITUDE"
                      name="LATITUDE"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="LATITUDE"
                    >
                      LATITUDE
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="LONGITUDE"
                      name="LONGITUDE"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="LONGITUDE"
                    >
                      LONGITUDE
                  </Label> 
                </Col>
                <Col sm={3}>
                    <Input
                      id="TOTAL_WATER_RECYCLED"
                      name="TOTAL_WATER_RECYCLED"
                      type="checkbox"
                      onChange={handleChange}
                    />
                  <Label
                      check
                      for="TOTAL_WATER_RECYCLED"
                    >
                      TOTAL WATER RECYCLED
                  </Label> 
                </Col>
              </FormGroup>  
            </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleButtonClick}>
            Submit
          </Button>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ModalClient;
