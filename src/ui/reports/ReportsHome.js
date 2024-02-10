import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Form,
  Label,
  Input,
  InputGroup,
} from "reactstrap";
import { dashboard } from "../../features/dashboardSlice";
import { setReportData, hasData } from "../../features/reportSlice";
import { setResetData, extraData } from "../../features/extraSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import {
  executeFetchDashboardLambda,
  executeReportFetchDashboardLambda,
} from "../../awsClients/administrationLambdas";
import {
  // executeDeleteUserSchedulerLambda,
  executeFetchReportLambda2,
} from "../../awsClients/incidenceLambdas";
import InputDatePicker from "../../components/InputDatePicker";
import { statsStyle, whiteSurfaceForScheduler } from "../../jsStyles/Style";
import Stats from "./Stats";
import ComplexNavigationFullHeight from "./ComplexNavigationFullHeight";
import ComplexNavigationFullHeight2 from "./ComplexNavigationFullHeight2";
import { getAccessSummary } from "../../components/accessTree/accessTreeUtils";
import moment from "moment";
import "../complexes/ComplexComposition.css";
import ErrorBoundary from "../../components/ErrorBoundary";
import { selectUser } from "../../features/authenticationSlice";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import useOnlineStatus from "../../services/useOnlineStatus";
import PdfGenerate from "./PdfReportGenerate";

