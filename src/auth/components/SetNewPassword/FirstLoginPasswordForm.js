import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext } from 'react';
import AuthContext from '../../../context/auth-context';
import { useHistory } from 'react-router-dom';
import Copyright from '../../../shared/components/Copyright';

import { verify } from '../../../shared/cognito_auth/authFlowCognito';
import {
  CognitoUserPool
} from 'amazon-cognito-identity-js';

import { useTextField } from '../../../shared/hooks/hooks';

import { createCognitoUser } from '../../../shared/cognito_auth/authFlowCognito';

const theme = createTheme();

export default function FirstLoginPasswordForm( { userData }) {

    const authCtx = useContext(AuthContext);
  const history = useHistory();
  
  const [passwordProps, setPassword] = useTextField('');
    const [confirmPasswordProps, setConfirmPassword] = useTextField('')
    // console.log(cognitioUser)
  
    /* --------This section houses global code for cognito --------- */

    var poolData = {
      UserPoolId: authCtx.authData.userPoolId,
      ClientId: authCtx.authData.userPoolClientId
    }
  
  var userPool = new CognitoUserPool(poolData);
  
  let cognitoUserObject = createCognitoUser('sarahedo', userPool)
  console.log("cognitoUserObject: ", cognitoUserObject)
  
  /* ----------------- End Global Cognito ------------------- */
  
  console.log('userData: ', userData)
  function handleChangePassword(newPassword, confirmNewPassword) {
    const cognitoUser = createCognitoUser(userData.user, userPool);
    const userAttr = userData.userAttr;
    if (newPassword) {
      cognitoUser.completeNewPasswordChallenge(newPassword, userAttr, {

        
      onSuccess: result => {
        // login
          console.log("result: ", result)
        },
        onFailure: (err) => {
        console.error('onFailure: ', err)
      }});
    }
  }
  
    /* --------This section houses the code for cognito --------- */

  function handleVerify(enteredEmail, enteredVerificationCode) {
    verify(
      enteredEmail,
      enteredVerificationCode,
      userPool,
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

  const handleSubmit = (event) => {
        
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let password = passwordProps.value;
    let confirmPassword = confirmPasswordProps.value;
    handleChangePassword(password, confirmPassword);
    setPassword('')
    setConfirmPassword('')
  }
  

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h5" variant="h5">
            Create a New Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...passwordProps}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="Confirm New Password"
                type="password"
                id="newPassword"
              autoComplete="new-password"
              {...confirmPasswordProps}
                />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, }}
              disabled={
                passwordProps.value &&
                confirmPasswordProps.value ?
                  false :
                  true
              }
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}