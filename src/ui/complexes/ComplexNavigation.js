import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
// import { setOwnAccessTree } from "../../store/actions/authentication";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import RxAccessSummary from "../../components/RxAccessSummary";
import StateList from "../../components/accessTree/complexNav/SateList";
import NoDataComponent from "../../components/NoDataComponent";
import { executeFetchCompletedUserAccessTree } from "../../awsClients/administrationLambdas";
import {
  getAccessSummary,
  getComplexHierarchy,
} from "../../components/accessTree/accessTreeUtils";

const ComplexNavigation = (props) => {
  // const messageDialog = useRef();
  // const loadingDialog = useRef();
  const selectionSummary = useRef();
  const stateList = useRef();

  useEffect(() => {
    if (props.accessTree === undefined) {
      initFetchCompletedUserAccessTreeAction();
    }
  }, [props.accessTree]);

  const handleComplexSelection = (treeEdge) => {
    const stateIndex = treeEdge.stateIndex;
    const districtIndex = treeEdge.districtIndex;
    const cityIndex = treeEdge.cityIndex;
    const complexIndex = treeEdge.complexIndex;

    const complex =
      props.accessTree.country.states[stateIndex].districts[districtIndex]
        .cities[cityIndex].complexes[complexIndex];

    const bundle = {
      history: props.history,
      complex: complex,
      hierarchy: getComplexHierarchy(props.accessTree, treeEdge),
    };
    props.history.push({ pathname: "/complex/details", bundle: bundle });
  };

  const initFetchCompletedUserAccessTreeAction = async () => {
    // loadingDialog.current.showDialog();
    try {
      const result = await executeFetchCompletedUserAccessTree(
        props.user.userName,
        props.credentials
      );
      props.setOwnAccessTree(result);
      // loadingDialog.current.closeDialog();
    } catch (err) {
      console.log("_err", err);
      // loadingDialog.current.closeDialog();
      // messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  return (
    <div
      className="animated fadeIn"
      style={{
        padding: "10px",
      }}
    >
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}

      <Row>
        <Col xs="12" sm="12" lg="12">
          <Card>
            <CardHeader>
              <h1>Complexes</h1>
            </CardHeader>

            <CardBody></CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs="12" sm="12" lg="12">
          <Card>
            <CardBody>
              <div
                className="col-md-10 offset-md-2"
                style={{ width: "80%", margin: "auto" }}
              >
                <div>
                  <div className="col-md-2" style={{ float: "right" }}>
                    <RxAccessSummary
                      ref={selectionSummary}
                      accessSummary={props.accessSummary}
                    />
                  </div>
                </div>

                <div className="col-md-8 offset-md-1" style={{ clear: "both" }}>
                  <ComponentSelector />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );

  function ComponentSelector() {
    if (props.accessTree === undefined) {
      return <NoDataComponent />;
    } else {
      return (
        <StateList
          ref={stateList}
          listData={props.accessTree}
          handleComplexSelection={handleComplexSelection}
        />
      );
    }
  }
};

export default ComplexNavigation;
