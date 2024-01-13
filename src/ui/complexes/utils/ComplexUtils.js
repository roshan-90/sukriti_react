import NameValue from "../../../Entity/NameValue";
//Images
import healthOk from "../../../assets/img/icons/ic_health_ok.png";
import healthFault from "../../../assets/img/icons/ic_health_fault.png";
import healthNotInstalled from "../../../assets/img/icons/ic_health_feature_unavailable.png";
import moment from "moment";

export function getCabinHealthData(rawData) {
  var healthList = [];
  if (rawData.uiResult.air_dryer_health === "true") {
    var value = rawData.cabinHealth.data["airDryerHealth"];
    healthList.push(
      NameValue("Air Dryer", getStatusName(value), getStatusIcon(value))
    );
  }
  if (rawData.uiResult.choke_health === "true") {
    value = rawData.cabinHealth.data["chokeHealth"];
    healthList.push(
      NameValue("Choke", getStatusName(value), getStatusIcon(value))
    );
  }
  if (rawData.uiResult.tap_health === "true") {
    value = rawData.cabinHealth.data["tapHealth"];
    healthList.push(
      NameValue("Tap", getStatusName(value), getStatusIcon(value))
    );
  }
  value = rawData.cabinHealth.data["fanHealth"];
  healthList.push(NameValue("Fan", getStatusName(value), getStatusIcon(value)));
  value = rawData.cabinHealth.data["floorCleanHealth"];
  healthList.push(
    NameValue("Floor Clean", getStatusName(value), getStatusIcon(value))
  );
  value = rawData.cabinHealth.data["flushHealth"];
  healthList.push(
    NameValue("Flush", getStatusName(value), getStatusIcon(value))
  );
  value = rawData.cabinHealth.data["lightHealth"];
  healthList.push(
    NameValue("Light", getStatusName(value), getStatusIcon(value))
  );
  value = rawData.cabinHealth.data["lockHealth"];
  healthList.push(
    NameValue("Lock", getStatusName(value), getStatusIcon(value))
  );
  value = rawData.cabinHealth.data["odsHealth"];
  healthList.push(NameValue("ODS", getStatusName(value), getStatusIcon(value)));

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
    1: "Feature is not available",
    2: "Fault detected in the unit",
    3: "Working fine",
    0: "Feature is not installed",
  };
  // console.log('healthVal', status, statusNames[status])
  return statusNames[status];
}

