import NameValue from "../../../Entity/NameValue";
//Images
import healthOk from "../../../assets/img/icons/ic_health_ok.png";
import healthFault from "../../../assets/img/icons/ic_health_fault.png";
import healthNotInstalled from "../../../assets/img/icons/ic_health_feature_unavailable.png";
import moment from "moment";

export function getBWTCabinHealthData(rawData) {
  var healthList = [];

  if (rawData.uiResult.alp === "true") {
    var value = rawData.cabinHealth.data["ALPValveHealth"];
    healthList.push(
      new NameValue("ALP", getStatusName(value), getStatusIcon(value))
    );
  }
  if (rawData.uiResult.mp1_valve === "true") {
    value = rawData.cabinHealth.data["MP1ValveHealth"];
    healthList.push(
      new NameValue("MP1 Valve", getStatusName(value), getStatusIcon(value))
    );
  }
  if (rawData.uiResult.mp2_valve === "true") {
    value = rawData.cabinHealth.data["MP2ValveHealth"];
    healthList.push(
      new NameValue("MP2 Valve", getStatusName(value), getStatusIcon(value))
    );
  }
  if (rawData.uiResult.mp3_valve === "true") {
    value = rawData.cabinHealth.data["MP3ValveHealth"];
    healthList.push(
      new NameValue("MP3 Valve", getStatusName(value), getStatusIcon(value))
    );
  }
  if (rawData.uiResult.mp4_valve === "true") {
    value = rawData.cabinHealth.data["MP4ValveHealth"];
    healthList.push(
      new NameValue("MP4 Valve", getStatusName(value), getStatusIcon(value))
    );
  }

  value = rawData.cabinHealth.data["BlowerHealth"];
  healthList.push(
    new NameValue("Blower", getStatusName(value), getStatusIcon(value))
  );
  value = rawData.cabinHealth.data["FailsafeHealth"];
  healthList.push(
    new NameValue("Fail Safe", getStatusName(value), getStatusIcon(value))
  );
  value = rawData.cabinHealth.data["FilterHealth"];
  healthList.push(
    new NameValue("Filter", getStatusName(value), getStatusIcon(value))
  );
  value = rawData.cabinHealth.data["OzonatorHealth"];
  healthList.push(
    new NameValue("Ozonator", getStatusName(value), getStatusIcon(value))
  );
  value = rawData.cabinHealth.data["PrimingValveHealth"];
  healthList.push(
    new NameValue("Priming Valve", getStatusName(value), getStatusIcon(value))
  );
  value = rawData.cabinHealth.data["PumpHealth"];
  healthList.push(
    new NameValue("Pump", getStatusName(value), getStatusIcon(value))
  );

  return healthList;
}

function getStatusIcon(status) {
  var statusIcons = {
    1: healthNotInstalled,
    2: healthFault,
    3: healthOk,
    0: healthNotInstalled,
  };

  return statusIcons[status];
}

function getStatusName(status) {
  var statusNames = {
    1: "Feature is not installed",
    2: "Fault detected in the unit",
    3: "Working fine",
    0: "Feature is not installed",
  };
  console.log("healthVal", status, statusNames[status]);
  return statusNames[status];
}

export function getUcemsConfigData(rawData) {
  var value = rawData["Entrychargeamount"];
  var entryCharge = new NameValue("Entry Charge", value);
  value = rawData["Cabinpaymentmode"];
  var paymentMode = new NameValue("Payment Mode", value);

  var criticalityConfig = [];
  value = rawData["Edis_airDryr"];
  criticalityConfig.push(new NameValue("Air Dryer", value));
  value = rawData["Edis_choke"];
  criticalityConfig.push(new NameValue("Choke", value));
  value = rawData["Edis_cms"];
  criticalityConfig.push(new NameValue("CMS", value));
  value = rawData["Edis_fan"];
  criticalityConfig.push(new NameValue("Fan", value));
  value = rawData["Edis_floor"];
  criticalityConfig.push(new NameValue("Floor", value));
  value = rawData["Edis_flush"];
  criticalityConfig.push(new NameValue("Flush", value));
  value = rawData["Edis_freshWtr"];
  criticalityConfig.push(new NameValue("Fresh Water", value));
  value = rawData["Edis_recWtr"];
  criticalityConfig.push(new NameValue("Recycled Water", value));
  value = rawData["Edis_light"];
  criticalityConfig.push(new NameValue("Light", value));
  value = rawData["Edis_lock"];
  criticalityConfig.push(new NameValue("Lock", value));
  value = rawData["Edis_ods"];
  criticalityConfig.push(new NameValue("ODS", value));
  value = rawData["Edis_tap"];
  criticalityConfig.push(new NameValue("Tap", value));

  var timerConfig = [];
  value = rawData["Exitdoortriggertimer"];
  timerConfig.push(new NameValue("Exit Door Trigger Timmer", value));
  value = rawData["Feedbackexpirytime"];
  timerConfig.push(new NameValue("Feedback Expiry Time", value));
  value = rawData["Occwaitexpirytime"];
  timerConfig.push(new NameValue("Occ Wait Expiry Time", value));
  value = rawData["Collexpirytime"];
  timerConfig.push(new NameValue("Collect Expiry Time", value));

  var data = {
    entryCharge: entryCharge,
    paymentMode: paymentMode,
    criticalityConfig: criticalityConfig,
    timerConfig: timerConfig,
  };
  console.log("_config", data);
  return data;
}

