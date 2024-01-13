import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { executeFetchCompletedUserAccessTree } from "../../awsClients/administrationLambdas";
import {
  colorTheme,
  whiteSurfaceCircularBorder,
  complexCompositionStyle,
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import {
  getAccessSummary,
  getComplexHierarchy,
} from "../../components/accessTree/accessTreeUtils";
// import { setOwnAccessTree } from "../../store/actions/authentication";
// import { updateSelectedComplex } from "../../store/actions/complex-actions";
import NoDataComponent from "../../components/NoDataComponent";
import StateList from "../../components/accessTree/complexNavCompact/SateList";

const IncidenceNavigation = ({
  user,
  accessTree,
  credentials,
  setOwnAccessTree,
  updateSelectedComplex,
  button,
}) => {
  const selectionSummary = useRef();
  const stateList = useRef();

  useEffect(() => {
    if (accessTree === undefined) {
      initFetchCompletedUserAccessTreeAction();
    }
  }, [accessTree]);

  const handleComplexSelection = (treeEdge) => {
    var stateIndex = treeEdge.stateIndex;
    var districtIndex = treeEdge.districtIndex;
    var cityIndex = treeEdge.cityIndex;
    var complexIndex = treeEdge.complexIndex;

    var complex =
      accessTree.country.states[stateIndex].districts[districtIndex].cities[
        cityIndex
      ].complexes[complexIndex];

    var hierarchy = getComplexHierarchy(accessTree, treeEdge);
    updateSelectedComplex(complex, hierarchy);
  };

  const initFetchCompletedUserAccessTreeAction = async () => {
    try {
      var result = await executeFetchCompletedUserAccessTree(
        user.userName,
        credentials
      );
      setOwnAccessTree(result);
    } catch (err) {
      console.log(err, "err");
    }
  };

  const ComponentSelector = () => {
    if (accessTree == undefined) {
      return <NoDataComponent />;
    } else {
      return (
        <StateList
          ref={stateList}
          listData={accessTree}
          button={button}
          handleComplexSelection={handleComplexSelection}
        />
      );
    }
  };

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
            alt=""
            src={icToilet}
            style={{ widht: "30px", height: "30px", borderRadius: "5%" }}
          />
        </div>
        <div style={{ float: "left", marginLeft: "10px" }}>
          <div style={{ ...complexCompositionStyle.complexTitleClient }}>
            {"User Access Tree"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="row" style={{ background: "white", padding: "5px" }}>
      <Header />
      <ComponentSelector />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.authentication.user,
    accessTree: state.authentication.accessTree,
    accessSummary: getAccessSummary(state.authentication.accessTree),
    credentials: state.authentication.credentials,
  };
};

// const mapActionsToProps = {
//   setOwnAccessTree,
//   updateSelectedComplex,
// };

export default IncidenceNavigation;
