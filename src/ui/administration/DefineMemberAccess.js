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

const MemberAccess = (props) => {
  const [accessSummary, setAccessSummary] = useState([]);
  const [accessTree, setAccessTree] = useState(undefined);
  const messageDialog = useRef(null);
  const loadingDialog = useRef(null);
  const selectionSummary = useRef(null);
  const stateList = useRef(null);

  const initFetchCompletedUserAccessTreeAction = async () => {
    loadingDialog.current.showDialog();
    try {
      const result = await executeFetchCompletedUserAccessTree(props.userName);
      props.setOwnAccessTree(result);
      loadingDialog.current.closeDialog();
      console.log("_defineAccess", JSON.stringify(result));
    } catch (err) {
      console.log("_err", err);
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const handleSubmitAction = async () => {
    console.log("_trimmedAccess", props.location.bundle);

    loadingDialog.current.showDialog();
    try {
      const trimmedAccessTree = await getTrimmedAccessTree(accessTree);
      const accessKeys = await getAccessKeys(trimmedAccessTree);

      const user = props.location.bundle.user;
      const defineAccessRequest = {
        userName: user.userName,
        userRole: user.userRole,
        accessTree: trimmedAccessTree,
        accessKeys: accessKeys,
      };
      console.log("_defineAccess", JSON.stringify(defineAccessRequest));
      const defineAccessResult = await executeDefineUserAccessLambda(
        defineAccessRequest
      );
      console.log("_defineAccess", JSON.stringify(defineAccessResult));
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog(
        "Success",
        "User access tree updated",
        () => {
          props.history.goBack();
          props.history.goBack();
        }
      );
    } catch (err) {
      console.log("_err", err);
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const handleUserSelection = (nodeType, treeEdge, selected) => {
    const stateIndex = treeEdge.stateIndex;
    const districtIndex = treeEdge.districtIndex;
    const cityIndex = treeEdge.cityIndex;
    const complexIndex = treeEdge.complexIndex;

    if (nodeType === TreeItemType.State) {
      setAccessTree((prevTree) => {
        const updatedTree = { ...prevTree };
        updatedTree.country.states[stateIndex].selected = selected;
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
    selectionSummary.current.setAccessSummary(accessSummary);
    stateList.current.updateData(accessTree);
  };

  useEffect(() => {
    if (props.accessTree === undefined)
      initFetchCompletedUserAccessTreeAction();
  }, [props.accessTree]);

  const ComponentSelector = () => {
    if (props.accessTree === undefined) {
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
    <div
      className="col-md-10 offset-md-2"
      style={{ ...whiteSurface, width: "80%", margin: "auto" }}
    >
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}
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
  );
};

export default MemberAccess;