export function getKeyUcemsConfig(configNmae) {
  var ucemsKeyLambelMap = {};
  ucemsKeyLambelMap["Entry Charge"] = "Entrychargeamount";
  ucemsKeyLambelMap["Payment Mode"] = "Cabinpaymentmode";
  ucemsKeyLambelMap["Air Dryer"] = "Edis_airDryr";
  ucemsKeyLambelMap["Choke"] = "Edis_choke";
  ucemsKeyLambelMap["CMS"] = "Edis_cms";
  ucemsKeyLambelMap["Fan"] = "Edis_fan";
  ucemsKeyLambelMap["Floor"] = "Edis_floor";
  ucemsKeyLambelMap["Flush"] = "Edis_flush";
  ucemsKeyLambelMap["Fresh Water"] = "Edis_freshWtr";
  ucemsKeyLambelMap["Recycled Water"] = "Edis_recWtr";
  ucemsKeyLambelMap["Light"] = "Edis_light";
  ucemsKeyLambelMap["Lock"] = "Edis_lock";
  ucemsKeyLambelMap["ODS"] = "Edis_ods";
  ucemsKeyLambelMap["Tap"] = "Edis_tap";
  ucemsKeyLambelMap["Exit Door Trigger Timmer"] = "Exitdoortriggertimer";
  ucemsKeyLambelMap["Feedback Expiry Time"] = "Feedbackexpirytime";
  ucemsKeyLambelMap["Occ Wait Expiry Time"] = "Occwaitexpirytime";
  ucemsKeyLambelMap["Collect Expiry Time"] = "Collexpirytime";

  return ucemsKeyLambelMap[configNmae];
}

export function getPublishPayloadUcems(ucemsConfig, complex, cabin) {
  var payload = {};
  Object.keys(ucemsConfig.data).forEach(function (key) {
    payload[key] = ucemsConfig.data[key];
  });
  payload["THING_NAME"] = cabin.thingName;
  payload["cabin_type"] = getCabinType(cabin.shortThingName);
  payload["user_type"] = getUserType(cabin.shortThingName);

  return payload;
}

export function getPublishMetadata(configType, complex, cabin, user) {
  var payload = {};
  payload["configType"] = configType;
  payload["user"] = user.userName;
  payload["client"] = complex.client;
  payload["targetType"] = "Cabin";
  payload["targetSubType"] = cabin.shortThingName;
  payload["targetName"] = cabin.thingName;

  return payload;
}
export function getPublishMetaCommanddata(commandName, complex, cabin, user) {
  var payload = {};
  payload["commandName"] = commandName;
  payload["user"] = user.userName;
  payload["client"] = complex.client;
  payload["targetType"] = "Cabin";
  payload["targetSubType"] = cabin.shortThingName;
  payload["targetName"] = cabin.thingName;

  return payload;
}

