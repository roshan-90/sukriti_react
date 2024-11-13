import React, { useRef } from "react";
import { whiteSurface } from "../../jsStyles/Style";
import { Button } from "reactstrap";
import { executeDisableUserLambda } from "../../awsClients/administrationLambdas";
import StateList from "../../components/accessTree/complexNavCompact/SateList";
import NoDataComponent from "../../components/NoDataComponent";
import { getAccessSummary } from "../../components/accessTree/accessTreeUtils";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const MemberAccess = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  let accessTree = useSelector((state) => state.authentication.accessTree);
  const accessSummary = useRef(getAccessSummary(props.user?.permissions));
  const user = useSelector(selectUser);
  const stateList = useRef();

  const initAdminDisableAction = async () => {
    try {
      await executeDisableUserLambda(user?.username);
    } catch (err) {
    }
  };
  const handleComplexSelection = (treeEdge) => {
    console.log("handlecomplexSelection data");
  };

  const handleDefineAccessAction = () => {
    navigate(`/administration/defineAccess/${id}`);
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
      <div>
        <Button
          style={{ float: "left", margin: "10px" }}
          outline
          color="primary"
          className="px-4"
          onClick={handleDefineAccessAction}
        >
          Define Access
        </Button>
      </div>

      <div className="col-md-8 offset-md-1" style={{ clear: "both" }}>
        <ComponentSelector />
      </div>
    </div>
  );
};

export default MemberAccess;
