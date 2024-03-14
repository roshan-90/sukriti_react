import AWS from "aws-sdk";
import Result from "../Entity/Result";

export function executelistEnterprisesAndroidManagementLambda(credentials) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials-executelistEnterprisesAndroidManagementLambda",
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "List_Enterprises_Android_Management",
      Payload: "{ " + '"projectId": "' + "ssf-admin-399810" + '"' + "}",
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        resolve(pullResults);
      }
    });
  });
}

export function executelistDevicesAndroidManagementLambda(
  enterpriseId,
  credentials
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials-executelistDevicesAndroidManagementLambda",
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "List_Devices_Android_Management",
      Payload: "{ " + '"enterpriseId": "' + enterpriseId + '"' + "}",
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        resolve(pullResults);
      }
    });
  });
}

export function executeCreateEnterpriseAndroidManagementLambda(credentials) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials-executelistDevicesAndroidManagementLambda",
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Create_Enterprises_API",
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        resolve(pullResults);
      }
    });
  });
}