export function getCmsConfigData(rawData) {
  var airDryerConfig = [];
  var value = rawData["Airdryerautoontimer"];
  airDryerConfig.push(new NameValue("Air Dryer Auto On Timer", value));
  value = rawData["Airdryerdurationtimer"];
  airDryerConfig.push(new NameValue("Air Dryer Duration Timer", value));

  var enabledConfig = [];
  value = rawData["Autoairdryerenabled"];
  enabledConfig.push(new NameValue("Auto Air Dryer Enabled", value));
  value = rawData["Autofanenabled"];
  enabledConfig.push(new NameValue("Auto Fan Enabled", value));
  value = rawData["Autofloorenabled"];
  enabledConfig.push(new NameValue("Auto Floor Enabled", value));
  value = rawData["Autofullflushenabled"];
  enabledConfig.push(new NameValue("Auto Full Flush Enabled", value));
  value = rawData["Autolightenabled"];
  enabledConfig.push(new NameValue("Auto Light Enabled", value));
  value = rawData["Autominiflushenabled"];
  enabledConfig.push(new NameValue("Auto Mini Flush Enabled", value));
  value = rawData["Autopreflush"];
  enabledConfig.push(new NameValue("Auto Pre Flush Enabled", value));

  var timerConfig = [];
  value = rawData["Exitafterawaytimer"];
  timerConfig.push(new NameValue("Exit After Away Time", value));
  value = rawData["Fanautoofftimer"];
  timerConfig.push(new NameValue("Fan Auto Off Time", value));
  value = rawData["Fanautoofftimer"];
  timerConfig.push(new NameValue("Fan Auto On Time", value));
  value = rawData["Floorcleandurationtimer"];
  timerConfig.push(new NameValue("Floor Clean Duration", value));
  value = rawData["fullflushactivationtimer"];
  timerConfig.push(new NameValue("Full Flush Activation Timer", value));
  value = rawData["fullflushdurationtimer"];
  timerConfig.push(new NameValue("Full Flush Duration Timer", value));
  value = rawData["Lightautoofftime"];
  timerConfig.push(new NameValue("Light Auto Off Timer", value));
  value = rawData["Lightautoontimer"];
  timerConfig.push(new NameValue("Light Auto On Timer", value));
  value = rawData["Miniflushactivationtimer"];
  timerConfig.push(new NameValue("Mini Flush Activation Timer", value));
  value = rawData["Miniflushdurationtimer"];
  timerConfig.push(new NameValue("Mini Flush Duration Timer", value));

  value = rawData["Floorcleancount"];
  var floorCleanCount = new NameValue("Floor Clean Count", value);

  return {
    airDryerConfig: airDryerConfig,
    enabledConfig: enabledConfig,
    timerConfig: timerConfig,
    floorCleanCount: floorCleanCount,
  };
}
export function getKeyCmsConfig(configNmae) {
  var cmsConfigJeyLabelMap = {};
  cmsConfigJeyLabelMap["Air Dryer Auto On Timer"] = "Airdryerautoontimer";
  cmsConfigJeyLabelMap["Air Dryer Duration Timer"] = "Airdryerdurationtimer";
  cmsConfigJeyLabelMap["Auto Air Dryer Enabled"] = "Autoairdryerenabled";
  cmsConfigJeyLabelMap["Auto Fan Enabled"] = "Autofanenabled";
  cmsConfigJeyLabelMap["Auto Floor Enabled"] = "Autofloorenabled";
  cmsConfigJeyLabelMap["Auto Full Flush Enabled"] = "Autofullflushenabled";
  cmsConfigJeyLabelMap["Auto Light Enabled"] = "Autolightenabled";
  cmsConfigJeyLabelMap["Auto Mini Flush Enabled"] = "Autominiflushenabled";
  cmsConfigJeyLabelMap["Auto Pre Flush Enabled"] = "Autopreflush";
  cmsConfigJeyLabelMap["Exit After Away Time"] = "Exitafterawaytimer";
  cmsConfigJeyLabelMap["Fan Auto Off Time"] = "Fanautoofftimer";
  cmsConfigJeyLabelMap["Fan Auto On Time"] = "Fanautoonftimer";
  cmsConfigJeyLabelMap["Floor Clean Duration"] = "Floorcleandurationtimer";
  cmsConfigJeyLabelMap["Full Flush Activation Timer"] =
    "fullflushactivationtimer";
  cmsConfigJeyLabelMap["Full Flush Duration Timer"] = "fullflushdurationtimer";
  cmsConfigJeyLabelMap["Light Auto Off Timer"] = "Lightautoofftime";
  cmsConfigJeyLabelMap["Light Auto On Timer"] = "Lightautoontimer";
  cmsConfigJeyLabelMap["Mini Flush Activation Timer"] =
    "Miniflushactivationtimer";
  cmsConfigJeyLabelMap["Mini Flush Duration Timer"] = "Miniflushdurationtimer";
  cmsConfigJeyLabelMap["Floor Clean Count"] = "Floorcleancount";

  return cmsConfigJeyLabelMap[configNmae];
}
export function getPublishPayloadCms(cmsConfig, complex, cabin) {
  var payload = {};
  Object.keys(cmsConfig.data).forEach(function (key) {
    payload[key] = cmsConfig.data[key];
  });
  payload["THING_NAME"] = cabin.thingName;
  payload["cabin_type"] = getCabinType(cabin.shortThingName);
  payload["user_type"] = getUserType(cabin.shortThingName);

  return payload;
}

