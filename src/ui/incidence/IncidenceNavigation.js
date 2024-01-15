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
import NoDataComponent from "../../components/NoDataComponent";
import StateList from "../../components/accessTree/complexNavCompact/SateList";
import { selectUser, setAccessTree } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedComplex } from "../../features/complesStoreSlice";
import { startLoading, stopLoading } from "../../features/loadingSlice";

const IncidenceNavigation = () => {
  const dispatch = useDispatch();
  const selectionSummary = useRef();
  const stateList = useRef();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);

  useEffect(() => {
    if (user?.accessTree === undefined) {
      initFetchCompletedUserAccessTreeAction();
    }
  }, [user?.accessTree]);

  const handleComplexSelection = (treeEdge) => {
    var stateIndex = treeEdge.stateIndex;
    var districtIndex = treeEdge.districtIndex;
    var cityIndex = treeEdge.cityIndex;
    var complexIndex = treeEdge.complexIndex;

    var complex =
      user?.accessTree.country.states[stateIndex].districts[districtIndex]
        .cities[cityIndex].complexes[complexIndex];

    var hierarchy = getComplexHierarchy(user?.accessTree, treeEdge);
    dispatch(updateSelectedComplex({ complex: complex, hierarchy: hierarchy }));
  };

  const initFetchCompletedUserAccessTreeAction = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var result = await executeFetchCompletedUserAccessTree(
        user?.user?.userName,
        user?.credentials
      );
      dispatch(setAccessTree(result));
      dispatch(stopLoading()); // Dispatch the stopLoading action
    } catch (err) {
      console.log(err, "err");
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const ComponentSelector = () => {
    if (user?.accessTree == undefined) {
      return <NoDataComponent />;
    } else {
      return (
        <StateList
          ref={stateList}
          listData={user?.accessTree}
          // button={button}
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

export default IncidenceNavigation;
