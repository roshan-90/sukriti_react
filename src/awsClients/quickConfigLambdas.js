import AWS from "aws-sdk";
import Result from "../Entity/Result";

export function executePublishConfigLambda(credentials, topic, config, metadata) {
  return new Promise(function (resolve, reject) {
    var payload = { topic: topic, payload: JSON.stringify(config), info: JSON.stringify(metadata) };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials,
    });
    var pullParams = {
      FunctionName: "mis_publish_config_generic",
      Payload: JSON.stringify(payload),
    };
    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        if (pullResults.result != 1) reject(pullResults);
        else resolve(pullResults);
      }
    });
  });
}
