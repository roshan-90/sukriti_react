import React, { useState, useEffect, useRef } from "react";
import { UserRoles } from "../../nomenclature/nomenclature";
import * as Styles from "../../jsStyles/Style";
import {
  colorTheme,
  whiteSurface3,
  statsStyle,
  complexCompositionStyle,
  whiteSurfaceCircularBorder,
} from "../../jsStyles/Style";
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const GrantPermissions = () => {
  const [selectedRole, setSelectedRole] = useState(UserRoles.Undefined);
  const uiDetails = useRef({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [dialogData, setDialogData] = useState(null);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const clientList = useSelector((state) => state.adminstration.clientList);
  const data = useSelector((state) => state.adminstration.data);

  useEffect(() => {
    fetchAndInitClientList();
  }, []);

  const initializeUiDetails = (data , clientData = null) => {
    uiDetails.current = {
      clientName: data?.CLIENT ?? clientData,
      collection_stats: data?.collection_stats ?? "false",
      methane: data?.methane ?? "false",
      ammonia: data?.ammonia ?? "false",
      luminous: data?.luminous ?? "false",
      usage_charge: data?.usage_charge ?? "false",
      carbon_monooxide: data?.carbon_monooxide ?? "false",
      air_dryer_health: data?.air_dryer_health ?? "false",
      choke_health: data?.choke_health ?? "false",
      tap_health: data?.tap_health ?? "false",
      usage_charge_profile: data?.usage_charge_profile ?? "false",
      air_dryer_profile: data?.air_dryer_profile ?? "false",
      rfid_profile: data?.rfid_profile ?? "false",
      alp: data?.alp ?? "false",
      mp1_valve: data?.mp1_valve ?? "false",
      mp2_valve: data?.mp2_valve ?? "false",
      mp3_valve: data?.mp3_valve ?? "false",
      mp4_valve: data?.mp4_valve ?? "false",
      turbidity_value: data?.turbidity_value ?? "false",
      total_usage: data?.total_usage ?? "false",
      average_feedback: data?.average_feedback ?? "false",
      water_saved: data?.water_saved ?? "false",
      bwt_stats: data?.bwt_stats ?? "false",
    };
    dispatch(setData({
      clientName: data?.CLIENT ?? clientData,
      collection_stats: data?.collection_stats ?? "false",
      methane: data?.methane ?? "false",
      ammonia: data?.ammonia ?? "false",
      luminous: data?.luminous ?? "false",
      usage_charge: data?.usage_charge ?? "false",
      carbon_monooxide: data?.carbon_monooxide ?? "false",
      air_dryer_health: data?.air_dryer_health ?? "false",
      choke_health: data?.choke_health ?? "false",
      tap_health: data?.tap_health ?? "false",
      usage_charge_profile: data?.usage_charge_profile ?? "false",
      air_dryer_profile: data?.air_dryer_profile ?? "false",
      rfid_profile: data?.rfid_profile ?? "false",
      alp: data?.alp ?? "false",
      mp1_valve: data?.mp1_valve ?? "false",
      mp2_valve: data?.mp2_valve ?? "false",
      mp3_valve: data?.mp3_valve ?? "false",
      mp4_valve: data?.mp4_valve ?? "false",
      turbidity_value: data?.turbidity_value ?? "false",
      total_usage: data?.total_usage ?? "false",
      average_feedback: data?.average_feedback ?? "false",
      water_saved: data?.water_saved ?? "false",
      bwt_stats: data?.bwt_stats ?? "false",
    }));
  };

  const handleError = (err, Custommessage, onclick = null) => {
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

  const fetchAndInitClientList = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executelistClientsLambda(user?.credentials);
      dispatch(setClientList(result.clientList));
      fetchClientWiseUI("SSF");
      dispatch(stopLoading()); // Dispatch the stopLoading action
    } catch (err) {
      handleError(err, "fetchAndInitClientList");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const fetchClientWiseUI = async (clientData) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeFetchUILambda(clientData, user?.credentials);
      initializeUiDetails(result.data, clientData);
    } catch (err) {
      handleError(err, "fetchClientWiseUI");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const initCreatePermissionRequest = async (createUserRequest) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const requestCopy = { ...createUserRequest };
      await executePermissionUiLambda(requestCopy, user?.credentials);
      dispatch(setResetData());
      setDialogData({
        title: "Success",
        message: "UI added successfully",
        onClickAction: () => {
          navigate("/administration");
          // Handle the action when the user clicks OK
        },
      });
    } catch (err) {
      handleError(err, "initCreatePermissionRequest");
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
                  <LockOutlinedIcon />
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
          <div className="col-md-4">
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
                <div
                  style={{ ...complexCompositionStyle.complexTitleClientMax }}
                >
                  {"Dashboard"}
                </div>
              </div>
            </div>
            <div
              style={{
                ...whiteSurface3,
                background: "white",
                padding: "10px 10px 10px 10px",
                height: "450px",
              }}
            >
              <Form>
                <div>
                  <p style={{ ...statsStyle.cardLabel }}>Total Indicator</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label class="switch">
                    Total Usage
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.total_usage = event.target.checked)
                      }
                      name="Total Usage"
                      defaultChecked={
                        data?.total_usage === "false"
                          ? false
                          : data?.total_usage
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    Average Feedback
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.average_feedback =
                          event.target.checked)
                      }
                      name="Average Feedback"
                      defaultChecked={
                        data?.average_feedback === "false"
                          ? false
                          : data?.average_feedback
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    Water Saved
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.water_saved = event.target.checked)
                      }
                      name="Water Saved"
                      defaultChecked={
                        data?.water_saved === "false"
                          ? false
                          : data?.water_saved
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
                <div>
                  <p style={{ ...statsStyle.cardLabel }}>Collection</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label class="switch">
                    Collection Stats
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.collection_stats =
                          event.target.checked)
                      }
                      name="Collection"
                      defaultChecked={
                        data?.collection_stats === "false"
                          ? false
                          : data?.collection_stats
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    Usage QuickConfig
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.usage_charge = event.target.checked)
                      }
                      name="usage_charge"
                      defaultChecked={
                        data?.usage_charge === "false"
                          ? false
                          : data?.usage_charge
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    Usage Profile
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.usage_charge_profile =
                          event.target.checked)
                      }
                      name="usage_charge_profile"
                      defaultChecked={
                        data?.usage_charge_profile === "false"
                          ? false
                          : data?.usage_charge_profile
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
                <div>
                  <p style={{ ...statsStyle.cardLabel }}>BWT</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label class="switch">
                    Re-Water Stats
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.bwt_stats = event.target.checked)
                      }
                      name="Collection"
                      defaultChecked={
                        data?.bwt_stats === "false" ? false : data?.bwt_stats
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              </Form>
            </div>
          </div>
          <div className="col-md-4">
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
                <div
                  style={{ ...complexCompositionStyle.complexTitleClientMax }}
                >
                  {"Complex"}
                </div>
              </div>
            </div>
            <div
              style={{
                ...whiteSurface3,
                background: "white",
                padding: "10px 10px 10px 10px",
                height: "450px",
              }}
            >
              <Form>
                <div>
                  <p style={{ ...statsStyle.cardLabel }}>Cabin Status</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label class="switch">
                    Carbon monooxide
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.carbon_monooxide =
                          event.target.checked)
                      }
                      name="Carbon monooxide"
                      defaultChecked={
                        data?.carbon_monooxide === "false"
                          ? false
                          : data?.carbon_monooxide
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    Methane
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.methane = event.target.checked)
                      }
                      name="Methane"
                      defaultChecked={
                        data?.methane === "false" ? false : data?.methane
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    Ammonia
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.ammonia = event.target.checked)
                      }
                      name="Ammonia"
                      defaultChecked={
                        data?.ammonia === "false" ? false : data?.ammonia
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    Luminous
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.luminous = event.target.checked)
                      }
                      name="Luminous"
                      defaultChecked={
                        data?.luminous === "false" ? false : data?.luminous
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
                <div>
                  <p style={{ ...statsStyle.cardLabel }}>Cabin Health</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label class="switch">
                    Air Dryer
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.air_dryer_health =
                          event.target.checked)
                      }
                      name="Air Dryer"
                      defaultChecked={
                        data?.air_dryer_health === "false"
                          ? false
                          : data?.air_dryer_health
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    Choke
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.choke_health = event.target.checked)
                      }
                      name="Choke"
                      defaultChecked={
                        data?.choke_health === "false"
                          ? false
                          : data?.choke_health
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    Tap
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.tap_health = event.target.checked)
                      }
                      name="Tap"
                      defaultChecked={
                        data?.tap_health === "false" ? false : data?.tap_health
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
                <div>
                  <p style={{ ...statsStyle.cardLabel }}>Usage Profile</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* <label class="switch">Usage Charges
                        <input
                          type="checkbox"
                          onClick={(event) =>
                            (uiDetails.usage_charge_profile = event.target.checked)
                          }
                          name="Usage Charges"
  
                          defaultChecked={uiDetails.collection_stats}
                        />
                        <span class="slider round"></span>
                      </label> */}
                  <label class="switch">
                    Air Dryer
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.air_dryer_profile =
                          event.target.checked)
                      }
                      name="Air Dryer"
                      defaultChecked={
                        data?.air_dryer_profile === "false"
                          ? false
                          : data?.air_dryer_profile
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    RFID
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.rfid_profile = event.target.checked)
                      }
                      name="RFID"
                      defaultChecked={
                        data?.rfid_profile === "false"
                          ? false
                          : data?.rfid_profile
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              </Form>
            </div>
          </div>
          <div className="col-md-4">
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
                <div
                  style={{ ...complexCompositionStyle.complexTitleClientMax }}
                >
                  {"BWT"}
                </div>
              </div>
            </div>
            <div
              style={{
                ...whiteSurface3,
                background: "white",
                padding: "10px 10px 10px 10px",
                height: "450px",
              }}
            >
              <Form>
                <div>
                  <p style={{ ...statsStyle.cardLabel }}>System Health</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label class="switch">
                    ALP
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.alp = event.target.checked)
                      }
                      name="ALP"
                      defaultChecked={data?.alp === "false" ? false : data?.alp}
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    MP1 Valve
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.mp1_valve = event.target.checked)
                      }
                      name="MP1 Valve"
                      defaultChecked={
                        data?.mp1_valve === "false" ? false : data?.mp1_valve
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    MP2 Valve
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.mp2_valve = event.target.checked)
                      }
                      name="MP2 Valve"
                      defaultChecked={
                        data?.mp2_valve === "false" ? false : data?.mp2_valve
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    MP3 Valve
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.mp3_valve = event.target.checked)
                      }
                      name="MP2 Valve"
                      defaultChecked={
                        data?.mp3_valve === "false" ? false : data?.mp3_valve
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                  <label class="switch">
                    MP4 Valve
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.mp4_valve = event.target.checked)
                      }
                      name="MP2 Valve"
                      defaultChecked={
                        data?.mp4_valve === "false" ? false : data?.mp4_valve
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
                <div>
                  <p style={{ ...statsStyle.cardLabel }}>Usage</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label class="switch">
                    Turbidity Value
                    <input
                      type="checkbox"
                      onClick={(event) =>
                        (uiDetails.current.turbidity_value =
                          event.target.checked)
                      }
                      name="Turbidity Value"
                      defaultChecked={
                        data?.turbidity_value === "false"
                          ? false
                          : data?.turbidity_value
                      }
                    />
                    <span class="slider round"></span>
                  </label>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Container>
        <div
          className={"row justiy-content-center"}
          style={{ width: "20%", padding: "20px", margin: "auto" }}
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
