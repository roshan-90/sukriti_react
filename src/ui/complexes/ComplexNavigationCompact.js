import React, { useState, useEffect, useRef, useMemo } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import './ComplexNavigationCompact.css';

const ComplexNavigationCompact = (props) => {
  const selectionSummary = useRef();
  const stateList = useRef();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const authStated = useSelector(authState);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);

  const initFetchCompletedUserAccessTreeAction = async () => {
    // dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeFetchCompletedUserAccessTree(
        user?.username,
        user?.credentials
      );
      console.log("complexNavigationCompact-->", result);
      dispatch(setAccessTree(result));
    } catch (err) {
      let text = err.message ? err.message.includes("expired") : null;
      if (text) {
        setDialogData({
          title: "Error",
          message: `${err.message} Please Login again`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("initFetchCompletedUserAccessTreeAction Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("initFetchCompletedUserAccessTreeAction Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  console.log("auth state ---", authStated?.accessTree);

  useEffect(() => {
    dispatch(startLoading()); // Dispatch the startLoading action
    // if (authStated?.accessTree == undefined) {
    initFetchCompletedUserAccessTreeAction();
    // }
  }, []);

  const handleComplexSelection = (treeEdge) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    console.log("complexNavigationcompact treeEdge --> ", treeEdge);
    const stateIndex = treeEdge.stateIndex;
    const districtIndex = treeEdge.districtIndex;
    const cityIndex = treeEdge.cityIndex;
    const complexIndex = treeEdge.complexIndex;

    const complex =
      authStated?.accessTree.country.states[stateIndex].districts[districtIndex]
        .cities[cityIndex].complexes[complexIndex];
    console.log("complexNavigationcompact complex --> 22 ", complex);
    const hierarchy = getComplexHierarchy(authStated?.accessTree, treeEdge);
    console.log("complexNavigationcompact hierarchy --> 22 ", hierarchy);
    dispatch(updateSelectedComplex({ complex: complex, hierarchy: hierarchy }));
  };

  const ComponentSelector = () => {
    console.log("new hello");
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

  const memoizedTreeComponent = useMemo(() => {
    return <ComponentSelector />;
  }, [authStated?.accessTree]);

  return (
    <>
      {" "}
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <MessageDialog data={dialogData} />
      <div className="row complex-navigationCompactTree" style={{ background: "white", padding: "5px"}}>
        <Header />
        {memoizedTreeComponent}
      </div>
    </>
  );
};

export default ComplexNavigationCompact;