const ReportsHome = ({ isOnline }) => {
  const [visibility, setVisibility] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [buttonOne, setButtonOne] = useState(false);
  const [complex, setComplex] = useState(["KRH_GSCDL", "GSCDCL_H_COURT"]);
  const [assignDetails, setAssignDetails] = useState({
    duration: null,
    bwt: false,
    email: "",
    schedule: false,
    rateValue: "",
    rateUnit: "days",
    scheduleDuration: "",
    ScheduleStartDate: "",
    ScheduleEndDate: "",
    StartDate: "",
    EndDate: "",
    selectedDate: "",
  });
  const [usageStats, setUsageStats] = useState(false);
  const [collectionStats, setCollectionStats] = useState(false);
  const [upiStats, setUpiStats] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState(false);
  const [bwtStats, setBwtStats] = useState(false);
  const [minEndDate, setMinEndDate] = useState(null);
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);
  const { setLocalStorageItem, chunkArray, getLocalStorageItem } =
    useOnlineStatus();
  const complexComposition = useRef();
  // const messageDialog = useRef();
  // const loadingDialog = useRef();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const hasReportData = useSelector(hasData);
  const complexData = useSelector(extraData);
  const reportData = useSelector((state) => state.report);
  const reportParms = { complex: "all", duration: "15" };
  let title = "";

  const toggleDialog = () => {
    setVisibility(!visibility);
    resetData(); // call the function to reset the data
  };

  let dashboard_data = getLocalStorageItem("dashboard_15");
  // let complex_array;
  // let all_report_data = [];
  // const storeComplexdata = () => {
  //   complex_array = [];
  //   (user?.accessTree?.country?.states ?? []).flatMap((state) =>
  //     (state.districts ?? []).flatMap((district) =>
  //       (district.cities ?? []).flatMap((city) =>
  //         (city.complexes ?? []).map((complex) =>
  //           complex_array.push(complex.name)
  //         )
  //       )
  //     )
  //   );
  // };

  const fetchDashboardReport = async (complex) => {
    try {
      dispatch(startLoading()); // Dispatch the startLoading action
      console.log("fetchDashboardData--> 1111", reportParms);
      var result = await executeReportFetchDashboardLambda(
        user?.username,
        reportParms.duration,
        complex,
        user?.credentials
      );
      console.log("fetchDashboardData-->", result);
      dispatch(setReportData(result[0]));
    } catch (err) {
      handleError(err, "fetchDashboardData");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  let totalCount = 0;
  let usage_summary = [
    { name: "MWC", value: 0 },
    { name: "FWC", value: 0 },
    { name: "PWC", value: 0 },
    { name: "MUR", value: 0 },
  ];
  let collection_summary = [
    { name: "MWC", value: 0 },
    { name: "FWC", value: 0 },
    { name: "PWC", value: 0 },
    { name: "MUR", value: 0 },
  ];
  let upiCollection_summary = [
    { name: "MWC", value: 0 },
    { name: "FWC", value: 0 },
    { name: "PWC", value: 0 },
    { name: "MUR", value: 0 },
  ];
  let feedback_summary = [
    { name: "MWC", value: 0 },
    { name: "FWC", value: 0 },
    { name: "PWC", value: 0 },
    { name: "MUR", value: 0 },
  ];

  const filter_date = (data, duration) => {
    // Define start and end dates
    const startDateString = "2023-12-10"; // Example start date string
    const endDateString = "2024-01-30"; // Example end date string

    // Function to filter data based on date range
    function filterDataByDateRange(data, startDateString, endDateString) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - duration); // Set start date to 15 days ago
      const endDate = new Date(); // End date is today
      // const startDate = new Date(startDateString);
      // const endDate = new Date(endDateString);
      return data.filter((entry) => {
        const [day, month, year] = entry.date.split("/");
        const entryDate = new Date(`${year}-${month}-${day}`);
        return entryDate >= startDate && entryDate <= endDate;
      });
    }

    // Create a new object to store filtered data for all keys
    const filteredData = {};
    const dataSummary = {
      collection: 0,
      feedback: 0,
      upiCollection: 0,
      usage: 0,
    };

    const summaryFunction = (key, data) => {
      console.log("summaryFunction :-->", data);
      for (let i = 0; i < data.length; i++) {
        if (data[i].all !== 0) {
          if (key in dataSummary) {
            if (key === "feedback") {
              console.log("check key feedback :-->", key);
              console.log("total feedback", data.length);
              totalCount = data.length;
              dataSummary[key] += Number(data[i].all);
              if (data[i].fwc !== 0) {
                feedback_summary[1].value += Number(data[i].fwc);
              }
              if (data[i].mur !== 0) {
                feedback_summary[3].value += Number(data[i].mur);
              }
              if (data[i].mwc !== 0) {
                feedback_summary[0].value += Number(data[i].mwc);
              }
              if (data[i].pwc !== 0) {
                feedback_summary[2].value += Number(data[i].pwc);
              }
            } else {
              console.log("check key :-->", key);
              console.log("check vlaue of key :-->", data[i].all);
              dataSummary[key] += Number(data[i].all);
              if (key === "usage") {
                if (data[i].fwc !== 0) {
                  console.log("ussage summary-->fwc", data[i].fwc);
                  usage_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  console.log("ussage summary-->mur", data[i].mur);
                  usage_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  console.log("ussage summary-->mwc", data[i].mwc);
                  usage_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  console.log("ussage summary-->pwc", data[i].pwc);
                  usage_summary[2].value += Number(data[i].pwc);
                }
                console.log("usage_summary", usage_summary);
                console.log("usage_summary--1", usage_summary[0].name);
              } else if (key === "upiCollection") {
                if (data[i].fwc !== 0) {
                  upiCollection_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  upiCollection_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  upiCollection_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  upiCollection_summary[2].value += Number(data[i].pwc);
                }
              } else if (key === "collection") {
                if (data[i].fwc !== 0) {
                  collection_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  collection_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  collection_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  collection_summary[2].value += Number(data[i].pwc);
                }
              }
            }
          }
          console.log("i :-->", data[i].all);
          console.log("value :->", key in dataSummary);
        }
      }
    };
    // Loop through each key in data.dashboardChartData
    Object.keys(data.dashboardChartData).forEach((key) => {
      // Filter data based on date range for each key
      filteredData[key] = filterDataByDateRange(
        data.dashboardChartData[key],
        startDateString,
        endDateString
      );
      console.log("key", key);
      console.log("filteredData", filteredData[key]);
      summaryFunction(key, filteredData[key]);
    });

    // Update data.dashboardChartData with filteredData
    Object.assign(data.dashboardChartData, filteredData);
    dataSummary.feedback = (dataSummary.feedback / totalCount).toFixed(1);
    Object.assign(data.dataSummary, dataSummary);
    Object.assign(data.pieChartData, {
      collection: collection_summary,
      feedback: feedback_summary,
      upiCollection: upiCollection_summary,
      usage: usage_summary,
    });
    dispatch(setReportData(data));

    console.log("data.dashboardChartData :-->", data);
    console.log("data.dashboard summary", dataSummary);
    console.log("data totalCount", totalCount);
  };

  const filter_complex = (all_report_data, duration) => {
    let shouldContinue = true;
    console.log("name :--> ", reportParms.complex);
    for (let i = 0; i < all_report_data.length; i++) {
      const response = all_report_data[i];
      for (let j = 0; j < response.length; j++) {
        const obj = response[j];
        console.log("obj :->", obj);
        // Check if the object has the property 'complexName'
        if (shouldContinue && obj.hasOwnProperty("complexName")) {
          // Print or store the name
          if (obj.complexName === reportParms.complex) {
            console.log(obj.complexName);
            filter_date(obj, duration);
            // dispatch(setReportData(obj));
            // Update the flag to stop further iterations
            shouldContinue = false;
            break; // Exit the inner loop
          }
        }
      }
      console.log("shouldContinue:-->", reportParms.complex);
      // Exit the outer loop if shouldContinue is false
      if (!shouldContinue) {
        break; // Exit the outer loop if the name is found
      }
    }
  };

  // async function overloopData(dataArray) {
  //   try {
  //     const chunks = chunkArray(dataArray, 15);
  //     for (const chunk of chunks) {
  //       // await uploadDataChunk(chunk);
  //       await fetchDashboardReport(chunk);
  //       console.log("chunck :->", chunk);
  //     }
  //     console.log("all_report_data", all_report_data);
  //     localStorage.setItem("report_dashboard", JSON.stringify(all_report_data));
  //     // setLocalStorageItem("report_dashboard", all_report_data);
  //   } catch (error) {
  //     // Catch an error here
  //   }
  // }
  const showDialog = (onClickAction) => {
    // storeComplexdata();
    // let complex_array = JSON.parse(localStorage.getItem("accessTree"));
    // console.log("complex_array :-->", complex_array);
    // overloopData(complex_array);
    // return;
    title = "REPORT DATA";
    onClickAction
      ? (onClickAction = onClickAction)
      : (onClickAction = undefined);
    setVisibility(!visibility);
    resetData(); // call the function to reset the data
    setTimeout(() => {
      dispatch(setResetData());
    }, 1000);
  };

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

  // const fetchDashboardData = async () => {
  //   try {
  //     dispatch(startLoading()); // Dispatch the startLoading action
  //     console.log("fetchDashboardData--> 1111", reportParms);
  //     var result = await executeFetchDashboardLambda(
  //       user?.username,
  //       reportParms.duration,
  //       reportParms.complex,
  //       user?.credentials
  //     );
  //     console.log("fetchDashboardData-->", result);
  //     dispatch(setReportData(result));
  //   } catch (err) {
  //     handleError(err, "fetchDashboardData");
  //   } finally {
  //     dispatch(stopLoading()); // Dispatch the stopLoading action
  //   }
  // };

  const setDashboard_data = (selectedDuration) => {
    switch (true) {
      case selectedDuration === 15:
        let dashboard_15 = getLocalStorageItem("dashboard_15");
        console.log("this is reportParms is 15 is selected", dashboard_15);
        dispatch(setReportData(dashboard_15));
        break;
      case selectedDuration === 30:
        let dashboard_30 = getLocalStorageItem("dashboard_30");
        console.log("this is reportparms is 30 selected", dashboard_30);
        dispatch(setReportData(dashboard_30));
        break;
      case selectedDuration === 45:
        let dashboard_45 = getLocalStorageItem("dashboard_45");
        console.log("this is reportParms is 45 selected", dashboard_45);
        dispatch(setReportData(dashboard_45));
        break;
      case selectedDuration === 60:
        let dashboard_60 = getLocalStorageItem("dashboard_60");
        console.log("this is reportparms is 60 selected", dashboard_60);
        dispatch(setReportData(dashboard_60));
        break;
      case selectedDuration === 90:
        let dashboard_90 = getLocalStorageItem("dashboard_90");
        console.log("this is reportparms is 90 selected", dashboard_90);
        dispatch(setReportData(dashboard_90));
        break;
      default:
        console.log("default switch working");
    }
  };

  const setComplexSelection = async (selectedComplex) => {
    localStorage.setItem("selection_key", "15 Days");
    reportParms.complex = selectedComplex.name;
    reportParms.duration = 15;
    localStorage.setItem("complex_name", selectedComplex.name);
    if (isOnline == false) {
      let value = localStorage.getItem("report_dashboard");
      filter_complex(JSON.parse(value), 15);
    } else {
      fetchDashboardReport([selectedComplex.name]);
    }
  };

  const setDurationSelection = (selectedDuration) => {
    reportParms.duration = selectedDuration;
    reportParms.complex = localStorage.getItem("complex_name");
    console.log("reportParam", reportParms);
    if (isOnline == false) {
      if (reportParms.complex === "all") {
        setDashboard_data(selectedDuration);
      } else {
        let value = localStorage.getItem("report_dashboard");
        if (value) {
          switch (true) {
            case selectedDuration === 15:
              filter_complex(JSON.parse(value), 15);
              break;
            case selectedDuration === 30:
              filter_complex(JSON.parse(value), 30);
              break;
            case selectedDuration === 45:
              filter_complex(JSON.parse(value), 45);
              break;
            case selectedDuration === 60:
              filter_complex(JSON.parse(value), 60);
              break;
            case selectedDuration === 90:
              filter_complex(JSON.parse(value), 90);
              break;
            default:
              console.log("default switch working");
          }
        }
      }
    } else {
      if (reportParms.complex === "all") {
        console.log("report complex all");
        setDashboard_data(selectedDuration);
      } else {
        fetchDashboardReport([reportParms.complex]);
      }
    }
  };

  const handleChange = (event) => {
    let complexArray = [];
    for (let index = 0; index < event.target.value.length; index++) {
      complexArray.push(event.target.value[index]);
    }
    setComplex(complexArray);
  };

  const _handleChange = (event) => {
    const { name, checked } = event.target;
    console.log("name-->", name);
    console.log("name-->", checked);
    if (name === "usageStats") {
      setUsageStats(checked);
    } else if (name === "collectionStats") {
      setCollectionStats(checked);
    } else if (name === "upiStats") {
      setUpiStats(checked);
    } else if (name === "feedbackStats") {
      setFeedbackStats(checked);
    } else if (name === "bwtStats") {
      setBwtStats(checked);
    }
    setButtonOne({ [name]: checked });
  };

  const showFields = (event) => {
    const targetValue = event.target.value;
    const dropdown = document.getElementById("dropdown");

    if (targetValue === "yesschedule") {
      dropdown.classList.remove("disabledbutton");
      setAssignDetails({ ...assignDetails, schedule: true });
    } else if (targetValue === "noschedule") {
      dropdown.classList.add("disabledbutton");
      setAssignDetails({ ...assignDetails, schedule: false });
    }
  };

  const handleStartDateSelect = (date) => {
    updateAssignDetailsField("ScheduleStartDate", date);
    const nextDay = moment(date).add(1, "day").toDate();
    setMinEndDate(nextDay);
    setIsEndDateEnabled(true);
  };

  const bwtShowFields = (event) => {
    const targetValue = event.target.value;
    if (targetValue === "yesbwt") {
      setAssignDetails({ ...assignDetails, bwt: true });
    } else if (targetValue === "nobwt") {
      setAssignDetails({ ...assignDetails, bwt: false });
    }
  };

  const updateAssignDetailsField = (field, value) => {
    const updatedAssignDetails = { ...assignDetails };

    switch (field) {
      case "duration":
        const startDate = new Date();
        const endDate = moment(value);
        const dayDifference = Math.abs(endDate.diff(startDate, "days"));
        updatedAssignDetails.duration = dayDifference;
        updatedAssignDetails.selectedDate = value;
        updatedAssignDetails.StartDate = startDate;
        updatedAssignDetails.EndDate = endDate;
        break;
      case "duration1":
        // console.log("startDate1", startDate1);
        // console.log("endDate1", endDate1);
        updatedAssignDetails.StartDate = value;
        // const dayDifference = Math.abs(endDate.diff(startDate, "days"));
        // updatedAssignDetails.duration = dayDifference;
        // updatedAssignDetails.selectedDate = value;
        // updatedAssignDetails.StartDate = startDate;
        // updatedAssignDetails.EndDate = endDate;
        break;
      case "duration2":
        updatedAssignDetails.EndDate = value;
        break;
      case "email":
        updatedAssignDetails.email = value;
        break;
      case "schedule":
        updatedAssignDetails.schedule = value;
        break;
      case "rateValue":
        updatedAssignDetails.rateValue = value;
        break;
      case "rateUnit":
        updatedAssignDetails.rateUnit = value;
        break;
      case "scheduleDuration":
        updatedAssignDetails.scheduleDuration = value;
        break;
      case "ScheduleStartDate":
        updatedAssignDetails.ScheduleStartDate = value;
        break;
      case "ScheduleEndDate":
        updatedAssignDetails.ScheduleEndDate = value;
        break;
      default:
        break;
    }

    setAssignDetails(updatedAssignDetails);
  };

  useEffect(() => {
    // fetchDashboardData(15);
    localStorage.setItem("selection_key", "15 Days");
    localStorage.setItem("complex_name", "all");
    dispatch(setReportData(dashboard_data));
  }, []);

  const resetData = () => {
    setAssignDetails({
      duration: null,
      bwt: false,
      email: "",
      schedule: false,
      rateValue: "",
      rateUnit: "",
      scheduleDuration: "",
      ScheduleStartDate: "",
      ScheduleEndDate: "",
      selectedDate: "",
    });
    setUsageStats(false);
    setCollectionStats(false);
    setUpiStats(false);
    setFeedbackStats(false);
    setBwtStats(false);
  };

  const fetchReportData = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    console.log("this.props.credentials", user?.credentials);
    const {
      duration,
      schedule,
      rateValue,
      scheduleDuration,
      ScheduleStartDate,
      ScheduleEndDate,
      email,
      StartDate,
      EndDate,
    } = assignDetails;

    console.log("startDate fetch Report Data", moment(StartDate).unix());
    console.log("startDate fetch Report Data", moment(EndDate).unix());

    try {
      if (!complexData.length) {
        setDialogData({
          title: "Validation Error",
          message: "Please Select Complex.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("ReportHome complexdata length");
          },
        });
        dispatch(stopLoading()); // Dispatch the stopLoading action
        return;
      }

      // if (duration === null) {
      //   setDialogData({
      //     title: "Validation Error",
      //     message: "Please Select Past Date.",
      //     onClickAction: () => {
      //       // Handle the action when the user clicks OK
      //       console.log("ReportHome duration");
      //     },
      //   });
      //   return;
      // }

      if (
        !usageStats &&
        !collectionStats &&
        !upiStats &&
        !feedbackStats &&
        !bwtStats
      ) {
        setDialogData({
          title: "Validation Error",
          message: "Please Select at least one stat.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("ReportHome");
          },
        });
        dispatch(stopLoading()); // Dispatch the stopLoading action
        return;
      }

      if (
        schedule &&
        (rateValue === "" ||
          scheduleDuration === "" ||
          ScheduleStartDate === "" ||
          email === "" ||
          ScheduleEndDate === "")
      ) {
        if (rateValue === "") {
          setDialogData({
            title: "Validation Error",
            message: "Please Select Schedule Rate Value.",
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log("ReportHome rate value");
            },
          });
        } else if (scheduleDuration === "") {
          setDialogData({
            title: "Validation Error",
            message: "Please Select Schedule Duration.",
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log("reporthome schedule duration");
            },
          });
        } else if (ScheduleStartDate === "") {
          setDialogData({
            title: "Validation Error",
            message: "Please Select Schedule Start Date.",
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log("reporthome schedule startDate");
            },
          });
        } else if (email === "") {
          setDialogData({
            title: "Validation Error",
            message:
              "Please enter an email address if you wish to schedule a report.",
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log("report home email");
            },
          });
        } else if (ScheduleEndDate === "") {
          setDialogData({
            title: "Validation Error",
            message: "Please Select Schedule End Date.",
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log("report home schedulenddate");
            },
          });
        }
        dispatch(stopLoading()); // Dispatch the stopLoading action
        return;
      }
      console.log("checking data", {
        StartDate,
        EndDate,
        usageStats,
        collectionStats,
        upiStats,
        feedbackStats,
        bwtStats,
        complexData,
      });
      if (isOnline == false) {
        PdfGenerate({
          StartDate,
          EndDate,
          usageStats,
          collectionStats,
          upiStats,
          feedbackStats,
          bwtStats,
          complexData,
        });
        return true;
      }
      // this.loadingDialog.current.showDialog();
      console.log("executeFetchReportLambda2 triggered");
      var result = await executeFetchReportLambda2(
        user?.user.userName,
        user?.user.clientName,
        assignDetails.duration,
        assignDetails.bwt,
        assignDetails.email,
        assignDetails.schedule,
        assignDetails.rateValue,
        "days",
        assignDetails.scheduleDuration,
        moment(assignDetails.EndDate).unix(),
        moment(assignDetails.StartDate).unix(),
        assignDetails.ScheduleStartDate,
        assignDetails.ScheduleEndDate,
        usageStats,
        collectionStats,
        upiStats,
        feedbackStats,
        bwtStats,
        complexData,
        user?.credentials
      );
      console.log("executeFetchReportLambda2-->", result);
      if (result.body.message == "User Already exist") {
        const userName = result.body.userName;
        // this.messageDialog.current.showDialog(
        //   "Failure",
        //   <>
        //     "Scheduler Already exist"
        //     <InputGroup
        //       className="mb-3"
        //       style={{ marginTop: "20px", justifyContent: "center" }}
        //     >
        //       <Button
        //         color="danger"
        //         style={{ textTransform: "uppercase" }}
        //         onClick={() => this.executeDeleteUserSchedulerLambda(userName)}
        //       >
        //         Delete User
        //       </Button>
        //     </InputGroup>
        //   </>,
        //   () => {
        //     this.props.history.goBack();
        //   }
        // );
      } else {
        console.log("setReportdata-->", result);
        dispatch(setReportData(result));
        var link = result.body.link;
        setDialogData({
          title: "Report Generated",
          message: (
            <div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                download={link}
              >
                Link for your PDF
              </a>
            </div>
          ),
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("report home schedulenddate");
          },
        });

        // this.messageDialog.current.showDialog(
        //   "Report Generated",
        //   <a
        //     href={link}
        //     target="_blank"
        //     without
        //     rel="noopener noreferrer"
        //     download={link}
        //   >
        //     Link for your PDF
        //   </a>
        // );
      }
      // this.loadingDialog.current.closeDialog();
      resetData(); // call the function to reset the data
      setTimeout(() => {
        setResetData();
      }, 1000);
      setVisibility(!visibility);
    } catch (err) {
      console.log("_lambda", err);
      // this.loadingDialog.current.closeDialog();
      // this.messageDialog.current.showDialog("Error Alert!", err.message);
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const executeDeleteUserSchedulerLambda = async (userName) => {
    // loadingDialog.current.showDialog();
    try {
      var result = await executeDeleteUserSchedulerLambda(
        userName,
        user?.credentials
      );
      setDialogData({
        title: "Success",
        message: "User deleted successfully",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("reporthome User deleted successfully");
        },
      });

      // loadingDialog.current.closeDialog();
    } catch (err) {
      console.log("_lambda", err);
      // loadingDialog.current.closeDialog();
      // messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const getPDF = () => {
    fetchReportData();
  };

  console.log(hasReportData, "hasReportData");
  console.log("reportData", reportData);

  if (hasReportData) {
    return (
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <div className="animated fadeIn" style={{}}>
          {isLoading && (
            <div className="loader-container">
              <CircularProgress
                className="loader"
                style={{ color: "rgb(93 192 166)" }}
              />
            </div>
          )}
          <MessageDialog data={dialogData} />

          <table style={{ width: "100%", height: "100%", padding: "0px" }}>
            <tbody>
              <tr>
                <td style={{ width: "20%" }}>
                  <div
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      padding: "10px",
                      height: "100%",
                      alignItems: "flex-start",
                    }}
                  >
                    <ComplexNavigationFullHeight
                      setComplexSelection={setComplexSelection}
                    />
                    <div
                      style={{
                        backgroundColor: "white",
                        marginTop: "20px",
                      }}
                    >
                      <Button
                        style={{
                          width: "100%",
                          padding: "5%",
                        }}
                        color="primary"
                        outline
                        className="px-4"
                        onClick={() => {
                          showDialog();
                        }}
                      >
                        Download Report
                      </Button>
                    </div>
                  </div>
                </td>
                <td style={{ width: "80%" }}>
                  <div style={{ width: "100" }}>
                    <Stats
                      setDurationSelection={setDurationSelection}
                      // handleComplexSelection={handleComplexSelection}
                      chartData={reportData?.data?.dashboardChartData}
                      pieChartData={reportData?.data?.pieChartData}
                      dataSummary={reportData?.data?.dataSummary}
                      bwtChartData={reportData?.data?.bwtdashboardChartData}
                      bwtPieChartData={reportData?.data?.bwtpieChartData}
                      bwtDataSummary={reportData?.data?.bwtdataSummary}
                      dashboardUpiChartData={
                        reportData?.data?.dashboardUpiChartData
                      }
                      pieChartUpiData={reportData?.data?.pieChartUpiData}
                      uiResult={dashboard_data?.uiResult?.data}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Modal isOpen={visibility} toggle={isEnabled} className={"modal-xl"}>
            {isLoading && (
              <div className="loader-container">
                <CircularProgress
                  className="loader"
                  style={{ color: "rgb(93 192 166)" }}
                />
              </div>
            )}
            <ModalHeader
              style={{ background: "#5DC0A6", color: `white` }}
              toggle={toggleDialog}
            >
              {title}
            </ModalHeader>
            <ModalBody
              style={{
                width: "100%",
                height: "540px",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: "100%",
                  ...whiteSurfaceForScheduler,
                  background: "white",
                }}
              >
                <label
                  style={{
                    marginBottom: "0px",
                  }}
                >
                  <h5>Select Complex</h5>
                </label>
                <ComplexNavigationFullHeight2
                  setComplexSelection={setComplexSelection}
                />
              </div>
              <div
                className="scheduleReport"
                style={{
                  width: "100%",
                  marginLeft: "15px",
                }}
              >
                <div
                  className="scheduleReport"
                  style={{
                    ...whiteSurfaceForScheduler,
                    background: "white",
                    height: "36%",
                  }}
                >
                  <div
                    style={{
                      ...statsStyle.scheduleTitle,
                    }}
                  >
                    <InputDatePicker
                      value={assignDetails.StartDate}
                      onSelect={(value) =>
                        updateAssignDetailsField("duration1", value)
                      }
                      minDate={new Date("01-02-2023")}
                      maxDate={new Date()}
                      onlyDate
                      label="Select Start Date"
                      type="date"
                      placeholder="Start Date"
                      className="date-picker-input"
                    />
                    <InputDatePicker
                      value={assignDetails.EndDate}
                      onSelect={(value) =>
                        updateAssignDetailsField("duration2", value)
                      }
                      minDate={new Date("01-02-2023")}
                      maxDate={new Date()}
                      onlyDate
                      label="Select End Date"
                      type="date"
                      placeholder="End Date"
                      className="date-picker-input"
                    />
                  </div>
                  <Form>
                    <FormGroup>
                      <InputGroup
                        style={{ marginTop: "15px" }}
                        className="mb-3"
                      >
                        <Label
                          style={{
                            ...statsStyle.scheduleTitle,
                            width: "33.5%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Email
                        </Label>
                        <Input
                          style={{
                            width: "200px",
                          }}
                          type="email"
                          placeholder="Email"
                          onChange={(event) =>
                            updateAssignDetailsField(
                              "email",
                              event.target.value
                            )
                          }
                        />
                      </InputGroup>
                      <InputGroup
                        className="mb-3"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Label
                          style={{
                            ...statsStyle.scheduleTitle,
                            width: "33.5%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Select Stats
                        </Label>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "65%",
                          }}
                        >
                          <div className="React__checkbox">
                            <Label>
                              Usage&nbsp;&nbsp;
                              <Input
                                type="checkbox"
                                name="usageStats"
                                className="React__checkbox--input"
                                onChange={_handleChange}
                              />
                              <span className="React__checkbox--span" />
                            </Label>
                          </div>

                          {reportData?.data?.uiResult?.data.collection_stats ===
                            "true" && (
                            <>
                              <div className="React__checkbox">
                                <Label>
                                  Collection&nbsp;&nbsp;
                                  <Input
                                    type="checkbox"
                                    name="collectionStats"
                                    className="React__checkbox--input"
                                    onChange={_handleChange}
                                  />
                                  <span className="React__checkbox--span" />
                                </Label>
                              </div>
                              <div className="React__checkbox">
                                <Label>
                                  UPI&nbsp;&nbsp;
                                  <Input
                                    type="checkbox"
                                    name="upiStats"
                                    className="React__checkbox--input"
                                    onChange={_handleChange}
                                  />
                                  <span className="React__checkbox--span" />
                                </Label>
                              </div>
                            </>
                          )}
                          <div className="React__checkbox">
                            <Label>
                              Feedback&nbsp;&nbsp;
                              <Input
                                type="checkbox"
                                name="feedbackStats"
                                className="React__checkbox--input"
                                onChange={_handleChange}
                              />
                              <span className="React__checkbox--span" />
                            </Label>
                          </div>
                          {reportData?.data?.uiResult?.data.bwt_stats ===
                            "true" && (
                            <div className="React__checkbox">
                              <Label>
                                BWT&nbsp;&nbsp;
                                <Input
                                  type="checkbox"
                                  name="bwtStats"
                                  className="React__checkbox--input"
                                  onChange={_handleChange}
                                />
                                <span className="React__checkbox--span" />
                              </Label>
                            </div>
                          )}
                          {/* {this.props.dashboardData.uiResult.data} */}
                        </div>
                      </InputGroup>
                    </FormGroup>
                  </Form>
                </div>
                <div
                  className="scheduleReport"
                  style={{
                    ...whiteSurfaceForScheduler,
                    background: "white",
                    margin: "10px 0px 0px 0px",
                  }}
                >
                  <Form style={{ margin: "10px 0px 0px 0px" }}>
                    <FormGroup>
                      <InputGroup
                        className="mb-3"
                        style={{ display: "flex", flexDirection: "row" }}
                      >
                        <div
                          style={{
                            ...statsStyle.scheduleTitle,
                            width: "34%",
                          }}
                        >
                          <p>Schedule Report</p>
                        </div>
                        <div style={{ display: "flex" }}>
                          <Label className="container-report">
                            YES&nbsp;&nbsp;
                            <Input
                              type="radio"
                              className="radio-input"
                              value="yesschedule"
                              name="radio"
                              disabled={isOnline ? false : true}
                              onChange={showFields}
                            />
                            <span class="checkmark"></span>
                          </Label>
                          <Label
                            className="container-report"
                            style={{ marginLeft: "170%" }}
                          >
                            NO&nbsp;&nbsp;
                            <Input
                              type="radio"
                              className="radio-input"
                              value="noschedule"
                              name="radio"
                              onChange={showFields}
                              defaultChecked
                            />
                            <span class="checkmark"></span>
                          </Label>
                        </div>
                      </InputGroup>
                      <Form
                        id="dropdown"
                        className="disabledbutton"
                        style={{ marginTop: "-30px" }}
                      >
                        <FormGroup>
                          <p
                            style={{
                              ...statsStyle.scheduleLabel,
                            }}
                          >
                            This report provides details of all Complexes that
                            were used in the selected time range.
                          </p>
                          <InputGroup style={{}} className="mb-3">
                            <div style={{ width: "33%" }}>
                              <Label
                                style={{
                                  ...statsStyle.scheduleTitle,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                Rate
                              </Label>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                width: "67%",
                              }}
                            >
                              <Input
                                style={{}}
                                type="number"
                                placeholder="Value"
                                min="0"
                                onChange={(event) => {
                                  const inputValue = event.target.value;
                                  if (inputValue >= 0) {
                                    updateAssignDetailsField(
                                      "rateValue",
                                      inputValue
                                    );
                                  }
                                }}
                              />
                              <Input
                                type="text"
                                id="exampleSelect"
                                placeholder="Days"
                                defaultValue="Days"
                                disabled="true"
                              />
                            </div>
                          </InputGroup>
                          <p
                            style={{
                              ...statsStyle.scheduleLabel,
                            }}
                          >
                            A schedule that runs at a regular rate, such as
                            every "{" "}
                            {assignDetails.rateValue
                              ? assignDetails.rateValue
                              : "10"}{" "}
                            Days ".
                          </p>
                          <div style={{ display: "flex" }}>
                            <Label
                              style={{
                                ...statsStyle.scheduleTitle,

                                display: "flex",
                                alignItems: "center",
                                width: "51%",
                              }}
                            >
                              Report Duration
                            </Label>
                            <Input
                              type="select"
                              name="select"
                              id="exampleSelect"
                              onChange={(event) =>
                                updateAssignDetailsField(
                                  "scheduleDuration",
                                  event.target.value
                                )
                              }
                            >
                              <option>Last 15 days</option>
                              <option>Last 30 days</option>
                              <option>Last 45 days</option>
                              <option>Last 60 days</option>
                              <option>Last 75 days</option>
                              <option>Last 90 days</option>
                            </Input>
                          </div>
                          <div
                            style={{
                              ...statsStyle.scheduleTitle,
                              margin: "10px 0px",
                            }}
                          >
                            <InputDatePicker
                              value={assignDetails.ScheduleStartDate}
                              // onSelect={(value) => this.updateAssignDetailsField("ScheduleStartDate", value)}
                              onSelect={handleStartDateSelect}
                              minDate={moment().add(1, "days").toDate()}
                              maxDate={new Date("01-12-2030")}
                              onlyDate
                              label="Schedule start time"
                              type="date"
                              placeholder="Schedule start"
                              className="date-picker-input"
                            />
                          </div>

                          <div
                            style={{
                              ...statsStyle.scheduleTitle,
                            }}
                          >
                            <InputDatePicker
                              value={assignDetails.ScheduleEndDate}
                              onSelect={(value) =>
                                updateAssignDetailsField(
                                  "ScheduleEndDate",
                                  value
                                )
                              }
                              // minDate={moment().add(2, "days").toDate()}
                              minDate={minEndDate}
                              maxDate={new Date("01-12-2030")}
                              onlyDate
                              label="Schedule end time"
                              type="date"
                              placeholder="Schedule end"
                              className="date-picker-input"
                              disabled={!isEndDateEnabled}
                            />
                          </div>
                        </FormGroup>
                      </Form>
                    </FormGroup>
                  </Form>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                style={{ margin: "auto" }}
                color="primary"
                className="px-4"
                onClick={getPDF}
              >
                Download Pdf
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </ErrorBoundary>
    );
  }
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
      <MessageDialog data={dialogData} />
    </>
  );
};

export default ReportsHome;
