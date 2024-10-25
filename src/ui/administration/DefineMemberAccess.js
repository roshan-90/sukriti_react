import React, { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "reactstrap";
import { whiteSurface } from "../../jsStyles/Style";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import {
  executeFetchCompletedUserAccessTree,
  executeDefineUserAccessLambda,
  executelistTeamLambda,
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
import { useParams } from "react-router-dom";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import { setTeamList } from "../../features/adminstrationSlice";

const MemberAccess = (props) => {
  const { id } = useParams();
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
  let data = useSelector((state) => state.adminstration.teamList);
  const confirmationDialog = useRef();
  const [accessCopyTree, setAccessCopyTree] = useState(undefined);
  const accessTreeRef = useRef(); // Store the accessTree in a ref

  const handleError = (err, Custommessage, onclick = null) => {
    console.log("error -->", err);
    let text = err.message.includes("expired");
    if (text) {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    } else {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    }
  };

  const fetchAndInitTeam = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var result = await executelistTeamLambda(
        user?.username,
        user?.credentials
      );
      console.log("result--->", result);
      dispatch(setTeamList(result.teamDetails));
    } catch (err) {
      handleError(err, "fetchAndInitTeam");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const initFetchCompletedUserAccessTreeAction = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeFetchCompletedUserAccessTree(
        user?.username,
        user?.credentials
      );
      console.log("define initFetchCompletedUserAccessTreeAction-->", result);
      accessTreeRef.current = result
      setAccessCopyTree(result)
      setAccessTree(result);
      localStorage.setItem('hasTreeValue',1)
    } catch (err) {
      handleError(err, "initFetchCompletedUserAccessTreeAction");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const removeAllExpandedKeys = (node) => {
    // Remove expanded key at the current node level, if it exists
    if (node.expanded !== undefined) {
      delete node.expanded;
    }
  
    // Recursively remove expanded key in child nodes if they exist
    if (node.states) {
      node.states.forEach(state => removeAllExpandedKeys(state));
    }
    if (node.districts) {
      node.districts.forEach(district => removeAllExpandedKeys(district));
    }
    if (node.cities) {
      node.cities.forEach(city => removeAllExpandedKeys(city));
    }
    if (node.complexes) {
      node.complexes.forEach(complex => removeAllExpandedKeys(complex));
    }
  };

  const handleSubmitAction = async () => {
    console.log("define meeber cliced", data);
    // console.log("_trimmedAccess", props.location.bundle);
    let [user_data] = data.filter((data) => data.userName == id);
    console.log("checking handlesubmitaction", user_data);
    console.log(user_data.length);
    if (user_data.length == 0) {
      return null;
    }
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      // const trimmedAccessTree = await getTrimmedAccessTree(accessTree);

      const trimmedAccessTree = await getTrimmedAccessTree(accessTreeRef.current);
      const accessKeys = await getAccessKeys(trimmedAccessTree);

      const defineAccessRequest = {
        userName: user_data?.userName,
        userRole: user_data?.userRole,
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
      handleError(err, "handleSubmitAction");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const onSubmit = () => {
    removeAllExpandedKeys(accessTreeRef.current.country); // Remove all expanded keys in the tree

    confirmationDialog.current.showDialog(
      "Confirm Action",
      "To update the user permanently, type 'UPDATE' below",
      "UPDATE",
      handleSubmitAction
    );
  };

  // const handleUserSelection = (nodeType, treeEdge, selected) => {
  //   const stateIndex = treeEdge.stateIndex;
  //   const districtIndex = treeEdge.districtIndex;
  //   const cityIndex = treeEdge.cityIndex;
  //   const complexIndex = treeEdge.complexIndex;
  //   console.log("checking handleUserSelection", nodeType);
  //   console.log("checking handleUserSelection1", treeEdge);
  //   console.log("checking handleUserSelection2", selected);
  //   console.log("checking", nodeType === TreeItemType.State);
  //   if (nodeType === TreeItemType.State) {
  //     console.log("checking state");
  //     setAccessTree((prevTree) => {
  //       const updatedTree = { ...prevTree };
  //       console.log("checking updatedTree", updatedTree);
  //       updatedTree.country.states[stateIndex].selected = selected;
  //       console.log(
  //         "checking updatedTree2",
  //         updatedTree.country.states[stateIndex]
  //       );
  //       return updatedTree;
  //     });
  //   } else if (nodeType === TreeItemType.District) {
  //     setAccessTree((prevTree) => {
  //       const updatedTree = { ...prevTree };
  //       updatedTree.country.states[stateIndex].districts[
  //         districtIndex
  //       ].selected = selected;
  //       return updatedTree;
  //     });
  //   } else if (nodeType === TreeItemType.City) {
  //     console.log("_itemExpansion", "City", treeEdge, selected);
  //     setAccessTree((prevTree) => {
  //       const updatedTree = { ...prevTree };
  //       updatedTree.country.states[stateIndex].districts[districtIndex].cities[
  //         cityIndex
  //       ].selected = selected;
  //       return updatedTree;
  //     });
  //   } else if (nodeType === TreeItemType.Complex) {
  //     setAccessTree((prevTree) => {
  //       const updatedTree = { ...prevTree };
  //       updatedTree.country.states[stateIndex].districts[districtIndex].cities[
  //         cityIndex
  //       ].complexes[complexIndex].selected = selected;
  //       return updatedTree;
  //     });
  //   }

  //   setAccessSummary(getSelectionSummary(accessTree));
  //   selectionSummary.current?.setAccessSummary(accessSummary);
  //   stateList.current?.updateData(accessTree);
  //   localStorage.setItem('hasTreeValue', 0)
  // };

  const removeExpandedFromOtherStates = (accessTree, currentStateIndex) => {
    accessTree.country.states.forEach((state, index) => {
      // If this is the current state index, skip removing expanded
      if (index === currentStateIndex) {
        // state.expanded = true; // Ensure the current state is expanded
      } else {
        // Remove expanded key for this state and all nested nodes
        state.expanded = false;
        
        if (state.districts) {
          state.districts.forEach(district => {
            district.expanded = false;
            if (district.cities) {
              district.cities.forEach(city => {
                city.expanded = false;
                if (city.complexes) {
                  city.complexes.forEach(complex => {
                    complex.expanded = false;
                  });
                }
              });
            }
          });
        }
      }
    });
  };
  

  const handleUserSelection = (nodeType, treeEdge, selected) => {
    const stateIndex = treeEdge.stateIndex;
    const districtIndex = treeEdge.districtIndex;
    const cityIndex = treeEdge.cityIndex;
    const complexIndex = treeEdge.complexIndex;
  
    const updatedTree = { ...accessTreeRef.current }; // Access the current value of the ref
    
    console.log('stateIndex', stateIndex);
    removeExpandedFromOtherStates(updatedTree, treeEdge.stateIndex); // Remove expanded flags except for the current state

    if (nodeType === TreeItemType.State) {
      updatedTree.country.states[stateIndex].selected = selected;
      // updatedTree.country.states[stateIndex].expanded = true;
    } else if (nodeType === TreeItemType.District) {
      updatedTree.country.states[stateIndex].districts[districtIndex].selected = selected;
      updatedTree.country.states[stateIndex].expanded = true;
    } else if (nodeType === TreeItemType.City) {
      updatedTree.country.states[stateIndex].districts[districtIndex].cities[cityIndex].selected = selected;
      updatedTree.country.states[stateIndex].expanded = true;
      updatedTree.country.states[stateIndex].districts[districtIndex].expanded = true;
    } else if (nodeType === TreeItemType.Complex) {
      updatedTree.country.states[stateIndex].districts[districtIndex].cities[cityIndex].complexes[complexIndex].selected = selected;
      updatedTree.country.states[stateIndex].expanded = true;
      updatedTree.country.states[stateIndex].districts[districtIndex].expanded = true;
      updatedTree.country.states[stateIndex].districts[districtIndex].cities[cityIndex].expanded = true;    }
    
  
    accessTreeRef.current = updatedTree; // Update the ref value without triggering re-render
  
    // If you need to trigger a render for UI changes, you can update state
    // e.g., setAccessTree({...updatedTree}) if needed
  
    setAccessSummary(getSelectionSummary(accessTreeRef.current));
    selectionSummary.current?.setAccessSummary(accessSummary);
    stateList.current?.updateData(accessTreeRef.current);
    localStorage.setItem('hasTreeValue', 0);
  };

  useEffect(() => {
      initFetchCompletedUserAccessTreeAction();   
  }, []);

  console.log("checked accesstree", accessTree);
  

  const ComponentSelector = React.memo(({ accessTrees }) => {
    console.log('found current value', accessTrees.current);
    if (accessTrees.current) {
      return (
        <>
          {/* <h3>{accessTrees.current.country.states[0].name}</h3>
          <h4>{accessTrees.current.country.states[0].selected === true ? "32" : "00"}</h4> */}
          <StateList
            ref={stateList}
            listData={accessTrees.current}
            handleUserSelection={handleUserSelection}
          />
        </>
      );
    }
    return null;
  });
  

 // Memoize the component if there’s a performance concern
const memoizedTreeComponent = useMemo(() => {
  console.log('hello22',accessTree)
  console.log('state value', accessTreeRef.current);
  if (accessTreeRef.current) {
    let value = localStorage.getItem('hasTreeValue')
    // console.log('hasTreeValue', value);
    console.log('stateList checked', stateList);
    if(value == 1) {
      console.log('stateList checked', accessTree);
      return <ComponentSelector />;
    }
  }
}, [accessCopyTree]); // Add dependencies if needed accessCopyTree

if (!accessTree) {
  return null;
}

console.log('hello11')
console.log('accessTreeRef.current', accessTreeRef.current);
console.log('accessTreeRef.name', accessTreeRef.current.country.states[0].name);
console.log('accessTreeRef.selected', accessTreeRef.current.country.states[0].selected);
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
      <ConfirmationDialog ref={confirmationDialog} />

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
            onClick={onSubmit}
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
        {/* {memoizedTreeComponent} */}
        <ComponentSelector accessTrees={accessTreeRef}/>
        </div>
      </div>
    </>
  );
};

export default MemberAccess;
