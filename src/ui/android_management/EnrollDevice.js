import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setClientList } from "../../features/adminstrationSlice";
import {
  executelistIotSingleLambda,
  executelistIotDynamicLambda
} from "../../awsClients/androidEnterpriseLambda";
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
import Client from "../../Entity/User/Client";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import ValidationMessageDialog from "../../dialogs/MessageDialog";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Select from 'react-select'; // Importing react-select


const EnrollDevice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const clientList = useSelector((state) => state.adminstration.clientList);
  const [dialogData, setDialogData] = useState(null);
    
  const [selectedOption, setSelectedOption] = useState(null); // State for react-select
  const [listIotState, setListIotState] = useState(null);
  const [selectedOptionIotDistrict, setSelectedOptionIotDistrict] = useState(null); // State for react-select
  const [listIotDistrict, setListIotDistrict] = useState(null);
  const [selectedOptionIotCity, setSelectedOptionIotCity] = useState(null); // State for react-select
  const [listIotCity, setListIotCity] = useState(null);
  const [selectedOptionIotComplex, setSelectedOptionIotComplex] = useState(null); // State for react-select
  const [listIotComplex, setListIotComplex] = useState(null);

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
      setListIotState(options);
    } catch (error) {
      handleError(error, 'Error ListOfIotState')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotDistrict = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-district";
      var result = await executelistIotDynamicLambda('test_rk_mandi', user?.credentials, value,command);
      console.log('result',result);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item.CODE,
        label: item.NAME
      }));
      setListIotDistrict(options);
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
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item.CODE,
        label: item.NAME
      }));
      setListIotCity(options);
    } catch (error) {
      handleError(error, 'Error ListOfIotCity')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotComplex = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-complex";
      var result = await executelistIotDynamicLambda('test_rk_mandi', user?.credentials, value, command);
      console.log('result',result);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item.Name,
        label: item.Name
      }));
      setListIotComplex(options);
    } catch (error) {
      handleError(error, 'Error ListOfIotComplex')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }
  
  // Handle change in react-select 
  const handleChangeIotState = (selectedOption) => {
    console.log('check', selectedOption.value);
    setListIotDistrict(null);
    setSelectedOptionIotDistrict(null)
    setListIotCity(null);
    setSelectedOptionIotCity(null);
    setListIotComplex(null);
    setSelectedOptionIotComplex(null)
    setSelectedOption(selectedOption); // Update state if selectedOption is not null
    ListOfIotDistrict(selectedOption.value)
  };

  const handleChangeIotDistrict = (selectedOption) => {
    setListIotCity(null)
    setSelectedOptionIotCity(null)
    setListIotComplex(null)
    setSelectedOptionIotComplex(null)
    console.log('handleChangeIotDistrict',selectedOption);
    setSelectedOptionIotDistrict(selectedOption);
    ListOfIotCity(selectedOption.value)
  }

  const handleChangeIotCity = (selectedOption) => {
    setListIotComplex(null)
    setSelectedOptionIotComplex(null)
    console.log('handleChangeIotCity',selectedOption);
    setSelectedOptionIotCity(selectedOption);
    ListOfIotComplex(selectedOption.value)
  }
  const handleChangeIotComplex = (selectedOption) => {
    console.log('handleChangeIotComplex',selectedOption);
    setSelectedOptionIotComplex(selectedOption);
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
      <ValidationMessageDialog data={dialogData} />
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <Card className="p-4">
              <CardBody>
              <Select options={listIotState || []} value={selectedOption} onChange={handleChangeIotState}         
                  onMenuOpen={() => {
                    if (!listIotState || listIotState.length === 0) {
                      ListOfIotState();
                    }
                  }} placeholder="Select State" />
                  <br />
                  <Select options={listIotDistrict || []} value={selectedOptionIotDistrict} onChange={handleChangeIotDistrict} placeholder="Select District" />
                  <br />
                  <Select options={listIotCity || []} value={selectedOptionIotCity} onChange={handleChangeIotCity} placeholder="Select City" />
                  <br />
                  <Select options={listIotComplex || []} value={selectedOptionIotComplex} onChange={handleChangeIotComplex} placeholder="Select Complex"/>
               
              </CardBody>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default EnrollDevice;
