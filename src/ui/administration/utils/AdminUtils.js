import { UserRoles } from "../../../nomenclature/nomenclature";

export function getCreateUserRoleList(userRole) {
  console.log("_getCreateUserRoleList", userRole);
  console.log("_UserRole", UserRoles);

  var roleList = [];
  if (userRole === "Super Admin") {
    // roleList.push("Client Super Admin");
    // roleList.push("Vendor Admin");
    roleList.push("Client Super Admin");
    roleList.push("Vendor Admin");
    roleList.push("Client Admin");
    roleList.push("Client Manager");
    roleList.push("Vendor Manager");
  } else if (userRole === "Client Super Admin") {
    roleList.push("Client Admin");
    roleList.push("Client Manager");
  } else if (userRole === "Vendor Admin") {
    roleList.push("Client Super Admin");
    roleList.push("Vendor Manager");
  } else if (userRole === "Client Admin") {
    roleList.push("Client Manager");
  } else if (userRole === "Client Manager") {
  } else if (userRole === "Vendor Manager") {
  } else {
    //Developer
    roleList.push("Client Super Admin");
    roleList.push("Vendor Admin");
    roleList.push("Client Admin");
    roleList.push("Client Manager");
    roleList.push("Vendor Manager");
  }

  return roleList;
}

export function getRole(roleName) {
  console.log("_getRole", roleName);
  if (roleName === "Super Admin") {
    return UserRoles.SuperAdmin;
  } else if (roleName === "Client Super Admin") {
    return UserRoles.ClientSuperAdmin;
  } else if (roleName === "Vendor Admin") {
    return UserRoles.VendorAdmin;
  } else if (roleName === "Client Admin") {
    return UserRoles.ClientAdmin;
  } else if (roleName === "Client Manager") {
    return UserRoles.ClientManager;
  } else if (roleName === "Vendor Manager") {
    return UserRoles.VendorManager;
  }

  return UserRoles.Undefined;
}

export function getRoleName(role) {
  console.log("_getRole", role);
  if (role === UserRoles.SuperAdmin) {
    return "Super Admin";
  } else if (role === UserRoles.ClientSuperAdmin) {
    return "Client Super Admin";
  } else if (role === UserRoles.VendorAdmin) {
    return "Vendor Admin";
  } else if (role === UserRoles.ClientAdmin) {
    return "Client Admin";
  } else if (role === UserRoles.ClientManager) {
    return "Client Manager";
  } else if (role === UserRoles.VendorManager) {
    return "Vendor Manager";
  }

  return "Undefined";
}

export function isClientSpecificRole(userRole) {
  var isClientSpecificRole;
  if (userRole === UserRoles.SuperAdmin) {
    return false;
  } else if (userRole === UserRoles.ClientSuperAdmin) {
    return true;
  } else if (userRole === UserRoles.VendorAdmin) {
    return false;
  } else if (userRole === UserRoles.ClientAdmin) {
    return true;
  } else if (userRole === UserRoles.ClientManager) {
    return true;
  } else if (userRole === UserRoles.VendorManager) {
    return false;
  }

  console.log("_isClientSpecificRole", userRole, isClientSpecificRole);
  return isClientSpecificRole;
}
