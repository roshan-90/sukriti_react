import React, {
  useRef,
  useEffect,
  Suspense,
  useState,
  lazy,
  useCallback,
  useMemo,
} from "react";
// import { connect } from "react-redux";
// import { mqtt5, auth, iot } from "aws-iot-device-sdk-v2";
import {
  AWS_REGION,
  IDENTITY_POOL_ID,
  AWS_IOT_ENDPOINT,
  AWS_IOT_TOPIC,
  AWS_IOT_USERNAME,
  AWS_IOT_PASSWORD,
} from "../../lib/environment";
import ComplexComposition from "./ComplexComposition";
import ComplexNavigationCompact from "./ComplexNavigationCompact";
import CabinDetails from "./CabinDetails";
// import MessageDialog from "../../dialogs/MessageDialog";
// import { savePayload } from "../../store/actions/complex-actions";
import ErrorBoundary from "../../components/ErrorBoundary";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import AWS from "aws-sdk";
// import * as mqtt from "mqtt";

// const LazyMqtt = lazy(() => import("./Mqtt"));
// import "./customStyles.css"; // Import the custom CSS file

function ComplexDetails(props) {
  const complexComposition = useRef();
  // const messageDialog = useRef();

  // const [messages, setMessages] = useState([]);

  // const handleMessage = useCallback((topic, message) => {
  //     console.log("message", message)
  //     console.log("topic", topic)
  //     setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { topic: topic, message: message.toString() },
  //     ]);
  // }, []);
  // useEffect(() => {
  //     const client = mqtt.connect(
  //         "a372gqxqbver9r-ats.iot.ap-south-1.amazonaws.com"
  //     );

  //     client.on("connect", () => {
  //         client.subscribe("$aws/events/presence/#", (err) => {
  //             if (!err) {
  //                 console.log('Subscribed to topic "$aws/events/presence/#"');
  //             }
  //         });
  //     });

  //     client.on("message", (topic, message) => {
  //         console.log("Received message:", message.toString());
  //     });
  // });
  // useEffect(() => {
  //     AWS.config.region = AWS_REGION;
  //     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //         IdentityPoolId: IDENTITY_POOL_ID,
  //     });
  //     const client = mqtt5.Mqtt5ClientBuilder.newWebSocketClient()
  //         .withEndpoint(AWS_IOT_ENDPOINT)
  //         .withClientId("test123" + Math.floor(Date.now() / 1000))
  //         .withCredentialsProvider(
  //             new auth.CognitoCredentialsProvider({
  //                 client: new AWS.CognitoIdentity(),
  //                 region: AWS_REGION,
  //                 identityPoolId: IDENTITY_POOL_ID,
  //             })
  //         )
  //         .withDefaultKeepAliveSeconds(10)
  //         .withProtocol("wss")
  //         .build();

  //     client.on("connect", () => {
  //         console.log("Connected to AWS IoT MQTT broker");
  //         client.subscribe(AWS_IOT_TOPIC, (err) => {
  //             if (err) {
  //                 console.error("Failed to subscribe to topic", err);
  //             } else {
  //                 console.log("Subscribed to topic", AWS_IOT_TOPIC);
  //                 client.publish(AWS_IOT_TOPIC, "Hello mqtt");
  //             }
  //         });
  //     });
  //     client.on("message", (topic, message) => {
  //         console.log("Received message:", message.toString());
  //     });
  // })
  // useEffect(() => {
  //     const options = {
  //         keepalive: 10,
  //         clientId: "test123" + Math.floor(Date.now() / 1000),
  //         protocolId: "MQTT",
  //         protocol: "mqtt",
  //         username: AWS_IOT_USERNAME,
  //         password: AWS_IOT_PASSWORD,
  //         will: {
  //             topic: "WillMsg",
  //             payload: "Connection Closed abnormally..!",
  //             qos: 0,
  //             retain: false,
  //         },
  //     };
  //     const client = mqtt.connect(`wss://${AWS_IOT_ENDPOINT}`, options);
  //     console.log("client", client)

  //     client.on("connect", () => {
  //         console.log("Connected to MQTT broker");
  //         client.subscribe(AWS_IOT_TOPIC, (err) => {
  //             if (err) {
  //                 console.error("Failed to subscribe to topic", err);
  //             } else {
  //                 console.log("Subscribed to topic", AWS_IOT_TOPIC);
  //                 client.publish(AWS_IOT_TOPIC, "Hello mqtt");
  //             }
  //         });
  //     });

  //     client.on("message", handleMessage);

  //     client.on("error", (err) => {
  //         console.error("MQTT client error", err);
  //     });

  //     return () => {
  //         client.end();
  //     };
  // }, [handleMessage]);

  const TreeComponent = () => {
    console.log("hellog");
    return (
      <>
        <ComplexNavigationCompact />
      </>
    );
  };

  const memoizedTreeComponent = useMemo(() => {
    return <TreeComponent />;
  }, []);

  return (
    <ErrorBoundary>
      <div className="animated fadeIn" style={{ padding: "10px" }}>
        {/* <Mqtt5 /> */}
        <div className="row">
          <div className="col-md-3" style={{}}>
            {/* <MessageDialog ref={messageDialog} /> */}
            <ErrorBoundary>{memoizedTreeComponent}</ErrorBoundary>
            <ErrorBoundary>
              <ComplexComposition ref={complexComposition} />
            </ErrorBoundary>
          </div>
          <div className="col-md-9" style={{}}>
            <ErrorBoundary>
              <CabinDetails />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ComplexDetails;
