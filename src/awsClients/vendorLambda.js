import AWS from "aws-sdk";
import Result from "../Entity/User/Result";

export function executeReadVendorLambda(userName, credentials) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_create_vendor",
      Payload: '{ "action": "actionGetVendor", "userName":"' + userName + '" }',
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status != 1) reject(pullResults);
        else resolve(pullResults);
      }
    });
  });
}

export function executeCreateVendorLambda(vendorDetailsData, credentials) {
  return new Promise(function (resolve, reject) {
    var payload = { action: "actionCreateVendor", payload: vendorDetailsData };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_create_vendor",
      Payload: JSON.stringify(payload),
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        // if (pullResults.status != 1) reject(pullResults);
        resolve(pullResults);
      }
    });
  });
}

export function executeDeleteVendorLambda(vendorDetailsData, credentials) {
  return new Promise(function (resolve, reject) {
    var payload = { action: "actionDeleteVendor", payload: vendorDetailsData };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_create_vendor",
      Payload: JSON.stringify(payload),
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status != 1) reject(pullResults);
        else resolve(pullResults);
      }
    });
  });
}

export function executeUpdateVendorLambda(vendorDetailsData, credentials) {
  var payload = { action: "actionUpdateVendor", payload: vendorDetailsData };
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_create_vendor",
      Payload: JSON.stringify(payload),
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status != 1) reject(pullResults);
        else resolve(pullResults);
      }
    });
  });
}

export function executelistVendorAdminsLambda(credentials) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_list_vendorAdmins",
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

export function executeRazorpayLambda(vendorDetailsData, credentials) {
  return new Promise(function (resolve, reject) {
    var payload = { action: "linkedAccount", payload: vendorDetailsData };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "razorpay_webhook",
      Payload: JSON.stringify(payload),
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        // if (pullResults.status != 1) reject(pullResults);
        resolve(pullResults);
      }
    });
  });
}
