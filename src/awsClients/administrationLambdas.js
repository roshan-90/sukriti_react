import AWS from "aws-sdk";
import Result from "../Entity/Result";

export function executelistTeamLambda(userName, credentials) {
  return new Promise(function (resolve, reject) {
    console.log("credentials-executelistTeamLambda", credentials);
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_listTeam",
      Payload: "{ " + '"userName": "' + userName + '"' + "}",
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

export function executelistClientsLambda(credentials) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: {
        accessKeyId: credentials?.accessKeyId,
        secretAccessKey: credentials?.secretAccessKey,
        sessionToken: credentials?.sessionToken,
      }, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_administration_listClients",
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

export function executeCreateUserLambda(
  createUserRequest,
  userDetails,
  credentials
) {
  // {
  //   "userName": "test_user_lambda",
  //   "temporaryPassword": "Changeme11!",
  //   "organisation": "SSF",
  //   "userRole": "ClientSuperAdmin",
  //   "clientName": "X",
  //   "groupName": "CLIENT_ADMIN",
  //   "adminName": "test_user_Admin",
  //   "adminRole": "Super Admin",
  //   "assignedBy": "test_user_Admin"
  // }

  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: {
        accessKeyId: credentials?.accessKeyId,
        secretAccessKey: credentials?.secretAccessKey,
        sessionToken: credentials?.sessionToken,
      },
    });
    var pullParams = {
      FunctionName: "mis_create_user",
      Payload:
        "{ " +
        '"userName": "' +
        createUserRequest.userName +
        '",' +
        '"temporaryPassword": "' +
        createUserRequest.tempPassword +
        '",' +
        '"organisation": "' +
        createUserRequest.organisationName +
        '",' +
        '"userRole": "' +
        createUserRequest.userRole +
        '",' +
        '"clientName": "' +
        createUserRequest.clientName +
        '",' +
        //'"groupName": "'+createUserRequest.userName+'",' +
        '"adminName": "' +
        userDetails.userName +
        '",' +
        '"adminRole": "' +
        userDetails.userRole +
        '",' +
        '"assignedBy": "' +
        userDetails.userName +
        '"' +
        "}",
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status !== 1)
          reject(
            new Result(-1, undefined, "Error Alert!", pullResults.message)
          );

        resolve(pullResults);
      }
    });
  });
}

export function executeGetUserDetailsLambda(userName, credentials) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: {
        accessKeyId: credentials?.accessKeyId,
        secretAccessKey: credentials?.secretAccessKey,
        sessionToken: credentials?.sessionToken,
      }, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_actions",
      Payload:
        '{ "action": "actionGetUserDetails", "userName":"' + userName + '" }',
    };

    console.log("_lambda", pullParams);
    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status !== 1) reject(pullResults);
        else resolve(pullResults.user);
      }
    });
  });
}

export function executeEnableUserLambda(userName) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_actions",
      Payload:
        '{ "action": "actionEnableUser", "userName":"' + userName + '" }',
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status !== 1) reject(pullResults);
        else resolve(pullResults.user);
      }
    });
  });
}

export function executeDisableUserLambda(userName) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_actions",
      Payload:
        '{ "action": "actionDisableUser", "userName":"' + userName + '" }',
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status !== 1) reject(pullResults);
        else resolve(pullResults.user);
      }
    });
  });
}

export function executeDeleteUserLambda(userName) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_actions",
      Payload:
        '{ "action": "actionDeleteUser", "userName":"' + userName + '" }',
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status !== 1) reject(pullResults);
        else resolve(pullResults.user);
      }
    });
  });
}

export function executeFetchCompletedUserAccessTree(userName, credentials) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_getCompletedAccessTree",
      Payload: '{"userName":"' + userName + '" }',
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status !== 1) reject(pullResults);
        else resolve(pullResults.accessTree);
      }
    });
  });
}

export function executeDefineUserAccessLambda(request) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
    });
    var pullParams = {
      FunctionName: "mis_administration_defineAccess",
      Payload: JSON.stringify(request),
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status !== 1) reject(pullResults);
        else resolve(pullResults.accessTree);
      }
    });
  });
}

export function getUserNameFromCredentials() {
  return new Promise(function (resolve, reject) {
    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider();

    cognitoIdentityServiceProvider.getUser({}, function (err, data) {
      if (err) {
        console.log("_getLoggedInUserName Error:", err);
        reject(err);
      } else {
        const userName = data.Username;
        resolve(userName);
      }
    });
  });
}

// export function getUserNameFromCredentials(accessKeyId, secretAccessKey, sessionToken, IdentityId) {
//   return new Promise(function (resolve, reject) {
//     var credentials = new AWS.Credentials({
//       accessKeyId: accessKeyId,
//       secretAccessKey: secretAccessKey,
//       sessionToken: sessionToken
//     });

//     var cognitoIdentity = new AWS.CognitoIdentity();
//     var params = {
//       IdentityId: IdentityId, // Adjust based on the structure of the credentials object
//     };

//     cognitoIdentity.describeIdentity(params, function (err, data) {
//       if (err) {
//         console.log('_cognitoIdentity Error:', err);
//         reject(err);
//       } else {
//         var userName = data.IdentityDescription.UserName;
//         resolve(userName);
//       }
//     });
//   });
// }

export function executeFetchDashboardLambda(
  userName,
  duration,
  complex,
  credentials
) {
  return new Promise(function (resolve, reject) {
    var request = { userName: userName, duration: duration, complex: complex };
    console.log("checking value executeFetchDashboardLambda-->", request);
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_fetchDateWaiseUsageData",
      Payload: JSON.stringify(request),
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

export function executePermissionUiLambda(config, credentials) {
  return new Promise(function (resolve, reject) {
    var payload = { payload: config };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_administration_ui",
      Payload: JSON.stringify(payload),
    };
    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        if (pullResults.result !== 1) reject(pullResults);
        else resolve(pullResults);
      }
    });
  });
}

export function executeFetchUILambda(CLIENT, credentials) {
  return new Promise(function (resolve, reject) {
    var request = { CLIENT: CLIENT };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: {
        accessKeyId: credentials?.accessKeyId,
        secretAccessKey: credentials?.secretAccessKey,
        sessionToken: credentials?.sessionToken,
      }, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_administration_getpermission_ui",
      Payload: JSON.stringify(request),
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
