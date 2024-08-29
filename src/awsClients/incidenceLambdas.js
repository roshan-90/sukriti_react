import AWS from "aws-sdk";

export function executeCreateTicketLambda(ticketDetailsData, credentials) {
  return new Promise(function (resolve, reject) {
    var ticketDetails = { ticketDetailsData: ticketDetailsData };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_create_ticket",
      Payload: JSON.stringify(ticketDetails),
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambdaTic", pullResults);
        resolve(pullResults);
      }
    });
  });
}

export function executeFetchIncidenceLambda(userId, userRole, credentials) {
  return new Promise(function (resolve, reject) {
    var request = { userId: userId, userRole: userRole };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_list_tickets_by_access",
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

export function executeUploadFileS3(ticketId, fileName, fileId, credentials) {
  return new Promise(function (resolve, reject) {
    const s3Client = new AWS.S3({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    const bucketParams = {
      Bucket: "mis-ticket-files",
      Key: ticketId + "/" + fileName,
      Body: fileId,
      ContentType: "image/jpeg",
    };
    s3Client.upload(bucketParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        console.log(data);
      }
    });
  });
}

export function getListingS3(complex, credentials) {
  return new Promise((resolve, reject) => {
    try {
      let params = {
        Bucket: "mis-ticket-files",
        MaxKeys: 1000,
        Prefix: complex,
      };
      const s3Client = new AWS.S3({
        region: "ap-south-1",
        apiVersion: "2015-03-31",
        credentials: credentials, // Pass the credentials from the Redux store
      });
      const allKeys = [];
      listAllKeys();
      function listAllKeys() {
        s3Client.listObjectsV2(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            var contents = data.Contents;
            contents.forEach(function (content) {
              allKeys.push(content.Key);
            });

            if (data.IsTruncated) {
              params.ContinuationToken = data.NextContinuationToken;
              console.log("get further list...");
              listAllKeys();
            } else {
              console.log(allKeys, "LAMDA-CALL");
              resolve(allKeys);
            }
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

export function executeTicketActionLambda(request, credentials) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_ticket_actions",
      Payload: JSON.stringify(request),
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        resolve(pullResults);
      }
    });
  });
}

export function executeFetchReportLambda(
  userName,
  duration,
  complex,
  credentials
) {
  return new Promise(function (resolve, reject) {
    var request = { userName: userName, duration: duration, complex: complex };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_report_fetchDateWaiseUsageData",
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

export function executeFetchReportLambda2(
  userName,
  clientName,
  duration,
  bwt,
  email,
  schedule,
  rateValue,
  rateUnit,
  scheduleDuration,
  endDate,
  startDate,
  ScheduleStartDate,
  ScheduleEndDate,
  usageStats,
  collectionStats,
  upiStats,
  feedbackStats,
  bwtStats,
  complex,
  credentials
) {
  return new Promise(function (resolve, reject) {
    var request = {
      userName: userName,
      clientName: clientName,
      duration: duration,
      bwt: bwt,
      email: email,
      schedule: schedule,
      rateValue: rateValue,
      rateUnit: rateUnit,
      scheduleDuration: scheduleDuration,
      startDate: startDate,
      endDate: endDate,
      scheduleStartDate: ScheduleStartDate,
      scheduleEndDate: ScheduleEndDate,
      usageStats: usageStats,
      collectionStats: collectionStats,
      upiStats: upiStats,
      feedbackStats: feedbackStats,
      bwtStats: bwtStats,
      complex: complex,
    };
    console.log("credentials check in incidenceLamdas", request);
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_report_api",
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
export function executeDeleteUserSchedulerLambda(userName, credentials) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_adminisatration_actions",
      Payload:
        '{ "action": "actionDeleteUserScheduler", "userName":"' +
        userName +
        '" }',
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambda", pullResults);
        if (pullResults.status != 1) reject(pullResults);
        else resolve(pullResults.user);
      }
    });
  });
}

export function executeProgressLambda(ticketId, credentials) {
  return new Promise(function (resolve, reject) {
    var request = { ticketId: ticketId };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_list_ticket_progress",
      Payload: JSON.stringify(request),
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambdaTic", pullResults);
        resolve(pullResults);
      }
    });
  });
}

export function executeFetchTeamListLambda(ticketDetailsData, credentials) {
  return new Promise(function (resolve, reject) {
    var ticketDetails = { ticketDetailsData: ticketDetailsData };
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "mis_list_ticket_team",
      Payload: JSON.stringify(ticketDetails),
    };

    lambda.invoke(pullParams, function (err, data) {
      if (err) {
        console.log("_lambda", err);
        reject(err);
      } else {
        var pullResults = JSON.parse(data.Payload);
        console.log("_lambdaTic", pullResults);
        resolve(pullResults);
      }
    });
  });
}
