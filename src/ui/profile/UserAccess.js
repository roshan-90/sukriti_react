import React, { useRef } from "react";
import { whiteSurface } from "../../jsStyles/Style";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import { Button } from "reactstrap";
import { NameValueList } from "../../components/DisplayLabels";
import { executeDisableUserLambda } from "../../awsClients/administrationLambdas";
import StateList from "../../components/accessTree/complexNavCompact/SateList";
import NoDataComponent from "../../components/NoDataComponent";
import { getAccessSummary } from "../../components/accessTree/accessTreeUtils";
// import { pushComponentProps } from "../../store/actions/history-actions";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const MemberAccess = (props) => {
  let accessTree = useSelector((state) => state.authentication.accessTree);
  console.log("checked memeber access", props);
  const accessSummary = useRef(getAccessSummary(props.user?.permissions));
  console.log("checked memeber accessSummary", accessSummary);
  const user = useSelector(selectUser);
  console.log("checking for user data", user);
  const stateList = useRef();

  //   const messageDialog = useRef();
  //   const loadingDialog = useRef();
  console.log("member access tree", accessTree);
 
  const handleComplexSelection = (treeEdge) => {
    console.log("handlecomplexSelection data");
  };

  const ComponentSelector = () => {
    if (props.user !== undefined) {
      return (
        <StateList
          ref={stateList}
          listData={accessTree}
          handleComplexSelection={handleComplexSelection}
        />
      );
      // }
    } else {
      return <NoDataComponent />;
    }
  };

  const SuperAdminAcceess = () => {
    return (
      <div
        className="col-md-8 offset-md-1"
        style={{ clear: "both", width: "50%", margin: "auto" }}
      >
        SUPER ADMIN ACCESS
      </div>
    );
  };

  return (
    <div
      className="col-md-10 offset-md-2"
      style={{ ...whiteSurface, width: "80%", margin: "auto" }}
    >
      <div className="col-md-8 offset-md-1" style={{ clear: "both" }}>
        <ComponentSelector />
      </div>
    </div>
  );
};

export default MemberAccess;
