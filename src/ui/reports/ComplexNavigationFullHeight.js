import React, { useEffect, useRef, useState, useMemo } from "react";
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
import {
  executeFetchCompletedUserAccessTree,
  executeReportFetchDashboardLambda,
} from "../../awsClients/administrationLambdas";
import {
  getAccessSummary,
  getComplexHierarchy,
} from "../../components/accessTree/accessTreeUtils";
import useOnlineStatus from "../../services/useOnlineStatus";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure

const ComplexNavigationFullHeight = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // const messageDialog = useRef();
  // const loadingDialog = useRef();
  const stateList = useRef();
  const { chunkArray, setCookie, getCookie } = useOnlineStatus();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);
  const reportParms = { complex: "all", duration: "90" };
  const [complexfetchFull , setComplexFetchFull] = useState(true);

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

  let complex_array;
  let all_report_data = [];

  const fetchDashboardReport = async (complex) => {
    try {
      console.log("fetchDashboardData--> 1111", reportParms);
      var result = await executeReportFetchDashboardLambda(
        user?.username,
        reportParms.duration,
        complex,
        user?.credentials
      );
      console.log("fetchDashboardData-->", result);
      all_report_data.push(result);
    } catch (err) {
      handleError(err, "fetchDashboardData");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const storeComplexdata = async (data) => {
    complex_array = [];
    (data?.country?.states ?? []).flatMap((state) =>
      (state.districts ?? []).flatMap((district) =>
        (district.cities ?? []).flatMap((city) =>
          (city.complexes ?? []).map((complex) =>
            complex_array.push(complex.name)
          )
        )
      )
    );
  };

  async function overloopData(dataArray) {
    try {
      var lastRunTime = getCookie("lastReportRunTime24");
      let hours = new Date().getHours();
      if(hours > 10) {
        var currentTime = new Date().getTime();
          if (
            !lastRunTime ||
            currentTime - parseInt(lastRunTime) >= 24 * 60 * 60 * 1000
          ) {
            const chunks = chunkArray(dataArray, 15);
            for (const chunk of chunks) {
              await fetchDashboardReport(chunk);
              console.log("chunck :->", chunk);
            }
            console.log("all_report_data", all_report_data);
            localStorage.setItem(
              "report_dashboard",
              JSON.stringify(all_report_data)
            );
            setCookie("lastReportRunTime24", currentTime.toString(), 24); // Expires in 24 hours
          }
        }
          let report_dashboard_data = localStorage.getItem('report_dashboard');
          let check = localStorage.getItem('settrigger');
          if(report_dashboard_data == undefined || report_dashboard_data == null || check ==  "1") {
            const chunks = chunkArray(dataArray, 15);
            for (const chunk of chunks) {
              await fetchDashboardReport(chunk);
              console.log("chunck :->", chunk);
            }
            console.log("all_report_data", all_report_data);
            localStorage.setItem(
              "report_dashboard",
              JSON.stringify(all_report_data)
            );
            localStorage.removeItem('settrigger');
          }
      } catch (err) {
        // Catch an error here
        handleError(err, "overloopData");
        dispatch(stopLoading()); // Dispatch the stopLoading action
      }
  }

  const initFetchCompletedUserAccessTreeAction = async () => {
    try {
      dispatch(startLoading()); // Dispatch the startLoading action
      setComplexFetchFull(false);
      const result = await executeFetchCompletedUserAccessTree(
        user?.user.userName,
        user?.credentials
      );
      await storeComplexdata(result);
      dispatch(stopLoading()); // Dispatch the stopLoading action
      dispatch(setAccessTree(result));
      await overloopData(complex_array);
      // localStorage.setItem("accessTree", JSON.stringify(complex_array));
      console.log("_defineAccess", result);
      setComplexFetchFull(true);
    } catch (err) {
      handleError(err, "initFetchCompletedUserAccessTreeAction");
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  useEffect(() => {
    console.log("_defineAccess", "componentDidMount()");
    if (user?.accessTree === undefined) {
      initFetchCompletedUserAccessTreeAction();
    }
  }, [user?.accessTree]);

  const handleComplexSelection = (treeEdge) => {
    console.log('complexfetchFull', complexfetchFull);
    if(complexfetchFull == false) {
      setDialogData({
        title: "Please Wait",
        message: "complex name's data is fetching Please try again after some time",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log('function handleComplexSelection');
        },
      });
      return true;
    }

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

  const memoizedTreeComponent = useMemo(() => {
    return <ComponentSelector />;
  }, [user?.accessTree,complexfetchFull]);

  // if (user?.accessTree === undefined) {
  //   return <NoDataComponent />;
  // }

  return (
    <div style={{ background: "white", width: "100%", padding: "5px" }}>
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <MessageDialog data={dialogData} />
      <Header />
      {/* <ComponentSelector /> */}
      {memoizedTreeComponent}
    </div>
  );
};

export default ComplexNavigationFullHeight;