export function getBwtConfigData(rawData) {
  console.log("_odsConfig", "bwtConfig", rawData);
  var bwtConfig = [];
  var value = rawData["backWashCount"];
  bwtConfig.push(new NameValue("Back Wash Count", value));
  value = rawData["blowerDosageFactor"];
  bwtConfig.push(new NameValue("Blower Dosage Factor", value));
  value = rawData["blowerHourlySec"];
  bwtConfig.push(new NameValue("Blower Hourly Sec", value));
  value = rawData["blowerMaxRunTime"];
  bwtConfig.push(new NameValue("Blower Max RunTime", value));
  value = rawData["blowerRestTime"];
  bwtConfig.push(new NameValue("Blower Rest RunTime", value));
  value = rawData["blowerTestTime"];
  bwtConfig.push(new NameValue("Blower Test Time", value));
  value = rawData["drainCount"];
  bwtConfig.push(new NameValue("Drain Count", value));
  value = rawData["filterType"];
  bwtConfig.push(new NameValue("Filter Type", value));
  value = rawData["ozonatorPriorityLevel"];
  bwtConfig.push(new NameValue("Ozonator Priority Level", value));
  value = rawData["ozonatorTestTime"];
  bwtConfig.push(new NameValue("Ozonator Test Time", value));
  value = rawData["pumpHighLevel"];
  bwtConfig.push(new NameValue("Pump High Level", value));
  value = rawData["pumpLowLevel"];
  bwtConfig.push(new NameValue("Pump Low Level", value));
  value = rawData["pumpTestTime"];
  bwtConfig.push(new NameValue("Pump TestTime", value));
  value = rawData["samplingRateTime"];
  bwtConfig.push(new NameValue("Sampling RateTime", value));
  value = rawData["svAlpDuration"];
  bwtConfig.push(new NameValue("SvAlp Duration", value));
  value = rawData["svTestTime"];
  bwtConfig.push(new NameValue("Sv Test Time", value));
  console.log("_odsConfig", bwtConfig);
  return { bwtConfig: bwtConfig };
}
export function getKeyBwtConfig(configNmae) {
  var bwtLabelKeyMap = {};
  bwtLabelKeyMap["Back Wash Count"] = "backWashCount";
  bwtLabelKeyMap["Blower Dosage Factor"] = "blowerDosageFactor";
  bwtLabelKeyMap["Blower Hourly Sec"] = "blowerHourlySec";
  bwtLabelKeyMap["Blower Max RunTime"] = "blowerMaxRunTime";
  bwtLabelKeyMap["Blower Rest Time"] = "blowerRestTime";
  bwtLabelKeyMap["Blower Test Time"] = "blowerTestTime";
  bwtLabelKeyMap["Drain Count"] = "drainCount";
  bwtLabelKeyMap["Filter Type"] = "filterType";
  bwtLabelKeyMap["Ozonator Priority Level"] = "ozonatorPriorityLevel";
  bwtLabelKeyMap["Ozonator Test Time"] = "ozonatorTestTime";
  bwtLabelKeyMap["Pump High Level"] = "pumpHighLevel";
  bwtLabelKeyMap["Pump Low Level"] = "pumpLowLevel";
  bwtLabelKeyMap["Pump TestTime"] = "pumpTestTime";
  bwtLabelKeyMap["Sampling RateTime"] = "samplingRateTime";
  bwtLabelKeyMap["SvAlp Duration"] = "svAlpDuration";
  bwtLabelKeyMap["Sv Test Time"] = "svTestTime";

  return bwtLabelKeyMap[configNmae];
}

export function getPublishPayloadBwt(bwtConfig, complex, cabin) {
  var payload = {};
  Object.keys(bwtConfig.data).forEach(function (key) {
    payload[key] = bwtConfig.data[key];
  });
  payload["THING_NAME"] = cabin.thingName;
  payload["cabin_type"] = getCabinType(cabin.shortThingName);
  payload["user_type"] = getUserType(cabin.shortThingName);

  return payload;
}

export function getBwtUsageProfileDisplayData(usageProfile) {
  var data = [];
  usageProfile.usageProfile.forEach((element) => {
    data.push({
      // 'Date': getUiDate(parseInt(element.DEVICE_TIMESTAMP)),
      // 'Time': getUiTime(parseInt(element.DEVICE_TIMESTAMP)),
      Date: moment(parseInt(element.DEVICE_TIMESTAMP)).format("D/M/YYYY"),
      Time: moment(parseInt(element.DEVICE_TIMESTAMP)).format("hh:mm:ss a"),
      "Cabin Type": getCabinType(element["SHORT_THING_NAME"]),
      "Transfer Pump": element["tpRunTime"],
      "Air Blower": element["airBlowerRunTime"],
      Ozonator: element["ozonatorRunTime"],
      "Filter State": element["filterState"],
      "Turbidity Value": element["turbidityLevel"],
      "Current Water": element["currentWaterLevel"],
      "Water Recycled": element["waterRecycled"],
    });
  });
  return data;
}

