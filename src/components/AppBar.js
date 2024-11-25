import React, { useRef, useState, useEffect } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import logo from "../assets/img/brand/logo.png";
import { useNavigate } from "react-router-dom";
import {
  clearUser,
  selectUser,
  setAccessTree,
  setLoadingPdf,
  setTriggerFunction,
} from "../features/authenticationSlice";
import Badge from "@mui/material/Badge";
import MessageDialog from "../dialogs/MessageDialog"; // Adjust the path based on your project structure
import {
  executeFetchDashboardLambda,
  executeReportFetchDashboardLambda,
  executeFetchCompletedUserAccessTree,
} from "../awsClients/administrationLambdas";
import useOnlineStatus from "../services/useOnlineStatus";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Select from "react-select"; // Importing react-select
import { setDashboardView, dashboard, setSelectParentFrequency, setDashboardData, setRecycleViewData } from "../features/dashboardSlice";
import { startLoading, stopLoading } from "../features/loadingSlice";
import Dropdown from "../components/DropDown";

const AppBar = ({ isOnline }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const dashboard_data = useSelector(dashboard);
  const loadingPdf = useSelector((state) => state.authentication.loadingPdf);
  const triggerFunction = useSelector(
    (state) => state.authentication.triggerFunction
  );
  const viewOptions = [
    { label: "Summary View", value: "Summary View" },
    { label: "Recycle View", value: "Recycle View" },
  ];
  const parentFrequency = [
    { label: "20 Sec", value: 20000 },
    { label: "40 Sec", value: 40000 },
    { label: "1 Min", value: 60000 },
    { label: "1 Min 20 Sec", value: 80000 },
    { label: "1 Min 40 Sec", value: 100000 },
    { label: "2 Min", value: 120000 },
  ];
  const actionOptions = ["15 Days", "30 Days", "45 Days", "60 Days", "90 Days"];
  const actionValues = [15, 30, 45, 60, 90];
  const reportParms = { complex: "all", duration: "15" };
  // const [recycleViewData, setRecycleViewData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [dialogData, setDialogData] = useState(null);
  const { setLocalStorageItem, getLocalStorageItem, chunkArray } =
    useOnlineStatus();
  // const [loadingPdf, setLoadingPdf] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalStyle, setModalStyle] = useState({ top: 0, left: "1151px" });
  const iconRef = useRef(null);
  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setModalStyle({
        top: rect.top + window.scrollY + rect.height,
        left: rect.left + window.scrollX,
      });
    }
    setOpen(true);
  };
  console.log("isOnline", isOnline);

  const toggle = () => setIsOpen(!isOpen);

  const navLinkStyle = { cursor: "pointer", fontSize: "16px" };

  useEffect(() => {
    // Call the sync function every 3 hours
    const interval = setInterval(() => {
      console.log('interval is trigger')
      syncFunction();
    }, 3 * 60 * 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs once on mount

  const handleUpdateView = (data) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    let value = localStorage.getItem("report_dashboard");
    if(reportParms.duration == 15) {
      filter_complex(JSON.parse(value), 15);
    } else if (reportParms.duration == 30) {
      filter_complex(JSON.parse(value), 30)
    } else if (reportParms.duration == 60) {
      filter_complex(JSON.parse(value), 60)
    } else if (reportParms.duration == 90) {
      filter_complex(JSON.parse(value), 90)
    }
    dispatch(setDashboardView(data));
    handleClose();
    setTimeout(() => {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }, 5000);
  };


  const storageClear = () => {
    // List of keys to remove
    const keys = Object.keys(localStorage);
    // Define the words you want to remove
    const wordsToRemove = [
      "selection_key",
      "userDetails",
      "data",
      "complex_name",
      "adminstration",
      "historyStore",
      "extra",
      "lastVisitedPage",
    ];

    // Loop through the keys and remove corresponding items from localStorage
    keys.forEach((key) => {
      console.log("key", key);
      if (key.includes("aws.cognito")) localStorage.removeItem(key);
      else if (key.includes("CognitoIdentityServiceProvider"))
        localStorage.removeItem(key);
      wordsToRemove.forEach((word) => {
        if (key.includes(word)) {
          localStorage.removeItem(key);
        }
      });
    });
  };

  const confirmSignOut = () => {
    localStorage.setItem("set_user", user?.username);
    window.location.reload();
    storageClear();
    dispatch(clearUser());
    localStorage.removeItem("user");
    navigate("/login");
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

  let complex_array;
  let all_report_data = [];

  const fetchDashboardReport = async (complex) => {
    try {
      var result = await executeReportFetchDashboardLambda(
        user?.username,
        "90",
        complex,
        user?.credentials
      );
      console.log("fetchDashboardData-->", result);
      all_report_data.push(result);
    } catch (err) {
      handleError(err, "fetchDashboardData");
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
      const chunks = chunkArray(dataArray, 15);
      for (const chunk of chunks) {
        await fetchDashboardReport(chunk);
        console.log("chunck :->", chunk);
      }
      console.log("all_report_data", all_report_data);
      localStorage.setItem("report_dashboard", JSON.stringify(all_report_data));
    } catch (err) {
      // Catch an error here
      handleError(err, "overloopData");
    }
  }

  const initFetchCompletedUserAccessTreeAction = async () => {
    try {
      const result = await executeFetchCompletedUserAccessTree(
        user?.user.userName,
        user?.credentials
      );
      await storeComplexdata(result);
      dispatch(setAccessTree(result));
      await overloopData(complex_array);
      console.log("UserAccessTree", result);
    } catch (err) {
      handleError(err, "initFetchCompletedUserAccessTreeAction");
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

  let bwtdata_summary = {
    waterRecycled: 0,
  };

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
    let filteredData = {};
    const dataSummary = {
      collection: 0,
      feedback: 0,
      upiCollection: 0,
      usage: 0,
    };

    const databwtsummary = {
      all: 0,
      bwt: 0,
    };

    const bwtSummary = (data) => {
      console.log("bwt summary", data);
      for (let i = 0; i < data.length; i++) {
        console.log("checking bwt summary", data[i]);
        if (data[i].all !== 0) {
          databwtsummary.all += Number(data[i].all);
          databwtsummary.bwt += Number(data[i].bwt);
        }
      }
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
    filteredData = {};
    filteredData = filterDataByDateRange(
      data.bwtdashboardChartData?.waterRecycled,
      startDateString,
      endDateString
    );
    console.log("filteredData 22:-> ", filteredData);

    Object.assign(data.bwtdashboardChartData, { waterRecycled: filteredData });
    bwtSummary(filteredData);
    Object.assign(data.bwtdataSummary, { waterRecycled: databwtsummary?.all });

    Object.assign(data.bwtpieChartData, {
      usage: [
        {
          name: "BWT",
          value: databwtsummary?.bwt,
        },
      ],
    });

    console.log("filter data -->", data);
    setLocalStorageItem(`dashboard_${duration}`, JSON.stringify(data));
  };

  const fetch_dashboard = async () => {
    console.log(" after fetch_dashboard");
    let dashboard_90 = getLocalStorageItem("dashboard_90");
    let array = [60, 45, 30, 15];
    array.forEach((duration) => {
      filter_date(dashboard_90, duration);
    });
  };

  const syncFunction = async () => {
    dispatch(setLoadingPdf(true));
    console.log("syncFunction click");
    if (isOnline == false) {
      setDialogData({
        title: "No Network",
        message: "Please try again later",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`syncFunction -->`);
        },
      });
      return;
    }
    let result_90 = await executeFetchDashboardLambda(
      user?.username,
      "90",
      "all",
      user?.credentials
    );
    console.log("result_90", result_90);
    setLocalStorageItem("dashboard_90", JSON.stringify(result_90));
    await fetch_dashboard();
    await initFetchCompletedUserAccessTreeAction();
    console.log("syncFunction is Complete");
    dispatch(setLoadingPdf(false));
  };

  console.log("triggerFunction", triggerFunction);

  if (isOnline == true) {
    if (triggerFunction == true) {
      syncFunction();
      dispatch(setTriggerFunction(false));
    }
  }

  const setOfflineMessage = (title) => {
    return (message) => {
      return (name) => {
        console.log("title ", title);
        console.log("message ", message);
        setDialogData({
          title: title,
          message: message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`${name} -->`);
          },
        });
      };
    };
  };

  const handleUpdateParentFrequency = (data) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    dispatch(setSelectParentFrequency(data));
    setTimeout(() => {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }, 5000);
  };

  const filter_complex = (all_report_data, duration) => {
    console.log('all_report_data', all_report_data);
    if(all_report_data == null || all_report_data == undefined) {
    } else {
      dispatch(setRecycleViewData([]));
      let array_data = [];
      for (let i = 0; i < all_report_data.length; i++) {
        const response = all_report_data[i];
        for (let j = 0; j < response.length; j++) {
          const obj = response[j];
          filter_date_single(obj, duration, array_data);
        }
      }
      dispatch(setRecycleViewData([array_data]));
      setTimeout(() => {
        dispatch(stopLoading()); // Dispatch the stopLoading action
      }, 2000);
    }
  };

  const setDurationSelection = async (duration) => {
    console.log("duration", duration);
    reportParms.duration = duration;
    // if (isOnline == false) {
    let value = localStorage.getItem("report_dashboard");
    switch (true) {
      case duration === 15:
        let dashboard_15 = getLocalStorageItem("dashboard_15");
        if(dashboard_data.selectionView?.value !== "Summary View") {
          dispatch(startLoading());
          filter_complex(JSON.parse(value), 15);
        }
        if (dashboard_15 == undefined || dashboard_15 == null) {
        } else {
          dispatch(setDashboardData(dashboard_15));
        }
        break;
      case duration === 30:
        let dashboard_30 = getLocalStorageItem("dashboard_30");
        if(dashboard_data.selectionView?.value !== "Summary View") {
          dispatch(startLoading());
          filter_complex(JSON.parse(value), 30);
        }
        if (dashboard_30 == undefined || dashboard_30 == null) {
        } else {
          dispatch(setDashboardData(dashboard_30));
        }
        break;
      case duration === 45:
        let dashboard_45 = getLocalStorageItem("dashboard_45");
        if(dashboard_data.selectionView?.value !== "Summary View") {
          dispatch(startLoading());
          filter_complex(JSON.parse(value), 45);
        }
        if (dashboard_45 == undefined || dashboard_45 == null) {
        } else {
          dispatch(setDashboardData(dashboard_45));
        }
        break;
      case duration === 60:
        let dashboard_60 = getLocalStorageItem("dashboard_60");
        if(dashboard_data.selectionView?.value !== "Summary View") {
          dispatch(startLoading());
          filter_complex(JSON.parse(value), 60);
        }
        if (dashboard_60 == undefined || dashboard_60 == null) {
        } else {
          dispatch(setDashboardData(dashboard_60));
        }
        break;
      case duration === 90:
        let dashboard_90 = getLocalStorageItem("dashboard_90");
        if(dashboard_data.selectionView?.value !== "Summary View") {
          dispatch(startLoading());
          filter_complex(JSON.parse(value), 90);
        }
        if (dashboard_90 == undefined || dashboard_90 == null) {
        } else {
          dispatch(setDashboardData(dashboard_90));
        }
        break;
      default:
        console.log("default switch working");
    }
    // } else {
    //   await fetchDashboardData();
    // }
  };

  const handleUpdate = (configName, configValue) => {
    dispatch(stopLoading()); // Dispatch the stopLoading action
    console.log("_updateCommand", configName, configValue);
    const index = actionOptions.indexOf(configValue);
    setDurationSelection(actionValues[index]);
    if(dashboard_data.selectionView?.value !== "Summary View") {
      setTimeout(() => {
        dispatch(stopLoading()); // Dispatch the stopLoading action
      }, 7000);
    }
  };

  // console.log('dashboard_data',dashboard_data);

  return (
    <div>
      <Navbar color="white" light expand="md">
        <MessageDialog data={dialogData} />
        <NavbarBrand href="/">
          <img src={logo} style={{ width: 180 }} alt="" />
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />

        <Collapse
          style={{ marginLeft: "0px", justifyContent: "space-between" }}
          isOpen={isOpen}
          navbar
        >
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  navigate("/dashboard"); // Use navigate for navigation
                }}
              >
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  console.log("isOnline", isOnline);
                  if (isOnline) {
                    navigate("/complex/details");
                  } else {
                    setOfflineMessage("Offline")(
                      "Feature is not available in Offline Mode"
                    )("complex_detail");
                  }
                }}
              >
                Complexes
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  if (isOnline) {
                    navigate("/incidence/tickets");
                  } else {
                    setOfflineMessage("Offline")(
                      "Feature is not available in Offline Mode"
                    )("incidence ticket");
                  }
                }}
              >
                Incidence
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  navigate("/reports");
                }}
              >
                Reports
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  if (isOnline) {
                    navigate("/administration");
                  } else {
                    setOfflineMessage("Offline")(
                      "Feature is not available in Offline Mode"
                    )("administration");
                  }
                }}
              >
                Administration
              </NavLink>
            </NavItem>
            {user?.user?.userRole === "Super Admin" ? (
              <NavItem>
                <NavLink
                  style={navLinkStyle}
                  onClick={() => {
                    if (isOnline) {
                      navigate("/vendor");
                    } else {
                      setOfflineMessage("Offline")(
                        "Feature is not available in Offline Mode"
                      )("vendor");
                    }
                  }}
                >
                  Vendor
                </NavLink>
              </NavItem>
            ) : null}
            {user?.user?.userRole === "Super Admin" ? (
              <NavItem>
                <NavLink
                  style={navLinkStyle}
                  onClick={() => {
                    if (isOnline) {
                      navigate("/android_management");
                    } else {
                      setOfflineMessage("Offline")(
                        "Feature is not available in Offline Mode"
                      )("Android Management");
                    }
                  }}
                >
                  Devices Management
                </NavLink>
              </NavItem>
            ) : null}
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  if (isOnline) {
                    navigate("/user-profile");
                  } else {
                    setOfflineMessage("Offline")(
                      "Feature is not available in Offline Mode"
                    )("User Profile");
                  }
                }}
              >
                User Profile
              </NavLink>
            </NavItem>
          </Nav>
          <span
            style={{
              float: "right",
            }}
          >
             {user?.user?.name}
            <Badge
              color={isOnline ? "success" : "error"}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              badgeContent={
                isOnline ? (
                  <p style={{ color: "white", margin: "2px" }}>Online</p>
                ) : (
                  <p style={{ color: "white", margin: "2px" }}>Offline</p>
                )
              }
            >
             
              <IconButton
                ref={iconRef}
                onClick={handleOpen}
                sx={{
                  position: "relative",
                }}
              >
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            </Badge>
          </span>
        </Collapse>
      </Navbar>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: modalStyle.top,
            left: "1050px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 1,
            textAlign: "left", // Ensures left alignment of text
            width: "20%"
          }}
        >
         {/* User Name */}
          <div style={{ marginBottom: "10px" }}>
            {user?.user?.name}
          </div>
          <p><b>Select Frequency</b></p>
          <Select
            options={parentFrequency || []}
            value={dashboard_data.selectParentFrequency}
            onChange={handleUpdateParentFrequency}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                marginBottom: "10px",
                width: "70%",
              }),
            }}
          />
            <p><b>Select Duration</b></p>
            <div style={{ width: "70%" , marginBottom: "10px"}}>
              <Dropdown
                options={actionOptions}
                onSelection={(index, value) => {
                  handleUpdate("Duration", value);
                }}
            />
            </div>
          {/* Select Dropdown */}
          <p><b>View Type</b></p>
          <Select
              options={viewOptions || []}
              value={dashboard_data.selectionView}
              onChange={handleUpdateView}
              styles={{
                control: (provided) => ({
                  ...provided,
                  textAlign: "left", // Ensures dropdown content aligns left
                  marginBottom: "20px",
                  width: "70%"
                }),
              }}
            />
            {/* Sync Data Button */}
            <div style={{ marginBottom: "10px",  width: "100%"}}>
              <Button
                outline
                color="primary"
                className="px-4"
                sx={{
                  display: "block",
                  marginBottom: "16px", // Space below
                  textAlign: "left",
                }}
                onClick={syncFunction}
              >
                {loadingPdf ? "Syncing ..." : "Sync Data"}
                {loadingPdf && (
                  <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
                    <LinearProgress color="secondary" />
                  </Stack>
                )}
              </Button>
            </div>
           {/* Logout Button */}
           <div style={{ width: "100%"}}>
            <Button
              outline
              color="primary"
              className="px-4"
              sx={{
                display: "block",
                textAlign: "left", // Align text in the button to the left
                marginBottom: "10px"
              }}
              onClick={confirmSignOut}
            >
              <i className="fa fa-lock"></i>&nbsp;&nbsp;Logout
            </Button>
            </div>
        </Box>
      </Modal>
    </div>
  );
};

