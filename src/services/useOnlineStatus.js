// useOnlineStatus.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useOnlineStatus = () => {
  const dispatch = useDispatch();
  const authentication = useSelector((state) => state.authentication);
  const dashboard = useSelector((State) => State.dashboard);
  const adminstration = useSelector((state) => state.adminstration);
  const clientData = useSelector((state) => state.clientData);
  const historyStore = useSelector((state) => state.historyStore);
  const complexStore = useSelector((state) => state.complexStore);
  const incidenece = useSelector((state) => state.incidenece);
  const report = useSelector((state) => state.report);
  const extra = useSelector((state) => state.extra);
  const vendor = useSelector((state) => state.vendor);

  const handleOfflineState = (check) => {
    try {
      if (!check) {
        console.log("handleOffline state", check);
        console.log("authentication data", authentication);
        console.log("dashboard ", dashboard);

        localStorage.setItem("authentication", JSON.stringify(authentication));
        localStorage.setItem("dashboard", JSON.stringify(dashboard));
        localStorage.setItem("adminstration", JSON.stringify(adminstration));
        localStorage.setItem("clientData", JSON.stringify(clientData));
        localStorage.setItem("historyStore", JSON.stringify(historyStore));
        localStorage.setItem("complexStore", JSON.stringify(complexStore));
        localStorage.setItem("incidenece", JSON.stringify(incidenece));
        localStorage.setItem("report", JSON.stringify(report));
        localStorage.setItem("extra", JSON.stringify(extra));
        localStorage.setItem("vendor", JSON.stringify(vendor));
      }
    } catch (error) {
      console.error("Error storing data in local storage:", error);
    }
  };

  const handleOnlineState = (check) => {
    console.log("handleOnline state", check);
  };

  useEffect(() => {}, [
    // authentication,
    dashboard,
    adminstration,
    clientData,
    historyStore,
    complexStore,
    incidenece,
    report,
    extra,
    vendor,
  ]);

  // useEffect(() => {
  //   const online = navigator.onLine;
  //   if (online) {
  //     handleOnlineState(true);
  //   } else {
  //     handleOfflineState(false);
  //   }
  // }, [authentication]); // Add dependencies as needed

  return { handleOfflineState, handleOnlineState };
};

export default useOnlineStatus;
