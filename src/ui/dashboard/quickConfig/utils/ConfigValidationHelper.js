import ConfigValidationResult from "../../../../Entity/DataModels/ConfigValidationResult";
import {
  QuickConfigTabs,
  PUB_TOPIC,
} from "../../../../nomenclature/nomenclature";

export function validateConfigData(configType, configData) {
  console.log("_validateConfigData", configType);
  if (configType == QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG) {
    return validateUsageChargeConfig(configData[configType]);
  }

  return ConfigValidationResult(false, "configType matches none");
}

export function getLambdaPayload(configType, configData, userDetails) {
  if (configType == QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG) {
    return getLambdaPayloadForUsageChargeConfig(
      configData[configType],
      userDetails
    );
  }
}

export function getPublishTopicName(configType, configData) {
  var START = "TEST/"; //"TOILETS/"
  var topicPrefixClient = START + configData[configType].configClient + "/";
  var topics = {};
  topics[PUB_TOPIC.CLIENT_TOPIC_GENERIC] =
    topicPrefixClient + "TOPIC_SSF_READ_CLIENT_TOPIC";
  topics[PUB_TOPIC.CMS_CONFIG_GENERIC] =
    topicPrefixClient + "TOPIC_SSF_READ_CMS_CONFIG";
  topics[PUB_TOPIC.UCEMS_CONFIG_GENERIC] =
    topicPrefixClient + "TOPIC_SSF_READ_UCEMS_CONFIG";
  topics[PUB_TOPIC.ODS_CONFIG_GENERIC] =
    topicPrefixClient + "TOPIC_SSF_READ_ODS_CONFIG";
  topics[PUB_TOPIC.BWT_CONFIG_GENERIC] =
    topicPrefixClient + "TOPIC_SSF_READ_BWT_CONFIG";

  var topicReference = undefined;
  if (configType == QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG) {
    topicReference = PUB_TOPIC.UCEMS_CONFIG_GENERIC;
  }

  var topic = topics[topicReference];
  return topic;
}

function validateUsageChargeConfig(configData) {
  console.log("_validateConfigData", "UsageCharge", configData);

  if (configData === undefined)
    return ConfigValidationResult(false, "No config parametrs set");
  if (configData.configClient === undefined)
    return ConfigValidationResult(
      false,
      "Config parametr ::Client not selected"
    );
  if (configData.configScope === undefined)
    return ConfigValidationResult(
      false,
      "Config parametr ::Config Scope not selected"
    );

  var isAnyConfigScopeSelected = false;
  Object.keys(configData.configScope).forEach(function (key, index) {
    isAnyConfigScopeSelected =
      isAnyConfigScopeSelected || configData.configScope[key];
  });
  if (!isAnyConfigScopeSelected)
    return ConfigValidationResult(
      false,
      "Config parametr ::Config Scope not selected, none checked"
    );

  if (configData["id_usageCharge"] === undefined)
    return ConfigValidationResult(
      false,
      "Config parametr ::Usage-Charge not selected"
    );

  if (configData["id_paymentMode"] === undefined)
    return ConfigValidationResult(
      false,
      "Config parametr ::Payment-Mode not selected"
    );

  return ConfigValidationResult(true, "");
}

function getLambdaPayloadForUsageChargeConfig(configData, userDetails) {
  console.log("_lambdaPayload", "Usage Charge", configData);
  console.log("_lambdaPayload", "Usage Charge", userDetails);

  var selectedCabinTypes = getSelectedCabinTypes(configData);
  var lambdaPayload = [];
  var lambdaPayloadInfo = [];
  selectedCabinTypes.forEach((cabinType, index) => {
    var payload = {};
    payload["Entrychargeamount"] = configData["id_usageCharge"];
    payload["Cabinpaymentmode"] = configData["id_paymentMode"];
    payload["THING_NAME"] = configData["configClient"] + "_ALL";
    payload["cabin_type"] = cabinType;
    payload["user_type"] = getLambdaPayloadUserType(cabinType);
    lambdaPayload.push(payload);

    lambdaPayloadInfo.push(
      getGenericConfigInfo(
        "UCEMS/USAGE-CHARGE",
        cabinType,
        configData["configClient"],
        userDetails
      )
    );
  });

  return { lambdaPayload: lambdaPayload, lambdaPayloadInfo: lambdaPayloadInfo };
}

function getGenericConfigInfo(
  configType,
  cabinType,
  targetClient,
  userDetails
) {
  var payload = {};
  payload["configType"] = configType;
  payload["user"] = userDetails.userName;
  payload["client"] = targetClient;
  payload["targetType"] = "Client";
  payload["targetSubType"] = cabinType;
  payload["targetName"] = targetClient;

  return payload;
}

function getSelectedCabinTypes(configData) {
  var selectedCabinTypes = [];
  if (configData.configScope["CabinType.MWC"]) {
    selectedCabinTypes.push("MWC");
  }
  if (configData.configScope["CabinType.FWC"]) {
    selectedCabinTypes.push("FWC");
  }
  if (configData.configScope["CabinType.PD"]) {
    selectedCabinTypes.push("PWC");
  }
  if (configData.configScope["CabinType.MUR"]) {
    selectedCabinTypes.push("MUR");
  }

  return selectedCabinTypes;
}

function getLambdaPayloadUserType(cabinType) {
  var payLoadUserType = "undefined";
  if (cabinType == "MWC") {
    payLoadUserType = "MALE";
  } else if (cabinType == "FWC") {
    payLoadUserType = "FEMALE";
  } else if (cabinType == "PWC") {
    payLoadUserType = "PD";
  } else if (cabinType == "MUR") {
    payLoadUserType = "MALE";
  }

  return payLoadUserType;
}
