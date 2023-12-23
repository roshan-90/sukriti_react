const enumValue = (name) => Object.freeze({ toString: () => name });

export const UiAdminDestinations = Object.freeze({
  Home: enumValue("UiAdminDestinations.Home"),
  CreateUser: enumValue("UiAdminDestinations.CreateUser"),
  MemberDetailsHome: enumValue("UiAdminDestinations.MemberDetailsHome"),
  MemberDetails: enumValue("UiAdminDestinations.MemberDetails"),
  MemberAccess: enumValue("UiAdminDestinations.MemberAccess"),
  DefineAccess: enumValue("UiAdminDestinations.DefineAccess"),
});

export const UserRoles = Object.freeze({
  SuperAdmin: enumValue("UserRoles.SuperAdmin"),
  VendorAdmin: enumValue("UserRoles.VendorAdmin"),
  ClientSuperAdmin: enumValue("UserRoles.ClientSuperAdmin"),
  ClientAdmin: enumValue("UserRoles.ClientAdmin"),
  ClientManager: enumValue("UserRoles.ClientManager"),
  VendorManager: enumValue("UserRoles.VendorManager"),
  Developer: enumValue("UserRoles.Developer"),
  Undefined: enumValue("UserRoles.Undefined"),
});

export const TreeItemType = Object.freeze({
  State: enumValue("TreeItemType.State"),
  District: enumValue("TreeItemType.District"),
  City: enumValue("TreeItemType.City"),
  Complex: enumValue("TreeItemType.Complex"),
});

export const CabinType = Object.freeze({
  MWC: enumValue("CabinType.MWC"),
  FWC: enumValue("CabinType.FWC"),
  PD: enumValue("CabinType.PD"),
  MUR: enumValue("CabinType.MUR"),
});

export const QuickConfigTabs = Object.freeze({
  TAB_USAGE_CHARGE_CONFIG: enumValue("QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG"),
  TAB_PRE_FLUSH_CONFIG: enumValue("QuickConfigTabs.TAB_PRE_FLUSH_CONFIG"),
  TAB_MINI_FLUSH_CONFIG: enumValue("QuickConfigTabs.TAB_MINI_FLUSH_CONFIG"),
  TAB_FULL_FLUSH_CONFIG: enumValue("QuickConfigTabs.TAB_FULL_FLUSH_CONFIG"),
  TAB_FLOOR_CLEAN_CONFIG: enumValue("QuickConfigTabs.TAB_FLOOR_CLEAN_CONFIG"),
  TAB_LIGHT_CONFIG: enumValue("QuickConfigTabs.TAB_LIGHT_CONFIG"),
  TAB_FAN_CONFIG: enumValue("QuickConfigTabs.TAB_FAN_CONFIG"),
  TAB_DATA_REQUEST_CONFIG: enumValue("QuickConfigTabs.TAB_DATA_REQUEST_CONFIG"),
});

export const Priority = Object.freeze({
  Normal: enumValue("Priority.Normal"),
  Urgent: enumValue("Priority.Urgent"),
  Possible: enumValue("Priority.Possible"),
});
export const PUB_TOPIC = Object.freeze({
  CLIENT_TOPIC_GENERIC: enumValue("PUB_TOPIC.CLIENT_TOPIC_GENERIC"),
  CMS_CONFIG_GENERIC: enumValue("PUB_TOPIC.CMS_CONFIG_GENERIC"),
  UCEMS_CONFIG_GENERIC: enumValue("PUB_TOPIC.UCEMS_CONFIG_GENERIC"),
  ODS_CONFIG_GENERIC: enumValue("PUB_TOPIC.ODS_CONFIG_GENERIC"),
  BWT_CONFIG_GENERIC: enumValue("PUB_TOPIC.BWT_CONFIG_GENERIC"),
});
