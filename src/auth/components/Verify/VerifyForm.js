import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";

import classes from "./VerifyForm.module.css";

import { useContext } from "react";
import AuthContext from "../../../context/auth-context";

import { CognitoUser } from "amazon-cognito-identity-js";
import { useTextField } from "../../../shared/hooks/hooks";

const VerifyForm = () => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef();
  const verificationCodeRef = useRef();
  const authCtx = useContext(AuthContext);
  const userPool = authCtx.userPool;

  /* --------This section houses the code for cognito --------- */

  // Setup userPoolId, client, and region

  function toUsername(email) {
    return email.replace("@", "-at-");
  }

  function createCognitoUser(email) {
    return new CognitoUser({
      Username: toUsername(email),
      Pool: userPool,
    });
  }

  function verify(email, code, onSuccess, onFailure) {
    
    createCognitoUser(email).confirmRegistration(
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

  function handleVerify(enteredEmail, enteredVerificationCode) {
    verify(
      enteredEmail,
      enteredVerificationCode,
      function verifySuccess(result) {
        console.log("call result: " + result);
        console.log("Successfully verified");
        alert(
          "Verification successful. You will now be redirected to the login page."
        );
        history.replace("/auth");
      },
      function verifyError(err) {
        alert(err);
      }
    );
  }

  /* ----------------- End of Cognito Code -------------------- */

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredVerificationCode = verificationCodeRef.current.value;
    console.log(enteredEmail, enteredVerificationCode);
    setIsLoading(true);
    handleVerify(enteredEmail, enteredVerificationCode);
    setIsLoading(false);
  };

  return (
    <section className={classes.auth}>
      <h1>Verify Email</h1>
      <form>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="verificationCode">Verification Code</label>
          <input type="text" id="password" required ref={verificationCodeRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button onClick={submitHandler}>{"Verify Email"}</button>
          )}
          {isLoading && <p>Sending Request...</p>}
        </div>
      </form>
    </section>
  );
};

export default VerifyForm;
