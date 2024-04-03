import React, { useState } from "react";
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
import { clearUser, selectUser , setAccessTree} from "../features/authenticationSlice";
import Badge from "@mui/material/Badge";
import MessageDialog from "../dialogs/MessageDialog"; // Adjust the path based on your project structure
import {
  executeFetchDashboardLambda,
  executeReportFetchDashboardLambda,
  executeFetchCompletedUserAccessTree
} from "../awsClients/administrationLambdas";
import useOnlineStatus from "../services/useOnlineStatus";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

const AppBar = ({ isOnline }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [dialogData, setDialogData] = useState(null);
  const {
    setLocalStorageItem,
    getLocalStorageItem,
    chunkArray
  } = useOnlineStatus();
  const [loadingPdf, setLoadingPdf] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const navLinkStyle = { cursor: "pointer", fontSize: "16px" };

  const storageClear  = () => {
    // List of keys to remove
    const keys = Object.keys(localStorage);
    // Define the words you want to remove
    const wordsToRemove = ['selection_key','userDetails','data','complex_name','adminstration','historyStore'
   ,'extra','lastVisitedPage'];

    // Loop through the keys and remove corresponding items from localStorage
    keys.forEach(key => {
      console.log('key',key);
      if(key.includes('aws.cognito')) localStorage.removeItem(key);
      else if (key.includes('CognitoIdentityServiceProvider')) localStorage.removeItem(key);
      wordsToRemove.forEach(word => {
          if (key.includes(word)) {
              localStorage.removeItem(key);
          }
      });
    });
  }

  const confirmSignOut = () => {
    localStorage.setItem("set_user", user?.username);
    window.location.reload();
    storageClear();
    dispatch(clearUser());
    localStorage.removeItem('user');
    navigate('/login');
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
        localStorage.setItem(
          "report_dashboard",
          JSON.stringify(all_report_data)
        );
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
    let array = [60,45,30,15];
    array.forEach((duration) => {
      filter_date(dashboard_90, duration);
    });
  };

  const syncFunction = async () => {
    setLoadingPdf(true);
    console.log("syncFunction click");
    if(isOnline == false) {
      setDialogData({
        title: 'No Network',
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
    await initFetchCompletedUserAccessTreeAction()
    console.log("syncFunction is Complete");
    setLoadingPdf(false);
  };

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
            <NavItem>
              <NavLink
                style={navLinkStyle}
                onClick={() => {
                  navigate("/android_management");
                }}
              >
                Devices Management
              </NavLink>
            </NavItem>
          </Nav>
          <span
            style={{
              float: "right",
            }}
          >
            {/* <Button
              outline
              color="primary"
              // className="px-4"
              style={{
                float: "left",
                height: "37px",
                padding: "1px",
                background: "blue",
                margin: "1px",
              }}
            >
              {isOnline ? (
                <p style={{ color: "white" }}>Online</p>
              ) : (
                <p style={{ color: "red" }}>Offline</p>
              )}
            </Button> */}
            <Button
              outline
              color="primary"
              className="px-4"
              style={{
                float: "right",
                marginLeft: "7px",
              }}
              onClick={syncFunction}
            >
            {loadingPdf ? "Syncing ..." : "Sync Data"}
            {loadingPdf && (
              <Stack
                sx={{ width: "100%", color: "grey.500" }}
                spacing={2}
              >
                <LinearProgress color="secondary" />
              </Stack>
            )}
            </Button>
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
              <Button
                outline
                color="primary"
                className="px-4"
                style={{
                  float: "right",
                }}
                onClick={confirmSignOut}
              >
                <i className="fa fa-lock"></i> Logout
              </Button>
            </Badge>
          </span>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AppBar;
