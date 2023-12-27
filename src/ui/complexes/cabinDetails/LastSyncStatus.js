import React, { useEffect } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { liveStatusStyle, whiteSurfaceLive } from "../../../jsStyles/Style";
// import { updatedSavePayload } from "../../../store/actions/complex-actions";

export default function LastSyncStatus(props) {
  const dispatch = useDispatch();
  const { cabinPayload, updatedCabinPayload } = useSelector((state) => {
    return {
      cabinPayload: state.complexStore.cabinPayload,
      updatedCabinPayload: state.complexStore.updatedCabinPayload,
    };
  });

  useEffect(() => {
    if (
      cabinPayload !== undefined &&
      props.cabinHealth.data.THING_NAME === cabinPayload.clientId
    ) {
      let data = cabinPayload;
      // dispatch(updatedSavePayload(data));
    }
  }, [props.cabinHealth.data.THING_NAME, cabinPayload, dispatch]);
  console.log(
    " OFFLINE-:👉",
    props.liveStatusResult.data.CONNECTION_STATUS === "OFFLINE"
  );
  console.log(
    " DISCONNECT_REASON-:👉",
    props.liveStatusResult.data.DISCONNECT_REASON
  );

  return (
    <div
      style={{
        ...whiteSurfaceLive,
        width: "100%",
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {updatedCabinPayload !== undefined &&
      props.cabinHealth.data.THING_NAME === updatedCabinPayload.clientId &&
      updatedCabinPayload.eventType === "connected" ? (
        <>
          <p>
            <span style={{ ...liveStatusStyle.name }}>Last Sync : </span>
            <span style={{ ...liveStatusStyle.value }}>
              {moment(updatedCabinPayload.timestamp).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </span>
          </p>
          <p>
            <span style={{ ...liveStatusStyle.name }}>IP Address : </span>
            <span style={{ ...liveStatusStyle.value }}>
              {updatedCabinPayload.ipAddress}
            </span>
          </p>
        </>
      ) : updatedCabinPayload !== undefined &&
        props.cabinHealth.data.THING_NAME === updatedCabinPayload.clientId &&
        updatedCabinPayload.eventType === "disconnected" ? (
        <>
          <p>
            <span style={{ ...liveStatusStyle.name }}>Last Sync : </span>
            <span style={{ ...liveStatusStyle.value }}>
              {moment(updatedCabinPayload.timestamp).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </span>
          </p>
          <p>
            <span style={{ ...liveStatusStyle.name }}>
              Disconnect Reason :{" "}
            </span>
            <span style={{ ...liveStatusStyle.value }}>
              {updatedCabinPayload.disconnectReason}
            </span>
          </p>
        </>
      ) : props.liveStatusResult.data.CONNECTION_STATUS === "OFFLINE" ? (
        <>
          <p>
            <span style={{ ...liveStatusStyle.name }}>Last Sync : </span>
            <span style={{ ...liveStatusStyle.value }}>
              {moment(props.liveStatusResult.data.timestamp).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </span>
          </p>
          <p>
            <span style={{ ...liveStatusStyle.name }}>
              Disconnect Reason :{" "}
            </span>
            <span style={{ ...liveStatusStyle.value }}>
              {props.liveStatusResult.data.DISCONNECT_REASON}
            </span>
          </p>
        </>
      ) : props.liveStatusResult.data.CONNECTION_STATUS === "ONLINE" ? (
        <>
          <p>
            <span style={{ ...liveStatusStyle.name }}>Last Sync : </span>
            <span style={{ ...liveStatusStyle.value }}>
              {moment(props.liveStatusResult.data.timestamp).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </span>
          </p>
          <p>
            <span style={{ ...liveStatusStyle.name }}>IP Address : </span>
            <span style={{ ...liveStatusStyle.value }}>
              {props.liveStatusResult.data.IP_ADDRESS}
            </span>
          </p>
        </>
      ) : null}
    </div>
  );
}
