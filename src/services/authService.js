// authService.js
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import AWS from "aws-sdk";
import {
  AWS_REGION,
  USER_POOL_ID,
  IDENTITY_POOL_ID,
  USER_POOL_CLIENT_ID,
} from "../lib/environment";
import { setUser, setLoggedIn } from "../features/authenticationSlice";
import { executeGetUserDetailsLambda } from "../awsClients/administrationLambdas";

const userPool = new CognitoUserPool({
  UserPoolId: USER_POOL_ID,
  ClientId: USER_POOL_CLIENT_ID,
});

const getCognitoUser = (username) => {
  return new CognitoUser({
    Username: username,
    Pool: userPool,
  });
};

const getCachedUser = () => {
  return new Promise((resolve, reject) => {
    let user = userPool.getCurrentUser();
    if (user != null) {
      user.getSession(async (err, session) => {
        if (err) {
          reject();
        } else if (session.isValid()) {
          let token = session.getIdToken().getJwtToken();
          let credentials = await getAWSCredentials(token);
          resolve(credentials);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

const getAWSCredentials = async (token) => {
  AWS.config.region = AWS_REGION;
  let loginUrl = `cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}`;
  let credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID,
    Logins: {
      [loginUrl]: token,
    },
  });
  credentials.clearCachedId();
  await credentials.getPromise();
  return credentials;
};

const signIn = async (username, password, dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      let credentials = await getCachedUser();
      console.log("credentials", credentials);
      if (credentials) {
        // User is cached, resolve with cached credentials
        resolve(credentials);
        return;
      }
      if (!username || !password) {
        reject("No user cached and no credentials provided");
        return;
      }

      // Continue with Cognito authentication
      let authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      let cognitoUser = getCognitoUser(username);
      await new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: async (result) => {
            let token = result.getIdToken().getJwtToken();
            let credentials = await getAWSCredentials(token);
            console.log("check--", credentials);
            let data = {
              accessKeyId: credentials?.data?.Credentials?.AccessKeyId,
              secretAccessKey: credentials?.data?.Credentials?.SecretKey,
              sessionToken: credentials?.data?.Credentials?.SessionToken,
            };
            localStorage.setItem("data", JSON.stringify(data));
            dispatch(setLoggedIn(data));
            executeGetUserDetailsLambda(username, data)
              .then((userDetails) => {
                console.log("userDetails", userDetails);
                localStorage.setItem(
                  "userDetails",
                  JSON.stringify(userDetails)
                );
                dispatch(setUser(userDetails));
              })
              .catch((error) => {
                console.error("Error fetching user details:", error);
              });
            resolve(credentials);
            // AWS.config.credentials.get(() => {
            //   var accessKeyId = AWS.config.credentials.accessKeyId;
            //   var secretAccessKey = AWS.config.credentials.secretAccessKey;
            //   var sessionToken = AWS.config.credentials.sessionToken;

            //   AWS.config.update({
            //     accessKeyId: accessKeyId,
            //     secretAccessKey: secretAccessKey,
            //     sessionToken: sessionToken,
            //   });
            //   resolve(credentials);
            // });
          },
          onFailure: (err) => {
            console.error("onFailure:", err);
            reject(new Error(`Authentication failed: ${err.message}`));
          },
          newPasswordRequired: (data) => {
            reject(
              new Error(
                "Authentication Failed: Account not activated. Please contact admin."
              )
            );
          },
        });
      });
      resolve(credentials);
    } catch (error) {
      // If there's an error, reject with the error
      reject(error);
    }
  });
};

export const invokeLambda = async () => {
  try {
    // const lambdaResponse =
    //   await auth.invokeLambdaFunction(/* Add your Lambda function details here */);
    // console.log("Lambda Response:", lambdaResponse);
    console.log("invoke lamda");
  } catch (error) {
    console.error("Lambda function invocation failed:", error);
  }
};

// const signUp = (username, password, attributes) => {
//   return new Promise((resolve, reject) => {
//     let cognitoAttributes = attributes.map((a) => {
//       return new AmazonCognitoIdentity.CognitoUserAttribute(a);
//     });
//     userPool.signUp(
//       username,
//       password,
//       cognitoAttributes,
//       null,
//       (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(username);
//         }
//       }
//     );
//   });
// };

const signOut = async () => {
  let cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    cognitoUser.signOut();
  }
  localStorage.removeItem("persist:root");
  localStorage.clear();
};

const resendConfirmation = (username) => {
  let cognitoUser = getCognitoUser(username);
  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

const confirmRegistration = (username, code) => {
  let cognitoUser = getCognitoUser(username);
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

const changePassword = (username, oldPassword, newPassword) => {
  let cognitoUser = getCognitoUser(username);
  return new Promise((resolve, reject) => {
    cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

const forgotPassword = (username) => {
  let cognitoUser = getCognitoUser(username);
  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: resolve,
      onFailure: reject,
    });
  });
};

const confirmPassword = (username, verificationCode, newPassword) => {
  let cognitoUser = getCognitoUser(username);
  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });
};

export {
  getCognitoUser,
  getAWSCredentials,
  getCachedUser,
  // signUp,
  signIn,
  signOut,
  resendConfirmation,
  confirmRegistration,
  changePassword,
  forgotPassword,
  confirmPassword,
};
