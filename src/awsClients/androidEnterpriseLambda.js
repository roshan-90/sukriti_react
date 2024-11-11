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
      Payload: "{ " + '"projectId": "' + "android-management-425406" + '"' + "}",
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

export function executeCreateEnterpriseAndroidManagementLambda(credentials, isChecked) {
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
      Payload: "{ " + '"isChecked": "' + isChecked + '"' + "}",

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


// Cabin fetch 

export function executelistIotCabinDynamicLambda(
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
      FunctionName: "Enterprise_Crud_Iot_Cabin",
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

export function executelistListUserTypeLambda(
  userName,
  credentials,
  value,
  command,
  cabinType
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
      FunctionName: "Enterprise_Crud_Iot_Cabin",
      Payload: "{ " + '"userName": "' + userName + '",' +
      '"command": "' + command +
      '",' + '"value": "' + value +
      '",' + '"cabin_type": "' + cabinType +
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

export function executeCreateCabinLambda(
  userName,
  credentials,
  command,
  value,
  object
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
      FunctionName: "Enterprise_Crud_Iot_Cabin",
      Payload:  '{ "' + 'userName": "' + userName + '",' +
      '"command": "' + command +
      '",' + '"value": { "Attributes": ' + JSON.stringify(value) +
      ',"Name": "' + object.name + '"' + ',"DefaultClientId": "' + object.DefaultClientId + '"' + 
      ',"ThingGroup": "' + object.ThingGroup + '"' + ',"ThingType": "' + object.ThingType + '"' +
      '}' + "}",
    };
    console.log('executeCreateCabinLambda pullParams',pullParams);
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

export function executeSaveDevicesLambda(
  credentials,
  object
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+ object.command,
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enrollment_device_crud_details",
      Payload: JSON.stringify({
        serial_number: object.serial_number,
        command: object.command,
        cabin_name: object.cabin_name,
        complex_details: object.complex_details,
        extra_details: object.extra_details,
        cabin_details: object.cabin_details,
        enterpriseId: object.enterpriseId
      })
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

export function executeListPolicyLambda(
  credentials,
  enterprise_id,
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprises_List_Policies_Android_Management",
      Payload: JSON.stringify({
        enterprises_id: enterprise_id
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


export function executelistProvisionLambda(
  credentials,
  object
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+ 
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Create_QR_API",
      Payload: "{ " + '"name": "' + object.name + '",' +
      '"policy_name": "' + object.policy_name +
      '",' + '"serial_number": "' + object.serial_number +
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

export function executeUpdateDeviceLambda(
  credentials,
  object,
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    let details_type_value = object.details_type;
    var pullParams = {
      FunctionName: "Enrollment_device_crud_details",
      Payload: JSON.stringify({
        serial_number: object.serial_number,
        command: object.command,
        details_type: details_type_value,
        [details_type_value]: object.value
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

export function executeUpdateEnterpriseLambda(
  credentials,
  object
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    let object_key = object.object_key;
    var pullParams = {
      FunctionName: "Android_Management_Device",
      Payload: JSON.stringify({
        enterpriseId: object.enterpriseId,
        command: object.command,
        updateMask: object_key,
        updateBody: {
          [object_key]: object.value,
          contactInfo: object.contactInfo
        }
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

export function executeListDeviceLambda(
  credentials,
  object,
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Android_Management_Device",
      Payload: JSON.stringify({
        enterpriseId: object.enterpriseId,
        command: object.command,
        complex: object.complex
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

export function executeDeleteDeviceLambda(
  credentials,
  object,
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });

    console.log('object',object);

    if(object.abandonDevice == false) {
      var pullParams = {
        FunctionName: "Android_Management_Device",
        Payload: JSON.stringify({
          enterpriseId: object.enterpriseId,
          command: object.command,
          abandonDevice: object.abandonDevice,
          value: object.value
        })
      };
    } else {
      var pullParams = {
        FunctionName: "Android_Management_Device",
        Payload: JSON.stringify({
          enterpriseId: object.enterpriseId,
          command: object.command,
          abandonDevice: object.abandonDevice,
          value: object.value
        })
      };
    }

    console.log('pullPrams',pullParams);
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

export function executePatchDeviceLambda(
  credentials,
  object,
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Android_Management_Device",
      Payload: JSON.stringify({
        command : object.command,
        serial_number: object.serial_number,
        deviceId : object.deviceId,
        enterpriseId: object.enterpriseId,
        requestBody: {
          state: object.requestBody.state,
          policyName: object.requestBody.policyName,
          disabledReason : {
            localizedMessages: {
              name: object.requestBody.name
            },
            defaultMessage: "Disabled Reason is default Message"
          }
        }
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

export function executeCreatePolicyLambda(
  credentials,
  object,
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprises_Create_Policies_Android_Management",
      Payload: JSON.stringify({
        enterprises_id: object.enterprises_id,
        policy_name: "policies/"+object.policy_name,
        field_to_patch: object.field_to_patch
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

export function executePolicyDetailsLambda(
  credentials,
  object,
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprises_get_Policies_Android_Management",
      Payload: JSON.stringify({
        enterprises_id: object.enterprises_id,
        policy_name: "policies/"+ object.policy_name,
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

export function executePolicyDeleteLambda(
  credentials,
  enterprises_id,
  policy_name
) {
  return new Promise(function (resolve, reject) {
    console.log(
      "credentials "+
      credentials
    );
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Enterprises_Delete_Policies_Android_Management",
      Payload: JSON.stringify({
        policyName: `${enterprises_id}/policies/${policy_name}`,
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

export function executeDeleteComplexLambda(
  userName,
  credentials,
  command,
  complex,
  enterpriseId
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
        complex: complex,
        enterpriseId: enterpriseId
      })
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

export function executeVerifyPackageNameLambda(
  userName,
  credentials,
  packageName,
  enterpriseId
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "VerifyPackageName",
      Payload: JSON.stringify({
        userName: userName,
        packageName: packageName,
        EnterpriseId: enterpriseId
      })
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

export function executeShareQrLambda(
  credentials,
  email,
  qr,
  serialNumber
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "shareQR",
      Payload: JSON.stringify({
        email: email,
        qr: qr,
        serial_number: serialNumber
      })
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

export function executeKioskDeviceLambda(
  credentials,
  object
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Android_Management_Device",
      Payload: JSON.stringify({
        command: object.command,
        serial_number: object.serial_number,
        kiosk_device: object.kiosk_device
      })
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

export function executeEnterpriseGetLambda(
  credentials,
  enterpriseId
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Get_Enterprises_Android_Management",
      Payload: JSON.stringify({
        enterpriseId: enterpriseId,
      })
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

export function executeReintiate_DEVICE_PROV_GET_INFO_RESP_INITLambda(
  credentials,
  object
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Android_Management_Device",
      Payload: JSON.stringify({
        command: object.command,
        topic: object.topic,
        serial_number: object.serial_number,
      })
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

export function executeSoftDeleteEnterpriseLambda(
  credentials,
  name
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "Soft_delete_enterprise",
      Payload: JSON.stringify({
        name: name,
        soft_delete: "true",
      })
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

export function executeUndoSoftDeleteEnterpriseLambda(
  credentials,
  name
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "undo_soft_delete_enterprise",
      Payload: JSON.stringify({
        name: name,
        soft_delete: "false",
      })
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

export function executedFetchListLogoLambda(
  credentials,
  name
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "fetchClientLogo",
      Payload: JSON.stringify({
        client: name
      })
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

export function executedFetchListWIFILambda(
  credentials
) {
  return new Promise(function (resolve, reject) {
    var lambda = new AWS.Lambda({
      region: "ap-south-1",
      apiVersion: "2015-03-31",
      credentials: credentials, // Pass the credentials from the Redux store
    });
    var pullParams = {
      FunctionName: "fetchWifiDetails"
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