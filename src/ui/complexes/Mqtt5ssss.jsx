import React, { useEffect, useState } from "react";
import { mqtt5, auth, iot } from "aws-iot-device-sdk-v2";
import { once } from "events";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
// import { toUtf8 } from "@aws-sdk/util-utf8-browser";

const AWS_REGION = "your_aws_region_here";
const IDENTITY_POOL_ID = "your_identity_pool_id_here";

function log(msg) {
  let now = new Date();
}

class AWSCognitoCredentialsProvider extends auth.CredentialsProvider {
  constructor(options, expire_interval_in_ms) {
    super();
    this.options = options;

    setInterval(async () => {
      await this.refreshCredentials();
    }, expire_interval_in_ms ?? 3600 * 1000);
  }

  async refreshCredentials() {
    log("Fetching Cognito credentials");
    const cachedCredentials = await fromCognitoIdentityPool({
      identityPoolId: this.options.IdentityPoolId,
      clientConfig: { region: this.options.Region },
    })();
    this.cachedCredentials = cachedCredentials;
  }

  getCredentials() {
    return {
      aws_access_id: this.cachedCredentials?.accessKeyId ?? "",
      aws_secret_key: this.cachedCredentials?.secretAccessKey ?? "",
      aws_sts_token: this.cachedCredentials?.sessionToken,
      aws_region: this.options.Region,
    };
  }
}

function createClient(provider) {
  let wsConfig = {
    credentialsProvider: provider,
    region: AWS_REGION,
  };

  let builder =
    iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
      "a372gqxqbver9r-ats.iot.ap-south-1.amazonaws.com",
      wsConfig
    );

  let client = new mqtt5.Mqtt5Client(builder.build());

  client.on("error", (error) => {
    log("Error event: " + error.toString());
  });

  // ... Other event listeners ...

  return client;
}

function Mqtt5ssss() {
  const [client, setClient] = useState(null);
  const qos1Topic = "/test/qos1";
  var user_msg_count = 0;
  const qos0Topic = "/test/qos0";

  async function testSuccessfulConnection() {
    const provider = new AWSCognitoCredentialsProvider({
      IdentityPoolId: IDENTITY_POOL_ID,
      Region: AWS_REGION,
    });
    await provider.refreshCredentials();

    const mqttClient = createClient(provider);
    setClient(mqttClient);

    const attemptingConnect = once(mqttClient, "attemptingConnect");
    const connectionSuccess = once(mqttClient, "connectionSuccess");

    mqttClient.start();

    await attemptingConnect;
    await connectionSuccess;

    // ... Subscribe and publish logic ...
    const suback = await client.subscribe({
      subscriptions: [
        { qos: mqtt5.QoS.AtLeastOnce, topicFilter: qos1Topic },
        { qos: mqtt5.QoS.AtMostOnce, topicFilter: qos0Topic },
      ],
    });
    log("Suback result: " + JSON.stringify(suback));

    const qos0PublishResult = await client.publish({
      qos: mqtt5.QoS.AtMostOnce,
      topicName: qos0Topic,
      payload: "This is a qos 0 payload",
    });
    log("QoS 0 Publish result: " + JSON.stringify(qos0PublishResult));

    const qos1PublishResult = await client.publish({
      qos: mqtt5.QoS.AtLeastOnce,
      topicName: qos1Topic,
      payload: "This is a qos 1 payload",
    });
    log("QoS 1 Publish result: " + JSON.stringify(qos1PublishResult));

    let unsuback = await client.unsubscribe({
      topicFilters: [qos0Topic],
    });
    log("Unsuback result: " + JSON.stringify(unsuback));
  }

  useEffect(() => {
    testSuccessfulConnection();
  }, []);

  async function PublishMessage() {
    const msg = `BUTTON CLICKED {${user_msg_count}}`;
    const publishResult = await client
      .publish({
        qos: mqtt5.QoS.AtLeastOnce,
        topicName: qos1Topic,
        payload: msg,
      })
      .then(() => {
        log("Button Clicked, Publish result: " + JSON.stringify(publishResult));
      })
      .catch((error) => {
        log(`Error publishing: ${error}`);
      });
    user_msg_count++;
  }

  async function CloseConnection() {
    const disconnection = once(client, "disconnection");
    const stopped = once(client, "stopped");

    client.stop();

    await disconnection;
    await stopped;
  }

  return (
    <>
      <div>
        <button onClick={() => PublishMessage()}>Publish A Message</button>
      </div>
      <div>
        <button onClick={() => CloseConnection()}>Disconnect</button>
      </div>
      <div id="message">Mqtt5 Pub Sub Sample</div>
    </>
  );
}

export default Mqtt5ssss;
