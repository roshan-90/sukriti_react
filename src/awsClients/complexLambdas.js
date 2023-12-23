import AWS from "aws-sdk";
import Result from "../Entity/Result";

export function executeGetComplexCompositionLambda(complexName, credentials) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_getComplexComposition",
      Payload: "{ " + '"complexName": "' + complexName + '"' + "}",
    };
    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        if (pullResults.status != 1) reject(pullResults);
        else resolve(pullResults.complexComposition);
      }
    });
  });
}

export function executeGetCabinDetailsLambda(
  cabinThingName,
  credentials,
  CLIENT
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_getCabinDetails",
      Payload:
        "{ " +
        '"cabinThingName": "' +
        cabinThingName +
        '",' +
        '"CLIENT": "' +
        CLIENT +
        '"' +
        "}",
    };
    console.log("_fetchCabinDetails2", pullParams);

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        if (pullResults.status != 1) reject(pullResults);
        else resolve(pullResults);
      }
    });
  });
}

export function executePublishConfigLambda(
  topic,
  config,
  metadata,
  credentials
) {
  return new Promise(function (resolve, reject) {
    var payload = { topic: topic, payload: config, info: metadata };

    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_publish_config",
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

// QUICK_CONFIG

export function executePublishConfigGenericLambda(topic, config, metadata) {
  return new Promise(function (resolve, reject) {
    var payload = { topic: topic, payload: config, info: metadata };

    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
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

export function executePublishCommandLambda(
  topic,
  config,
  metadata,
  credentials
) {
  return new Promise(function (resolve, reject) {
    var payload = { topic: topic, payload: config, info: metadata };

    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_publish_command",
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

export function executeGetBWTComplexCompositionLambda(
  cabinThingName,
  credentials,
  CLIENT
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_administration_BWT_getCabinDetails",
      Payload:
        "{ " +
        '"cabinThingName": "' +
        cabinThingName +
        '",' +
        '"CLIENT": "' +
        CLIENT +
        '"' +
        "}",
    };
    console.log("_fetchCabinDetails2", pullParams);

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        if (pullResults.status != 1) reject(pullResults);
        else resolve(pullResults);
      }
    });
  });
}
