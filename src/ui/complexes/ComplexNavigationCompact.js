import React, { useEffect, useRef } from "react";
// import { connect } from "react-redux";
// import { setOwnAccessTree } from "../../store/actions/authentication";
// import { updateSelectedComplex } from "../../store/actions/complex-actions";
import {
  colorTheme,
  whiteSurfaceCircularBorder,
  complexCompositionStyle,
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import StateList from "../../components/accessTree/complexNavCompact/SateList";
import NoDataComponent from "../../components/NoDataComponent";
import { executeFetchCompletedUserAccessTree } from "../../awsClients/administrationLambdas";
import {
  getAccessSummary,
  getComplexHierarchy,
} from "../../components/accessTree/accessTreeUtils";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessTree,
  selectUser,
  authState,
} from "../../features/authenticationSlice";
import { updateSelectedComplex } from "../../features/complesStoreSlice";

const ComplexNavigationCompact = (props) => {
  //   const messageDialog = useRef();
  //   const loadingDialog = useRef();
  const selectionSummary = useRef();
  const stateList = useRef();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const authStated = useSelector(authState);

  const initFetchCompletedUserAccessTreeAction = async () => {
    try {
      const result = await executeFetchCompletedUserAccessTree(
        user?.username,
        user?.credentials
      );
      console.log("complexNavigationCompact-->", result);
      dispatch(setAccessTree(result));
    } catch (err) {
      console.log("_defineAccess", "_err", err);
    }
  };

  console.log("auth state ---", authStated?.accessTree);
  if (authStated?.accessTree == undefined) {
    initFetchCompletedUserAccessTreeAction();
  }

  // useEffect(() => {
  //   if (!authStated?.accessTree) {
  //     initFetchCompletedUserAccessTreeAction();
  //   }
  //   console.log("complexNavigationcompact--2");
  // }, []);

  const handleComplexSelection = (treeEdge) => {
    const stateIndex = treeEdge.stateIndex;
    const districtIndex = treeEdge.districtIndex;
    const cityIndex = treeEdge.cityIndex;
    const complexIndex = treeEdge.complexIndex;

    const complex =
      authStated?.accessTree.country.states[stateIndex].districts[districtIndex]
        .cities[cityIndex].complexes[complexIndex];

    const hierarchy = getComplexHierarchy(authStated?.accessTree, treeEdge);
    dispatch(updateSelectedComplex(complex, hierarchy));
  };

  const ComponentSelector = () => {
    if (authStated?.accessTree == undefined) {
      return <NoDataComponent />;
    } else {
      return (
        <StateList
          ref={stateList}
          listData={authStated?.accessTree}
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

export default ComplexNavigationCompact;