export function getBWTResetProfileDisplayData(resetProfile) {
  var data = [];

  resetProfile.forEach((element) => {
    data.push({
      Date: moment(parseInt(element.DEVICE_TIMESTAMP)).format("D/M/YYYY"),
      Time: moment(parseInt(element.DEVICE_TIMESTAMP)).format("hh:mm:ss a"),
      "Board ID": element["BoardId"],
      "Short Name": element["SHORT_THING_NAME"],
      "Reset Code": element["Resetsource"],
    });
  });
  return data;
}

function getUiDate(timestamp) {
  var u = new Date(timestamp);
  console.log("_getUiDate" + u);
  console.log("_getUiDate" + u.getUTCDate());
  console.log("_getUiDate" + u.getUTCMonth());
  console.log("_getUiDate" + u.getUTCFullYear());
  var dd = ("0" + u.getUTCDate()).slice(-2);
  var mm = ("0" + (u.getUTCMonth() + 1)).slice(-2);
  var yyyy = u.getUTCFullYear();

  return dd + "/" + mm + "/" + yyyy;
}

function getUiTime(timestamp) {
  var u = new Date(timestamp);

  var hh = ("0" + u.getUTCHours()).slice(-2);
  var mm = ("0" + u.getUTCMinutes()).slice(-2);
  var ss = ("0" + u.getUTCSeconds()).slice(-2);
  var ms = (u.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5);
  return hh + ":" + mm + ":" + ss;
}

function getCabinType(shortThingName) {
  if (shortThingName.toUpperCase().includes("bwt".toUpperCase())) return "BWT";
}

function getUserType(shortThingName) {
  if (shortThingName.toUpperCase().includes("mwc".toUpperCase())) return "Male";
  if (shortThingName.toUpperCase().includes("fwc".toUpperCase()))
    return "Female";
  if (shortThingName.toUpperCase().includes("pwc".toUpperCase())) return "PD";
  if (shortThingName.toUpperCase().includes("mur".toUpperCase())) return "Male";
}

export function getBwtTopicName(type, complex, cabin, complexHierarchy) {
  var stateCode = complexHierarchy.state;
  var districtCode = complexHierarchy.districtCode;
  var cityCode = complexHierarchy.cityCode;
  var clientName = complex.client;
  var complexName = complex.name;
  var thingName = cabin.thingName.substring(0, 7);

  var START = "TEST/"; //"TOILETS/"
  var topicPrefix =
    START +
    stateCode +
    "/" +
    districtCode +
    "/" +
    cityCode +
    "/" +
    clientName +
    "/" +
    complexName +
    "/" +
    thingName +
    "/";
  var topics = {};
  topics["BWT_CONFIG"] = topicPrefix + "TOPIC_SSF_WRITE_BWT_CONFIG ";
  topics["Command"] = topicPrefix + "TOPIC_SSF_COMMAND";

  return topics[type];
}

export function getBwtCommand(commandName) {
  var commandList = [];
  commandList.push(new NameValue("Pump", 0, 1));
  commandList.push(new NameValue("Blower", 2, 2));
  commandList.push(new NameValue("Clear Fault", 1, 3));
  commandList.push(new NameValue("Reset", 1, 4));

  var commanad = {};
  for (var i = 0; i < commandList.length; i++) {
    if (commandList[i].name === commandName) commanad = commandList[i];
  }

  return commanad;
}

export function getBwtCommandNames() {
  var commandList = [];
  commandList.push("Pump");
  commandList.push("Blower");
  commandList.push("Clear Fault");
  commandList.push("Reset");

  return commandList;
}

export function getBwtPublishPayloadCommand(
  command,
  commandData,
  complex,
  cabin
) {
  var payload = {};

  payload["commandName"] = command.name;
  payload["Commandtype"] = command.icon;
  payload["Commandaction"] = commandData.Action;
  payload["Commandtime"] = commandData.Duration;
  payload["command_override"] = commandData.Override;
  payload["THING_NAME"] = cabin.thingName;
  payload["cabin_type"] = getCabinType(cabin.shortThingName);
  payload["user_type"] = getUserType(cabin.shortThingName);

  return payload;
}
