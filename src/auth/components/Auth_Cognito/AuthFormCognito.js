import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';

import AuthContext from '../../../context/auth-context';

import SignUp from '../SignUp/SignUp';
import SignIn from '../SignIn/SignIn';

import {
	CognitoUserPool
} from 'amazon-cognito-identity-js';

import { signin } from '../../../shared/cognito_auth/authFlowCognito';
import FirstLoginPage from '../../pages/FirstLoginPage';

const AuthFormCognito = () => {

  const history = useHistory();

  const [isLogin, setIsLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  const [userData, setUserData] = useState({isFirstLogin: false})




  /* --------This section houses global code for cognito --------- */

  var poolData = {
    UserPoolId: authCtx.authData.userPoolId,
    ClientId: authCtx.authData.userPoolClientId
  }

  var userPool = new CognitoUserPool(poolData);

  /* ----------------- End Global Cognito ------------------- */


  /* ----------------------- Cognito  Sign-In Code ------------------------- */
  
  function handleSignin(
    enteredEmail,
    enteredPassword
  ) {
        signin(enteredEmail, enteredPassword, userPool,
            function signinSuccess(result) {
                var accessToken = result.getAccessToken().getJwtToken();
                authCtx.login(accessToken, )
                history.replace('/');
            },
            function signinError(err) {
                alert(err);
            },
            function newPasswordRequired(userAttr){
              delete userAttr.email_verified;
              
              setUserData({
                isFirstLogin: true,
                user: enteredEmail,
                userAttr: userAttr,
              });
            }
            
        );
  }
  

  /* ------------------------- End Sign-In Code ---------------------------- */
  
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  // console.log("userData: ", userData)
  
  return (

    
    <section className={classes.auth}>
      {/* {userData.isFirstLogin } */}
      {/* <h1>{isLogin ? 'Login' : 'Sign Up'}</h1> */}
      {userData.isFirstLogin && <FirstLoginPage userData={userData} />}
      {isLogin &&  <SignIn handleSignin={
        handleSignin} 
        setIsLogin={setIsLogin}
        switchAuthModeHandler={switchAuthModeHandler}
        />}
      {!isLogin &&  <SignUp 
      setIsLogin={setIsLogin}
      switchAuthModeHandler={switchAuthModeHandler}
      />}
    </section >
     
  );
};

export default AuthFormCognito;
