import {
	CognitoUserAttribute,
	CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

function toUsername(email) {
    return email.replace('@', '-at-');
}
function toUsernameOfEmail(email) {
    const username = email.split("@")
    if (username) {
        return username[0]
    }
}

/* ----------------------- Cognito  Sign-In Code ------------------------- */

export function createCognitoUser(email, cognitoUserPool) {
    return new CognitoUser({
        Username: toUsername(email),
        Pool: cognitoUserPool
    });
}

// export function signin(email, password, cognitoUserPool, onSuccess, onFailure, newPasswordRequired) {
//     var authenticationDetails = new AuthenticationDetails({
//         Username: toUsername(email),
//         Password: password
//     });

//     var cognitoUser = createCognitoUser(email, cognitoUserPool);

//     cognitoUser.authenticateUser(authenticationDetails, {
//         onSuccess: onSuccess,
//         onFailure: onFailure,
//         newPasswordRequired: newPasswordRequired
        


//     });
// }

export function signin(email, password, cognitoUserPool, onSuccess, onFailure, newPasswordRequired) {
    var authenticationDetails = new AuthenticationDetails({
        Username: toUsernameOfEmail(email),
        Password: password
    });

    var cognitoUser = createCognitoUser(email, cognitoUserPool);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: onSuccess,
        onFailure: onFailure,
        newPasswordRequired: newPasswordRequired
        


    });
}

/* ------------------------- End Sign-In Code ---------------------------- */

 /* ----------------- Cognito Registration ----------------- */

export function register(email, password, cognitoUser, onSuccess, onFailure) {
    var dataEmail = {
        Name: 'email',
        Value: email
    };
    var attributeEmail = new CognitoUserAttribute(dataEmail);

    cognitoUser.signUp(toUsernameOfEmail(email), password, [attributeEmail], null,
        function signUpCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        }
    );
}
  

/* -------------------- Email Verification -------------------- */

export function verify(email, code, cognitoUserPool, onSuccess, onFailure) {
    
    createCognitoUser(email, cognitoUserPool).confirmRegistration(
      code,
      true,
      function confirmCallback(err, result) {
        if (!err) {
          onSuccess(result);
        } else {
          onFailure(err);
        }
      }
    );
  }