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

const GrantPermissions = ({
  setClientList,
  setUiList,
  setUiReset,
  clientList,
  data,
  history,
}) => {
  const [selectedRole, setSelectedRole] = useState(UserRoles.Undefined);
  const uiDetails = useRef({});
  const selectedClient = useRef({});
  const messageDialog = useRef(null);
  const loadingDialog = useRef(null);

  useEffect(() => {
    fetchAndInitClientList();
    setTimeout(() => {
      initializeUiDetails();
    }, 5000);
  }, []);

  const initializeUiDetails = () => {
    uiDetails.current = {
      clientName: "",
      collection_stats: data.collection_stats,
      methane: data.methane,
      ammonia: data.ammonia,
      luminous: data.luminous,
      usage_charge: data.usage_charge,
      carbon_monooxide: data.carbon_monooxide,
      air_dryer_health: data.air_dryer_health,
      choke_health: data.choke_health,
      tap_health: data.tap_health,
      usage_charge_profile: data.usage_charge_profile,
      air_dryer_profile: data.air_dryer_profile,
      rfid_profile: data.rfid_profile,
      alp: data.alp,
      mp1_valve: data.mp1_valve,
      mp2_valve: data.mp2_valve,
      mp3_valve: data.mp3_valve,
      mp4_valve: data.mp4_valve,
      turbidity_value: data.turbidity_value,
      total_usage: data.total_usage,
      average_feedback: data.average_feedback,
      water_saved: data.water_saved,
      bwt_stats: data.bwt_stats,
    };
  };

  const fetchAndInitClientList = async () => {
    loadingDialog.current.showDialog();
    try {
      const result = await executelistClientsLambda();
      setClientList(result.clientList);
      fetchClientWiseUI("SSF");
      loadingDialog.current.closeDialog();
    } catch (err) {
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const fetchClientWiseUI = async (clientData) => {
    loadingDialog.current.showDialog();
    try {
      const result = await executeFetchUILambda(clientData);
      setUiList(result.data);
      loadingDialog.current.closeDialog();
    } catch (err) {
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const initCreatePermissionRequest = async (createUserRequest) => {
    loadingDialog.current.showDialog();
    try {
      const requestCopy = { ...createUserRequest };
      await executePermissionUiLambda(requestCopy);
      setUiReset();
      messageDialog.current.showDialog(
        "Success",
        "UI added successfully",
        () => {
          history.goBack();
        }
      );
      loadingDialog.current.closeDialog();
    } catch (err) {
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
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