export function getUcemsConfigData(rawData) {
  var value = rawData["Entrychargeamount"];
  var entryCharge = NameValue("Entry Charge", value);
  value = rawData["Cabinpaymentmode"];
  var paymentMode = NameValue("Payment Mode", value);

  var criticalityConfig = [];
  value = rawData["Edis_airDryr"];
  criticalityConfig.push(NameValue("Air Dryer", value));
  value = rawData["Edis_choke"];
  criticalityConfig.push(NameValue("Choke", value));
  value = rawData["Edis_cms"];
  criticalityConfig.push(NameValue("CMS", value));
  value = rawData["Edis_fan"];
  criticalityConfig.push(NameValue("Fan", value));
  value = rawData["Edis_floor"];
  criticalityConfig.push(NameValue("Floor", value));
  value = rawData["Edis_flush"];
  criticalityConfig.push(NameValue("Flush", value));
  value = rawData["Edis_freshWtr"];
  criticalityConfig.push(NameValue("Fresh Water", value));
  value = rawData["Edis_recWtr"];
  criticalityConfig.push(NameValue("Recycled Water", value));
  value = rawData["Edis_light"];
  criticalityConfig.push(NameValue("Light", value));
  value = rawData["Edis_lock"];
  criticalityConfig.push(NameValue("Lock", value));
  value = rawData["Edis_ods"];
  criticalityConfig.push(NameValue("ODS", value));
  value = rawData["Edis_tap"];
  criticalityConfig.push(NameValue("Tap", value));

  var timerConfig = [];
  value = rawData["Exitdoortriggertimer"];
  timerConfig.push(NameValue("Exit Door Trigger Timmer", value));
  value = rawData["Feedbackexpirytime"];
  timerConfig.push(NameValue("Feedback Expiry Time", value));
  value = rawData["Occwaitexpirytime"];
  timerConfig.push(NameValue("Occ Wait Expiry Time", value));
  value = rawData["Collexpirytime"];
  timerConfig.push(NameValue("Collect Expiry Time", value));

  var data = {
    entryCharge: entryCharge,
    paymentMode: paymentMode,
    criticalityConfig: criticalityConfig,
    timerConfig: timerConfig,
  };
  // console.log('_config', data)
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
  payload["SendToDevic"] = "0";
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
  airDryerConfig.push(NameValue("Air Dryer Auto On Timer", value));
  value = rawData["Airdryerdurationtimer"];
  airDryerConfig.push(NameValue("Air Dryer Duration Timer", value));

  var enabledConfig = [];
  value = rawData["Autoairdryerenabled"];
  enabledConfig.push(NameValue("Auto Air Dryer Enabled", value));
  value = rawData["Autofanenabled"];
  enabledConfig.push(NameValue("Auto Fan Enabled", value));
  value = rawData["Autofloorenabled"];
  enabledConfig.push(NameValue("Auto Floor Enabled", value));
  value = rawData["Autofullflushenabled"];
  enabledConfig.push(NameValue("Auto Full Flush Enabled", value));
  value = rawData["Autolightenabled"];
  enabledConfig.push(NameValue("Auto Light Enabled", value));
  value = rawData["Autominiflushenabled"];
  enabledConfig.push(NameValue("Auto Mini Flush Enabled", value));
  value = rawData["Autopreflush"];
  enabledConfig.push(NameValue("Auto Pre Flush Enabled", value));

  var timerConfig = [];
  value = rawData["Exitafterawaytimer"];
  timerConfig.push(NameValue("Exit After Away Time", value));
  value = rawData["Fanautoofftimer"];
  timerConfig.push(NameValue("Fan Auto Off Time", value));
  value = rawData["Fanautoofftimer"];
  timerConfig.push(NameValue("Fan Auto On Time", value));
  value = rawData["Floorcleandurationtimer"];
  timerConfig.push(NameValue("Floor Clean Duration", value));
  value = rawData["fullflushactivationtimer"];
  timerConfig.push(NameValue("Full Flush Activation Timer", value));
  value = rawData["fullflushdurationtimer"];
  timerConfig.push(NameValue("Full Flush Duration Timer", value));
  value = rawData["Lightautoofftime"];
  timerConfig.push(NameValue("Light Auto Off Timer", value));
  value = rawData["Lightautoontimer"];
  timerConfig.push(NameValue("Light Auto On Timer", value));
  value = rawData["Miniflushactivationtimer"];
  timerConfig.push(NameValue("Mini Flush Activation Timer", value));
  value = rawData["Miniflushdurationtimer"];
  timerConfig.push(NameValue("Mini Flush Duration Timer", value));

  value = rawData["Floorcleancount"];
  var floorCleanCount = NameValue("Floor Clean Count", value);

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

export function getOdsConfigData(rawData) {
  // console.log('_odsConfig', 'odsConfig')
  var odsConfig = [];
  var value = rawData["Ambientfloorfactor"];
  odsConfig.push(NameValue("Ambient Floor Factor", value));
  value = rawData["Ambientseatfactor"];
  odsConfig.push(NameValue("Ambient Seat Factor", value));
  value = rawData["Seatfloorratio"];
  odsConfig.push(NameValue("Seat Floor Ratio", value));
  value = rawData["Seatthreshold"];
  odsConfig.push(NameValue("Seat Threshold", value));

  // console.log('_odsConfig', odsConfig)
  return { odsConfig: odsConfig };
}
export function getKeyOdsConfig(configNmae) {
  var odsLabelKeyMap = {};
  odsLabelKeyMap["Ambient Floor Factor"] = "Ambientfloorfactor";
  odsLabelKeyMap["Ambient Seat Factor"] = "Ambientseatfactor";
  odsLabelKeyMap["Seat Floor Ratio"] = "Seatfloorratio";
  odsLabelKeyMap["Seat Threshold"] = "Seatthreshold";

  return odsLabelKeyMap[configNmae];
}

export function getPublishPayloadOds(odsConfig, complex, cabin) {
  var payload = {};
  Object.keys(odsConfig.data).forEach(function (key) {
    payload[key] = odsConfig.data[key];
  });
  payload["SendToDevic"] = "0";
  payload["THING_NAME"] = cabin.thingName;
  payload["cabin_type"] = getCabinType(cabin.shortThingName);
  payload["user_type"] = getUserType(cabin.shortThingName);

  return payload;
}

export function getUsageProfileDisplayData(usageProfile) {
  var data = [];
  usageProfile.usageProfile.forEach((element) => {
    data.push({
      Date: moment(parseInt(element.DEVICE_TIMESTAMP)).format("D/M/YYYY"),
      Time: moment(parseInt(element.DEVICE_TIMESTAMP)).format("hh:mm:ss a"),
      "Cabin Type": getCabinType(element["SHORT_THING_NAME"]),
      Duration: element["Duration"],
      "Usage Charge": element["Amountcollected"],
      Feedback: element["feedback"],
      "Entry Type": element["Entrytype"],
      "Air Dryer": element["Airdryer"],
      "Fan Time": element["Fantime"],
      "Floor Clean": element["Floorclean"],
      "Full Flush": element["Fullflush"],
      "Manual Flush": element["Manualflush"],
      "Light Time": element["Lighttime"],
      "Mini Flush": element["Miniflush"],
      "Pre Flush": element["Preflush"],
      RFID: element["RFID"],
      // 'Client': element['CLIENT'],
      // 'Complex': element['COMPLEX'],
      // 'State': element['STATE'],
      // 'District': element['DISTRICT'],
      // 'City': element['CITY']
    });
  });
  return data;
}

export function getResetProfileDisplayData(resetProfile) {
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

export function getUpiPaymentDisplayData(upiProfile) {
  var data = [];

  upiProfile.forEach((element) => {
    data.push({
      Date: moment(parseInt(element.timestamp)).format("D/M/YYYY"),
      Time: moment(parseInt(element.timestamp)).format("hh:mm:ss a"),
      "Amount Received": element["amount_received"],
      "Amount Transferred": element["amount_transferred"],
      "Vendor Fee": element["vendor_fee"],
      "Sukriti Fee": element["sukriti_fee"],
      Tax: element["tax"],
      Vpa: element["vpa"],
    });
  });
  return data;
}

// 'Cabin Type': element.THING_NAME.includes("MWC")
//     ? "Male Cabin (MWC)"
//     : element.THING_NAME.includes("FWC") ? "Female Cabin (FWC)"
//         : element.THING_NAME.includes("PWC") ? "PD Cabin (PWC)"
//             : element.THING_NAME.includes("MUR") ? "Male Urinal (MUR)"
//                 : element.THING_NAME.includes("BWT") && "BWT Cabin",

export function getLiveStatusData(upiProfile) {
  var data = [];
  upiProfile.forEach((element) => {
    if (element != null)
      data.push({
        "Cabin Type": element.THING_NAME.includes("MWC")
          ? `Male Cabin (${element.THING_NAME.split("").slice(-7).join("")})`
          : element.THING_NAME.includes("FWC")
          ? `Female Cabin (${element.THING_NAME.split("").slice(-7).join("")})`
          : element.THING_NAME.includes("PWC")
          ? `PD Cabin (${element.THING_NAME.split("").slice(-7).join("")})`
          : element.THING_NAME.includes("MUR")
          ? `Male Urinal (${element.THING_NAME.split("").slice(-7).join("")})`
          : element.THING_NAME.includes("BWT") &&
            `BWT Cabin (${element.THING_NAME.split("").slice(-7).join("")})`,

        "Connection Status": element.CONNECTION_STATUS,
        "Disconnect Reason": element.DISCONNECT_REASON,
        Date: moment(parseInt(element.timestamp)).format("D/M/YYYY"),
        Time: moment(parseInt(element.timestamp)).format("hh:mm:ss a"),
      });
  });
  return data;
}

export function getLiveComplexData(upiProfile) {
  var data = [];

  upiProfile.forEach((element) => {
    data.push({
      Complex: element["name"],
    });
  });
  return data;
}

function getUiDate(timestamp) {
  var u = new Date(timestamp);
  // console.log("_getUiDate" + u);
  // console.log("_getUiDate" + u.getUTCDate());
  // console.log("_getUiDate" + u.getUTCMonth());
  // console.log("_getUiDate" + u.getUTCFullYear());
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
  if (shortThingName.toUpperCase().includes("mwc".toUpperCase())) return "WC";
  if (shortThingName.toUpperCase().includes("fwc".toUpperCase())) return "WC";
  if (shortThingName.toUpperCase().includes("pwc".toUpperCase())) return "WC";
  if (shortThingName.toUpperCase().includes("mur".toUpperCase())) return "UR";
  // if (shortThingName.toUpperCase().includes('bwt'.toUpperCase()))
  //     return 'BWT'
}
// function getCabinType(shortThingName) {
//     if (shortThingName.toUpperCase().includes('mwc'.toUpperCase()))
//         return 'MWC'
//     if (shortThingName.toUpperCase().includes('fwc'.toUpperCase()))
//         return 'FWC'
//     if (shortThingName.toUpperCase().includes('pwc'.toUpperCase()))
//         return 'PWC'
//     if (shortThingName.toUpperCase().includes('mur'.toUpperCase()))
//         return 'MUR'
//     // if (shortThingName.toUpperCase().includes('bwt'.toUpperCase()))
//     //     return 'BWT'
// }

function getUserType(shortThingName) {
  if (shortThingName.toUpperCase().includes("mwc".toUpperCase())) return "Male";
  if (shortThingName.toUpperCase().includes("fwc".toUpperCase()))
    return "Female";
  if (shortThingName.toUpperCase().includes("pwc".toUpperCase())) return "PD";
  if (shortThingName.toUpperCase().includes("mur".toUpperCase())) return "Male";
}

export function getTopicName(type, complex, cabin, complexHierarchy) {
  var stateCode = complexHierarchy?.stateCode;
  var districtCode = complexHierarchy?.districtCode;
  var cityCode = complexHierarchy?.cityCode;
  var clientName = complex?.client;
  var complexName = complex?.name;
  var thingName = cabin?.thingName.substring(20, 27);

  var START = "TOILETS/"; //"TOILETS/"
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
  topics["CMS_CONFIG"] = topicPrefix + "TOPIC_SSF_READ_CMS_CONFIG";
  topics["UCEMS_CONFIG"] = topicPrefix + "TOPIC_SSF_READ_UCEMS_CONFIG";
  topics["ODS_CONFIG"] = topicPrefix + "TOPIC_SSF_READ_ODS_CONFIG";
  topics["Command"] = topicPrefix + "TOPIC_SSF_COMMAND";

  return topics[type];
}

export function getCommand(commandName) {
  var commandList = [];
  commandList.push(NameValue("Light", 0, 1));
  commandList.push(NameValue("Fan", 0, 2));
  commandList.push(NameValue("Flush", 0, 3));
  commandList.push(NameValue("Floor Clean", 0, 4));
  commandList.push(NameValue("Air Dryer", 0, 5));
  commandList.push(NameValue("CMS Reset", 1, 6));
  commandList.push(NameValue("CMS Clear Fault", 1, 7));
  commandList.push(NameValue("Door Lock", 0, 8));
  commandList.push(NameValue("Play Exit Audio", 0, 9));
  commandList.push(NameValue("Play Cabin Audio", 0, 10));
  commandList.push(NameValue("UCEMS Reset", 1, 11));
  commandList.push(NameValue("UCEMS Clear Fault", 1, 12));
  commandList.push(NameValue("ODS Reset", 1, 13));
  commandList.push(NameValue("ODS Stat Reset", 1, 14));

  var commanad = {};
  for (var i = 0; i < commandList.length; i++) {
    if (commandList[i].name === commandName) commanad = commandList[i];
  }

  return commanad;
}

export function getCommandNames() {
  var commandList = [];
  commandList.push("Light");
  commandList.push("Fan");
  commandList.push("Flush");
  commandList.push("Floor Clean");
  commandList.push("Air Dryer");
  commandList.push("CMS Reset");
  commandList.push("CMS Clear Fault");
  commandList.push("Door Lock");
  commandList.push("Play Exit Audio");
  commandList.push("Play Cabin Audio");
  commandList.push("UCEMS Reset");
  commandList.push("UCEMS Clear Fault");
  commandList.push("ODS Reset");
  commandList.push("ODS Stat Reset");

  return commandList;
}

export function getPublishPayloadCommand(command, commandData, complex, cabin) {
  console.group("data", [command, commandData, complex, cabin]);
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
