import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setAccessTree } from "../../features/authenticationSlice";
import { updateSelectedComplex } from "../../features/complesStoreSlice";
import {
  colorTheme,
  whiteSurfaceCircularBorder,
  complexCompositionStyle,
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import StateList from "../../components/accessTree/complexNavCompact/SateList";
import NoDataComponent from "../../components/NoDataComponent";
//Functionality
import { executeFetchCompletedUserAccessTree } from "../../awsClients/administrationLambdas";
import {
  getAccessSummary,
  getComplexHierarchy,
} from "../../components/accessTree/accessTreeUtils";

const ComplexNavigationFullHeight = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // const messageDialog = useRef();
  // const loadingDialog = useRef();
  const stateList = useRef();

  const initFetchCompletedUserAccessTreeAction = async () => {
    try {
      const result = await executeFetchCompletedUserAccessTree(
        user?.user.userName,
        user?.credentials
      );
      dispatch(setAccessTree(result));
      console.log("_defineAccess", result);
    } catch (err) {
      console.log("_defineAccess", "_err", err);
    }
  };

  useEffect(() => {
    console.log("_defineAccess", "componentDidMount()");
    if (user?.accessTree === undefined) {
      initFetchCompletedUserAccessTreeAction();
    }
  }, [user?.accessTree]);

  const handleComplexSelection = (treeEdge) => {
    console.log("complexnavigationfullheight -->clicke");
    console.log("_handleComplexSelection", treeEdge);
    const stateIndex = treeEdge.stateIndex;
    const districtIndex = treeEdge.districtIndex;
    const cityIndex = treeEdge.cityIndex;
    const complexIndex = treeEdge.complexIndex;
    const complex =
      user?.accessTree.country.states[stateIndex].districts[districtIndex]
        .cities[cityIndex].complexes[complexIndex];
    const hierarchy = getComplexHierarchy(user?.accessTree, treeEdge);
    // dispatch(updateSelectedComplex({ complex: complex, hierarchy: hierarchy }));
    console.log("checking value complexNavigationfullheight", complex);
    props.setComplexSelection(complex);
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
            alt={icToilet}
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

  const ComponentSelector = () => {
    if (user?.accessTree === undefined) {
      return <NoDataComponent />;
    } else {
      return (
        <StateList
          ref={stateList}
          listData={user?.accessTree}
          handleComplexSelection={handleComplexSelection}
        />
      );
    }
  };

  return (
    <div style={{ background: "white", width: "100%", padding: "5px" }}>
      <Header />
      <ComponentSelector />
    </div>
  );
};

export default ComplexNavigationFullHeight;
