
import React, { useState } from 'react';

import {
	CognitoUserPool
} from 'amazon-cognito-identity-js';

const authData = {
    userPoolId: 'us-east-1_EhgVSlUt4', // e.g. us-east-2_uXboG5pAb
    userPoolClientId: '1agnserutlvfh3811qresi5ivc', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
    region: 'us-east-1' // e.g. us-east-2
  }

var poolData = {
    UserPoolId: authData.userPoolId,
    ClientId: authData.userPoolClientId
}

var userPool = new CognitoUserPool(poolData);

const AuthContext = React.createContext({
    // Define the shape of our context
    // which also allows better autocompletion
    token: '',
    isLoggedIn: false,
    login: (token, expirationTime) => {},
    logout: () => {},
    authData: {},
    userPool: '',
    congitoUser: ''
});


export const AuthContextProvider = (props) => {

    
    let initialToken = '';
    let cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            // console.log('session validity: ' + session.isValid());
            initialToken = session.getIdToken().getJwtToken()

            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            cognitoUser.getUserAttributes(function(err, attributes) {
                if (err) {
                    // Handle error
                } else {
                    // Do something with attributes
                    // console.log(attributes)
                }
            });

            // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            //     IdentityPoolId: '...', // your identity pool id here
            //     Logins: {
            //         // Change the key below according to the specific region your user pool is in.
            //         'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': session
            //             .getIdToken()
            //             .getJwtToken(),
            //     },
            // });

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
        });
    }

    // console.log('initialToken: ', initialToken)
    const [token, setToken] = useState(initialToken);

    const userIsLoggedIn = !!token; 

    const logoutHandler = () => {
        setToken(null);
        userPool.getCurrentUser().signOut();
    }

    const loginHandler = (token) => {
        setToken(token);
    };


    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
        authData: authData,
        userPool: userPool,
        cognitoUser: cognitoUser,
    }

    return <AuthContext.Provider value={contextValue}>
                {props.children}
            </AuthContext.Provider>
}

export default AuthContext;