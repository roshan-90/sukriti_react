import moment from "moment";
import { getRoleName } from "../ui/administration/utils/AdminUtils";

export function getTeamList(teamJsonData) {}

export function fromUserList(userList) {
  var dataList = [];
  var item = {};
  for (let mUser of userList) {
    item = {
      "User Name": mUser.userName,
      Role: mUser.userRole,
      //"Name": mUser.name,
      //"Gender": mUser.gender,
      //"Client Name": mUser.client.name,
      Organisation: mUser.organisation,
      //"Email": mUser.contactInfo.email,
      //"Phone Number": mUser.contactInfo.phoneNumber,
      Created: mUser.createdOn,
      Status: mUser.userStatus,
    };
    dataList.push(item);
  }

  console.log("_fromUserList", dataList);
  return dataList;
}
export function fromVendorList(userList) {
  var dataList = [];
  var item = {};
  for (let mUser of userList) {
    item = {
      "Vendor Name": mUser.vendor_name,
      "Account Number": mUser.accountNumber,
      "User Name": mUser.userName,
      "IFSC Code": mUser.ifsc_code,
      "GST Number": mUser.gstNumber,
      Beneficiary: mUser.beneficiary,
      Created: moment(parseInt(mUser.timestamp)).format("M/D/YYYY"),
      "Linked Account": mUser.account_id,
    };
    dataList.push(item);
  }

  console.log("_fromUserList", dataList);
  return dataList;
}
export function fromVendorDetails(mUser) {
  console.log("_fromUserDetails", mUser);
  var item = {};
  item = {
    "Linked Account": mUser.account_id,
    "Vendor Name": mUser.vendor_name,
    "Account Number": mUser.accountNumber,
    "User Name": mUser.userName,
    "IFSC Code": mUser.ifsc_code,
    "GST Number": mUser.gstNumber,
    Beneficiary: mUser.beneficiary,
    Created: moment(parseInt(mUser.timestamp)).format("M/D/YYYY"),
    Email: mUser.email,
    "Phone Number": mUser.contact,
    "Buisness Name": mUser.buisnessName,
    "Vendor Admin": mUser.vendor_admin,
  };

  return item;
}

export function fromUserDetails(mUser) {
  console.log("_fromUserDetails", mUser);
  var item = {};
  item = {
    "User Name": mUser?.userName,
    Role: mUser?.userRole,
    Gender: mUser?.gender,
    "Client Name": mUser?.clientName,
    Organisation: mUser?.organisation,
    Email: mUser?.email,
    "Phone Number": mUser?.phoneNumber,
    "Access Defined By": mUser?.assignedBy,
    "Access Defined Date": mUser?.assignedOn,
    Created: mUser?.createdOn,
    Status: mUser?.userStatus,
  };

  return item;
}

export function fromUserProfileDetails(mUser) {
  console.log("_fromUserProfileDetails", mUser);
  var item = {};
  item = {
    "User Name": mUser?.userName,
    "Account Status": mUser?.userStatus,
    Role: mUser?.userRole,
    "Client": mUser?.clientName,
    Name: mUser?.name,
    Gender: mUser?.gender,
    // "Address": mUser?.addess,
    Email: mUser?.email,
    "Phone Number": mUser?.phoneNumber,
    Created: mUser?.createdOn,
  };

  return item;
}