function  filter_date_single(data, duration, array_data) {

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

  let bwtdata_summary = {
    waterRecycled: 0,
  };

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
    let filteredData = {};
    const dataSummary = {
      collection: 0,
      feedback: 0,
      upiCollection: 0,
      usage: 0,
    };

    const databwtsummary = {
      all: 0,
      bwt: 0,
    };

    const bwtSummary = (data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].all !== 0) {
          databwtsummary.all += Number(data[i].all);
          databwtsummary.bwt += Number(data[i].bwt);
        }
      }
    };

    const summaryFunction = (key, data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].all !== 0) {
          if (key in dataSummary) {
            if (key === "feedback") {
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
              dataSummary[key] += Number(data[i].all);
              if (key === "usage") {
                if (data[i].fwc !== 0) {
                  usage_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  usage_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  usage_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  usage_summary[2].value += Number(data[i].pwc);
                }
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
      summaryFunction(key, filteredData[key]);
    });
    // Update data.dashboardChartData with filteredData
    Object.assign(data.dashboardChartData, filteredData);
    dataSummary.feedback = (dataSummary.feedback / totalCount).toFixed(1);
    dataSummary.feedback =
      dataSummary.feedback == "NaN" ? 0 : dataSummary.feedback;
    Object.assign(data.dataSummary, dataSummary);
    Object.assign(data.pieChartData, {
      collection: collection_summary,
      feedback: feedback_summary,
      upiCollection: upiCollection_summary,
      usage: usage_summary,
    });
    filteredData = {};
    filteredData = filterDataByDateRange(
      data.bwtdashboardChartData?.waterRecycled,
      startDateString,
      endDateString
    );

    Object.assign(data.bwtdashboardChartData, { waterRecycled: filteredData });
    bwtSummary(filteredData);
    Object.assign(data.bwtdataSummary, { waterRecycled: databwtsummary?.all });

    Object.assign(data.bwtpieChartData, {
      usage: [
        {
          name: "BWT",
          value: databwtsummary?.bwt,
        },
      ],
    });

    array_data.push(data);
};

export default AppBar;
