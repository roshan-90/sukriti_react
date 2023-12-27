/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
import React, { useEffect } from "react";
// import { mqtt, iot } from "aws-iot-device-sdk-v2";
import { mqtt5, iot } from "aws-crt/dist.browser/browser";
import { connect } from "react-redux";
import {
  AWS_REGION,
  IDENTITY_POOL_ID,
  AWS_IOT_ENDPOINT,
} from "../../lib/environment";

import { once } from "events";

function createClient(credentials) {
  let wsConfig = {
    credentialsProvider: {
      aws_access_id: credentials.data.Credentials?.AccessKeyId ?? "",
      aws_secret_key: credentials.data.Credentials?.SecretKey ?? "",
      aws_sts_token: credentials.data.Credentials?.SessionToken,
      aws_region: AWS_REGION,
    },
    region: AWS_REGION,
  };

  console.log("wsConfig", wsConfig);

  let builder =
    iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
      AWS_IOT_ENDPOINT,
      wsConfig
    );

  let client = new mqtt5.Mqtt5Client(builder.build());
  console.log("client", client);

  client.on("error", (error) => {
    console.log("Error event: ", error.toString());
  });

  client.on("messageReceived", (eventData) => {
    console.log("Message Received event: " + JSON.stringify(eventData.message));
    if (eventData.message.payload) {
      console.log("  with payload: ", eventData.message.payload);
    }
  });

  client.on("attemptingConnect", (eventData) => {
    console.log("Attempting Connect event", eventData);
  });

  client.on("connectionSuccess", (eventData) => {
    console.log("Connection Success event");
    console.lo("Connack: " + JSON.stringify(eventData.connack));
    console.log("Settings: " + JSON.stringify(eventData.settings));
  });

  client.on("connectionFailure", (eventData) => {
    console.log("Connection failure event: " + eventData.error.toString());
  });

  client.on("disconnection", (eventData) => {
    console.log("Disconnection event: " + eventData.error.toString());
    if (eventData.disconnect !== undefined) {
      console.log("Disconnect packet: " + JSON.stringify(eventData.disconnect));
    }
  });

  client.on("stopped", (eventData) => {
    console.log("Stopped event");
  });

  return client;
}

function Mqtt5({ credentials }) {
  var client;
  var user_msg_count = 0;
  const qos0Topic = "$aws/events/presence/#";
  const qos1Topic = "$aws/events/presence/#";

  async function testSuccessfulConnection() {
    client = createClient(credentials);

    // const attemptingConnect = once(client, "attemptingConnect");
    // const connectionSuccess = once(client, "connectionSuccess");

    client.start();

    // await attemptingConnect;
    // await connectionSuccess;

    const suback = await client.subscribe({
      subscriptions: [
        { qos: mqtt5.QoS.AtLeastOnce, topicFilter: qos1Topic },
        { qos: mqtt5.QoS.AtMostOnce, topicFilter: qos0Topic },
      ],
    });
    console.log("Suback result: " + JSON.stringify(suback));

    const qos0PublishResult = await client.publish({
      qos: mqtt5.QoS.AtMostOnce,
      topicName: qos0Topic,
      payload: "This is a qos 0 payload",
    });
    console.log("QoS 0 Publish result: " + JSON.stringify(qos0PublishResult));

    const qos1PublishResult = await client.publish({
      qos: mqtt5.QoS.AtLeastOnce,
      topicName: qos1Topic,
      payload: "This is a qos 1 payload",
    });
    console.log("QoS 1 Publish result: " + JSON.stringify(qos1PublishResult));

    let unsuback = await client.unsubscribe({
      topicFilters: [qos0Topic],
    });
    console.log("Unsuback result: " + JSON.stringify(unsuback));
  }

  useEffect(() => {
    testSuccessfulConnection();
  }, [credentials]);

  //   async function PublishMessage() {
  //     const msg = `BUTTON CLICKED {${user_msg_count}}`;
  //     const publishResult = await client
  //       .publish({
  //         qos: mqtt5.QoS.AtLeastOnce,
  //         topicName: qos1Topic,
  //         payload: msg,
  //       })
  //       .then(() => {
  //         console.log("");
  //       })
  //       .catch((error) => {
  //         console.log("");
  //       });
  //     user_msg_count++;
  //   }

  //   async function CloseConnection() {
  //     const disconnection = once(client, "disconnection");
  //     const stopped = once(client, "stopped");

  //     client.stop();

  //     await disconnection;
  //     await stopped;
  //   }

  return (
    <>
      {/* <div>
        <button onClick={() => PublishMessage()}>Publish A Message</button>
      </div>
      <div>
        <button onClick={() => CloseConnection()}>Disconnect</button>
      </div>
      <div id="message">Mqtt5 Pub Sub Sample</div> */}
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    credentials: state.authentication.credentials,
  };
};

export default connect(mapStateToProps)(Mqtt5);
