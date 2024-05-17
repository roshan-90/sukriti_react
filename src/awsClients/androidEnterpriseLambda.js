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

export function executeDeleteEnterpriseAndroidManagementLambda(credentials,enterpriseId) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials-executeDeleteEnterpriseAndroidManagementLambda",
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "enterprise_delete_api",
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

export function executelistIotSingleLambda(
  userName,
  credentials,
  command
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials-" + command,
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprise_Crud_Iot_ComplexTree",
      Payload: "{ " + '"userName": "' + userName + '",' +
      '"command": "' + command +
      '"' + "}",
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

export function executelistIotDynamicLambda(
  userName,
  credentials,
  value,
  command
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+ command,
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprise_Crud_Iot_ComplexTree",
      Payload: "{ " + '"userName": "' + userName + '",' +
      '"command": "' + command +
      '",' + '"value": "' + value +
      '"' + "}",
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

export function executelistDDbCityLambda(
  userName,
  credentials,
  value,
  value1,
  command
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+ command,
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprise_Crud_Iot_ComplexTree",
      Payload: "{ " + '"userName": "' + userName + '",' +
      '"command": "' + command +
      '",' + '"stateCode": "' + value +
      '",' + '"districtCode": "' + value1 + '"' + "}",
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


export function executeUpdateComplexLambda(
  userName,
  credentials,
  command,
  value,
  complexName
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+ command,
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprise_Crud_Iot_ComplexTree",
      Payload:  '{ "' + 'userName": "' + "dev_000000" + '",' +
      '"command": "' + command +
      '",' + '"value": { "Attributes": ' + JSON.stringify(value) +
      ',"Name": "' + complexName + '"' +
      '}' + "}",
    };
    console.log('pullParams',pullParams);
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

export function executeAddDdbStateLambda(
  userName,
  credentials,
  command,
  value,
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+ command,
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprise_Crud_Iot_ComplexTree",
      Payload: JSON.stringify({
        userName: userName,
        command: command,
        attribute: value
      })
    };
    console.log('pullParams',pullParams);
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

export function executeAddBillingroupLambda(
  userName,
  credentials,
  command,
  value,
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+ command,
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprise_Crud_Iot_ComplexTree",
      Payload: JSON.stringify({
        userName: userName,
        command: command,
        Name: value.name,
        Description: value.description
      })
    };
    console.log('pullParams',pullParams);
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

export function executeClientGroupLambda(
  userName,
  credentials,
  command,
  value,
  Name,
  description
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+ command,
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprise_Crud_Iot_ComplexTree",
      Payload:  '{ "' + 'userName": "' + userName + '",' +
      '"command": "' + command +
      '",' + '"value": { "Attributes": ' + JSON.stringify(value) +
      ',"Name": "' + Name + '"' + ',"Description": "' + description + '"' +
      ',"Parent": "' + "ClientGroup" + '"' +
      '}' + "}",
    };
    console.log('executeClientGroupLambda pullParams',pullParams);
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

export function executeCreateComplexLambda(
  userName,
  credentials,
  command,
  value,
  name,
  parent
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+ command,
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprise_Crud_Iot_ComplexTree",
      Payload:  '{ "' + 'userName": "' + userName + '",' +
      '"command": "' + command +
      '",' + '"value": { "Attributes": ' + JSON.stringify(value) +
      ',"Name": "' + name + '"' + ',"Description": "' + "" + '"' + 
      ',"Parent": "' + parent + '"' +
      '}' + "}",
    };
    console.log('executeCreateComplexLambda pullParams',pullParams);
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
