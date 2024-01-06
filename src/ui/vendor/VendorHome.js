import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import List from "../../components/lists/vendorList/List";
import { setTeamList } from "../../features/vendorSlice";
import { selectUser } from "../../features/authenticationSlice";
// import { removeComponentProps } from "../../store/actions/history-actions";
import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import NoDataComponent from "../../components/NoDataComponent";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
import { executeReadVendorLambda } from "../../awsClients/vendorLambda";
import { useNavigate } from "react-router-dom";

const VendorHome = () => {
  const dispatch = useDispatch();
  const teamList = useSelector((state) => state.vendor.teamList);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const messageDialog = useRef();
  // const loadingDialog = useRef();

  const fetchAndInitTeam = async () => {
    // loadingDialog.current.showDialog();
    try {
      const result = await executeReadVendorLambda(
        user?.user?.userName,
        user?.credentials
      );
      console.log("result -:👉", result);
      console.log("vendor home data -:👉", result);
      dispatch(setTeamList({ teamList: result.teamDetails }));
      // loadingDialog.current.closeDialog();
    } catch (err) {
      // loadingDialog.current.closeDialog();
      // messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  useEffect(() => {
    // dispatch(removeComponentProps(UiAdminDestinations.MemberAccess));
    // dispatch(removeComponentProps(UiAdminDestinations.MemberDetails));
    fetchAndInitTeam();
  }, []);

  const Greeting = ({ teamList }) => {
    return teamList.length === 0 ? (
      <NoDataComponent />
    ) : (
      <List data={teamList} />
    );
  };

  const FooterComponent = ({ teamSize }) => {
    console.log("_footer-1", teamSize);
    return (
      <div className={"row"} style={{ margin: "0px", width: "100%" }}>
        <div
          className={"col-md-8"}
          style={{
            justifyContent: "right",
            alignItems: "right",
            float: "right",
          }}
        >
          <div className={"row-md-12"}>
            <b>Team Size: </b>
            <i>{teamSize}</i>
          </div>
        </div>
        {user.userRole === "Super Admin" && (
          <div
            className={"col-md-4"}
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <Button
              onClick={() => {
                // Assuming 'history' is provided through props or other means
                navigate("/vendor/addVendorMember");
              }}
              outline
              color="primary"
              className="px-4"
              style={{
                float: "right",
              }}
            >
              Add Vendor Member
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animated fadeIn" style={{ padding: "10px" }}>
      <MessageDialog ref={messageDialog} />
      {/* <LoadingDialog ref={loadingDialog} /> */}

      <Row>
        <Col xs="12" sm="12" lg="12">
          <Card>
            <CardHeader>
              <h1>Vendor Management</h1>
            </CardHeader>
            <CardBody>
              <FooterComponent teamSize={teamList?.length} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs="12" sm="12" lg="12">
          <Card>
            <CardBody>
              <Greeting teamList={teamList} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VendorHome;
