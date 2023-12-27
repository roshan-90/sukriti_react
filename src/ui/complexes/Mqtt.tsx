/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
import { useEffect } from "react";
import { mqtt, iot, CrtError, auth } from "aws-crt/dist.browser/browser";
import { connect } from "react-redux";
import AWS from "aws-sdk";
import {
  AWS_REGION,
  IDENTITY_POOL_ID,
  AWS_IOT_ENDPOINT,
  IdentityProviderName,
} from "../../lib/environment";
import jquery from "jquery";
// const $: JQueryStatic = jquery;
/**
 * AWSCognitoCredentialOptions. The credentials options used to create AWSCongnitoCredentialProvider.
 */
interface AWSCognitoCredentialOptions {
  IdentityPoolId: string;
  Region: string;
  credentials: string;
}

/**
 * AWSCognitoCredentialsProvider. The AWSCognitoCredentialsProvider implements AWS.CognitoIdentityCredentials.
 *
 */
export class AWSCognitoCredentialsProvider extends auth.CredentialsProvider {
  private options: AWSCognitoCredentialOptions;
  private source_provider: AWS.CognitoIdentityCredentials;
  private aws_credentials: auth.AWSCredentials;
  constructor(
    options: AWSCognitoCredentialOptions,
    expire_interval_in_ms?: number
  ) {
    super();
    this.options = options;
    AWS.config.region = options.Region;
    this.source_provider = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: options.IdentityPoolId,
      Logins: {
        [IdentityProviderName]: options.credentials,
      },
    });
    this.aws_credentials = {
      aws_region: options.Region,
      aws_access_id: this.source_provider.accessKeyId,
      aws_secret_key: this.source_provider.secretAccessKey,
      aws_sts_token: this.source_provider.sessionToken,
    };

    setInterval(async () => {
      console.log("options.credentials", options.credentials);
      await this.refreshCredentialAsync();
    }, expire_interval_in_ms ?? 3600 * 1000);
  }

  getCredentials() {
    return this.aws_credentials;
  }

  async refreshCredentialAsync() {
    return new Promise<AWSCognitoCredentialsProvider>((resolve, reject) => {
      this.source_provider.get((err) => {
        if (err) {
          reject("Failed to get cognito credentials.");
        } else {
          this.aws_credentials.aws_access_id = this.source_provider.accessKeyId;
          this.aws_credentials.aws_secret_key =
            this.source_provider.secretAccessKey;
          this.aws_credentials.aws_sts_token =
            this.source_provider.sessionToken;
          this.aws_credentials.aws_region = this.options.Region;
          resolve(this);
        }
      });
    });
  }
}

async function connect_websocket(provider: auth.CredentialsProvider) {
  return new Promise<mqtt.MqttClientConnection>((resolve, reject) => {
    let config =
      iot.AwsIotMqttConnectionConfigBuilder.new_builder_for_websocket()
        .with_clean_session(true)
        .with_client_id("test123" + Math.floor(Date.now() / 1000))
        .with_endpoint(AWS_IOT_ENDPOINT)
        .with_credential_provider(provider)
        .with_use_websockets()
        .with_keep_alive_seconds(30)
        .build();

    console.log("Connecting websocket...");
    const client = new mqtt.MqttClient();
    console.log("new connection ...", client);

    const connection = client.new_connection(config);

    console.log("setup callbacks ...", connection);
    connection.on("connect", (session_present) => {
      resolve(connection);

      console.log("connection started:");
    });

    connection.on("interrupt", (error: CrtError) => {
      console.log("Connection interrupted: error=", error);
    });
    connection.on("resume", (return_code: number, session_present: boolean) => {
      console.log("Resumed: rc:", session_present);
      // log(` ${return_code} existing session: ${session_present}`);
    });
    connection.on("disconnect", () => {
      console.log("Disconnected");
    });
    connection.on("error", (error) => {
      console.log("error", error);
      reject(error);
    });
    console.log("connect...");
    connection.connect();
  });
}

function Mqtt311(props) {
  var connectionPromise: Promise<mqtt.MqttClientConnection>;
  var sample_msg_count = 0;
  var user_msg_count = 0;
  var test_topic = "$aws/events/presence/#";

  async function PubSub(props) {
    let credential = Object.values(props.credentials.params.Logins);
    console.log("props.credentials", credential);
    const valuesString = credential.join(", ");
    console.log("valuesString.valuesString", valuesString);

    /** Set up the credentialsProvider */
    const provider = new AWSCognitoCredentialsProvider({
      IdentityPoolId: IDENTITY_POOL_ID,
      Region: AWS_REGION,
      credentials: valuesString,
    });
    /** Make sure the credential provider fetched before setup the connection */
    await provider.refreshCredentialAsync();

    connectionPromise = connect_websocket(provider);

    connectionPromise
      .then((connection) => {
        console.log("start subscribe");
        connection
          .subscribe(test_topic, mqtt.QoS.AtLeastOnce, (topic, payload) => {
            const decoder = new TextDecoder("utf8");
            let message = decoder.decode(new Uint8Array(payload));

            console.log("Message received: topic", message);
            // log(`=\"${topic}\" message=\"${}\"`);
          })
          .then((subscription) => {
            console.log("start publish");
            connection.publish(
              test_topic,
              `THE SAMPLE PUBLISHES A MESSAGE EVERY MINUTE {${sample_msg_count}}`,
              subscription.qos
            );
            /** The sample is used to demo long-running web service. The sample will keep publishing the message every minute.*/
            setInterval(() => {
              sample_msg_count++;
              const msg = `THE SAMPLE PUBLISHES A MESSAGE EVERY MINUTE {${sample_msg_count}}`;
              connection.publish(test_topic, msg, subscription.qos);
            }, 60000);
          });
      })
      .catch((reason) => {
        console.log("Error while connecting:", reason);
      });
  }

  useEffect(() => {
    PubSub(props); //initial execution
  }, []);

  async function PublishMessage() {
    const msg = `BUTTON CLICKED {${user_msg_count}}`;
    connectionPromise.then((connection) => {
      connection
        .publish(test_topic, msg, mqtt.QoS.AtLeastOnce)
        .catch((reason) => {
          console.log("Error publishing:", reason);
        });
    });
    user_msg_count++;
  }

  async function CloseConnection() {
    await connectionPromise.then((connection) => {
      connection.disconnect().catch((reason) => {
        console.log("Error publishing:", reason);
      });
    });
  }

  return <></>;
}
const mapStateToProps = (state) => ({
  credentials: state.authentication.credentials, // Replace with the correct state path
  // Other mapStateToProps properties if needed
});

// ...
export default connect(mapStateToProps)(Mqtt311);
