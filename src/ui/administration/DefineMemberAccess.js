import React, { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import { whiteSurface } from "../../jsStyles/Style";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import {
  executeFetchCompletedUserAccessTree,
  executeDefineUserAccessLambda,
} from "../../awsClients/administrationLambdas";
import {
  getTrimmedAccessTree,
  getAccessKeys,
} from "../../components/accessTree/accessTreeUtils";
import StateList from "../../components/accessTree/defineAccess/SateList";
import NoDataComponent from "../../components/NoDataComponent";
import { getSelectionSummary } from "../../components/accessTree/accessTreeUtils";
// import { connect } from "react-redux";
// import { setOwnAccessTree } from "../../store/actions/authentication";
import { TreeItemType } from "../../nomenclature/nomenclature";
import RxAccessSummary from "../../components/RxAccessSummary";
import {
  selectUser,
  setAccessTree,
  authState,
} from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import ValidationMessageDialog from "../../dialogs/ValidationMessageDialog";
import { useNavigate } from "react-router-dom";

const MemberAccess = (props) => {
  const navigate = useNavigate();
  const [accessSummary, setAccessSummary] = useState([]);
  const [accessTree, setAccessTree] = useState(undefined);
  const messageDialog = useRef(null);
  const loadingDialog = useRef(null);
  const selectionSummary = useRef(null);
  const stateList = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);

  const initFetchCompletedUserAccessTreeAction = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeFetchCompletedUserAccessTree(
        user?.username,
        user?.credentials
      );
      console.log("define initFetchCompletedUserAccessTreeAction-->", result);
      setAccessTree(result);
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

  const handleSubmitAction = async () => {
    // console.log("_trimmedAccess", props.location.bundle);

    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const trimmedAccessTree = await getTrimmedAccessTree(accessTree);
      const accessKeys = await getAccessKeys(trimmedAccessTree);

      const defineAccessRequest = {
        // userName: user?.user.userName,
        // userRole: user?.user.userRole,
        accessTree: trimmedAccessTree,
        accessKeys: accessKeys,
      };
      console.log("_defineAccess", JSON.stringify(defineAccessRequest));
      const defineAccessResult = await executeDefineUserAccessLambda(
        defineAccessRequest,
        user?.credentials
      );
      console.log("_defineAccess", JSON.stringify(defineAccessResult));
      setDialogData({
        title: "Success",
        message: "User access tree updated",
        onClickAction: () => {
          navigate("/administration");
          // Handle the action when the user clicks OK
          console.log("DefineMemberAccess clicked to handleSubmitAction-->");
        },
      });
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

  const handleUserSelection = (nodeType, treeEdge, selected) => {
    const stateIndex = treeEdge.stateIndex;
    const districtIndex = treeEdge.districtIndex;
    const cityIndex = treeEdge.cityIndex;
    const complexIndex = treeEdge.complexIndex;
    console.log("checking handleUserSelection", nodeType);
    console.log("checking handleUserSelection1", treeEdge);
    console.log("checking handleUserSelection2", selected);
    console.log("checking", nodeType === TreeItemType.State);
    if (nodeType === TreeItemType.State) {
      console.log("checking state");
      setAccessTree((prevTree) => {
        const updatedTree = { ...prevTree };
        console.log("checking updatedTree", updatedTree);
        updatedTree.country.states[stateIndex].selected = selected;
        console.log(
          "checking updatedTree2",
          updatedTree.country.states[stateIndex]
        );
        return updatedTree;
      });
    } else if (nodeType === TreeItemType.District) {
      setAccessTree((prevTree) => {
        const updatedTree = { ...prevTree };
        updatedTree.country.states[stateIndex].districts[
          districtIndex
        ].selected = selected;
        return updatedTree;
      });
    } else if (nodeType === TreeItemType.City) {
      console.log("_itemExpansion", "City", treeEdge, selected);
      setAccessTree((prevTree) => {
        const updatedTree = { ...prevTree };
        updatedTree.country.states[stateIndex].districts[districtIndex].cities[
          cityIndex
        ].selected = selected;
        return updatedTree;
      });
    } else if (nodeType === TreeItemType.Complex) {
      setAccessTree((prevTree) => {
        const updatedTree = { ...prevTree };
        updatedTree.country.states[stateIndex].districts[districtIndex].cities[
          cityIndex
        ].complexes[complexIndex].selected = selected;
        return updatedTree;
      });
    }

    setAccessSummary(getSelectionSummary(accessTree));
    selectionSummary.current?.setAccessSummary(accessSummary);
    stateList.current?.updateData(accessTree);
  };

  useEffect(() => {
    if (props.accessTree === undefined)
      initFetchCompletedUserAccessTreeAction();
  }, [props.accessTree]);

  console.log("checked accesstree", accessTree);
  if (!accessTree) {
    return null;
  }

  const ComponentSelector = () => {
    if (accessTree === undefined) {
      return <NoDataComponent />;
    } else {
      if (accessTree === undefined) {
        setAccessTree(props.accessTree);
        console.log("_accessTree", accessTree);
      }

      return (
        <StateList
          ref={stateList}
          listData={accessTree}
          handleUserSelection={handleUserSelection}
        />
      );
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <ValidationMessageDialog data={dialogData} />

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
            onClick={handleSubmitAction}
          >
            Define Access
          </Button>

          <div className="col-md-2" style={{ float: "right" }}>
            <RxAccessSummary
              ref={selectionSummary}
              accessSummary={accessSummary}
            />
          </div>
        </div>

        <div className="col-md-8 offset-md-1" style={{ clear: "both" }}>
          <ComponentSelector />
        </div>
      </div>
    </>
  );
};

export default MemberAccess;
