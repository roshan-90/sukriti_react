import React, { useState, useEffect, useRef } from "react";
// import { connect } from "react-redux";
import { UserRoles } from "../../nomenclature/nomenclature";
import * as Styles from "../../jsStyles/Style";
import {
  colorTheme,
  whiteSurface3,
  statsStyle,
  complexCompositionStyle,
  whiteSurfaceCircularBorder,
} from "../../jsStyles/Style";
// import {
//   addTeamMember,
//   setClientList,
//   setUiList,
//   setUiReset,
// } from "../../store/actions/administration-actions";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import {
  executelistClientsLambda,
  executePermissionUiLambda,
  executeFetchUILambda,
} from "../../awsClients/administrationLambdas";
import {
  Button,
  Container,
  Form,
  InputGroup,
  Input,
  InputGroupText,
} from "reactstrap";
import "./GrantPermissions.css";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import ValidationMessageDialog from "../../dialogs/MessageDialog";
import { useNavigate } from "react-router-dom";
import {
  setClientList,
  setData,
  setResetData,
} from "../../features/adminstrationSlice";

const GrantPermissions = () => {
  const [selectedRole, setSelectedRole] = useState(UserRoles.Undefined);
  const uiDetails = useRef({});
  const selectedClient = useRef({});
  const messageDialog = useRef(null);
  const loadingDialog = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [dialogData, setDialogData] = useState(null);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const clientList = useSelector((state) => state.adminstration.clientList);

  useEffect(() => {
    fetchAndInitClientList();
    setTimeout(() => {
      initializeUiDetails();
    }, 5000);
  }, []);

  const initializeUiDetails = () => {
    // uiDetails.current = {
    //   clientName: "",
    //   collection_stats: data.collection_stats,
    //   methane: data.methane,
    //   ammonia: data.ammonia,
    //   luminous: data.luminous,
    //   usage_charge: data.usage_charge,
    //   carbon_monooxide: data.carbon_monooxide,
    //   air_dryer_health: data.air_dryer_health,
    //   choke_health: data.choke_health,
    //   tap_health: data.tap_health,
    //   usage_charge_profile: data.usage_charge_profile,
    //   air_dryer_profile: data.air_dryer_profile,
    //   rfid_profile: data.rfid_profile,
    //   alp: data.alp,
    //   mp1_valve: data.mp1_valve,
    //   mp2_valve: data.mp2_valve,
    //   mp3_valve: data.mp3_valve,
    //   mp4_valve: data.mp4_valve,
    //   turbidity_value: data.turbidity_value,
    //   total_usage: data.total_usage,
    //   average_feedback: data.average_feedback,
    //   water_saved: data.water_saved,
    //   bwt_stats: data.bwt_stats,
    // };
  };

  const fetchAndInitClientList = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executelistClientsLambda();
      dispatch(setClientList(result.clientList));
      fetchClientWiseUI("SSF");
      dispatch(stopLoading()); // Dispatch the stopLoading action
    } catch (err) {
      let text = err.message.includes("expired");
      if (text) {
        setDialogData({
          title: "Error",
          message: err.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(
              "AddVendorMemeber fetchAndInitClientList Error:->",
              err
            );
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error(" AddVendorMember fetchAndInitClientList Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const fetchClientWiseUI = async (clientData) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeFetchUILambda(clientData);
      dispatch(setData(result.data));
    } catch (err) {
      let text = err.message.includes("expired");
      if (text) {
        setDialogData({
          title: "Error",
          message: err.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("GrantPermission fetchClientWiseUI Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error(" GrantPermission fetchClientWiseUI Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const initCreatePermissionRequest = async (createUserRequest) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const requestCopy = { ...createUserRequest };
      await executePermissionUiLambda(requestCopy);
      dispatch(setResetData());
      setDialogData({
        title: "Success",
        message: "UI added successfully",
        onClickAction: () => {
          navigate("/administration");
          // Handle the action when the user clicks OK
          console.error(" AddTeamMember initCreateVendorRequest");
        },
      });
    } catch (err) {
      let text = err.message.includes("expired");
      if (text) {
        setDialogData({
          title: "Error",
          message: err.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(
              "GrantPermission initCreatePermissionRequest Error:->",
              err
            );
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error(
              " GrantPermission initCreatePermissionRequest Error",
              err
            );
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const onClientSelected = (event) => {
    uiDetails.current.clientName = event.target.value;
    fetchClientWiseUI(event.target.value);
  };

  const onSubmit = () => {
    initCreatePermissionRequest(uiDetails.current);
  };

  return (
    <div>
      <div className="animated fadeIn" style={{ padding: "10px" }}>
        {isLoading && (
          <div className="loader-container">
            <CircularProgress
              className="loader"
              style={{ color: "rgb(93 192 166)" }}
            />
          </div>
        )}
        <ValidationMessageDialog data={dialogData} />
        <div className="col-md-13">
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              background: colorTheme.primary,
              padding: "10px",
              marginTop: "20px",
            }}
          >
            <div style={{ float: "left", marginLeft: "10px" }}>
              <div style={{ ...complexCompositionStyle.complexTitleClientMax }}>
                {"UI CUSTOMIZATION"}
              </div>
            </div>
          </div>
          <div
            style={{
              ...whiteSurface3,
              background: "white",
              padding: "10px 10px 10px 10px",
            }}
          >
            <Form>
              <p style={Styles.formLabel}>Client Selection</p>
              <InputGroup className="mb-4">
                <InputGroupText>
                  <i className="icon-lock"></i>
                </InputGroupText>
                <Input
                  type="select"
                  onChange={(event) => onClientSelected(event)}
                >
                  <option disabled selected hidden>
                    Select Client
                  </option>
                  {clientList !== undefined &&
                    clientList.map((data, index) => {
                      return <option value={data.name}>{data.name}</option>;
                    })}
                </Input>
              </InputGroup>
            </Form>
          </div>
        </div>
        <div className="row">
          {/* Rest of your component content */}
          {/* ... */}
        </div>
      </div>
      <Container>
        <div
          className={"row justiy-content-center"}
          style={{ width: "100%", padding: "20px" }}
        >
          <Button
            style={{ margin: "auto" }}
            color="primary"
            className="px-5"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default GrantPermissions;
