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

import { useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';

const theme = createTheme();

export default function VerifyEmailForm( { handleSignin, switchAuthModeHandler }) {

    const authCtx = useContext(AuthContext);
  const history = useHistory();
  
  const [userNameProps, setUserName] = useTextField('');
  const [verificationCodeProps, setVerificationCode] = useTextField('');

  const [isVerified, setIsVerified] = useState(false);

  const verificationAlert = (
    <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Your email has been successfully verified. Please Login to continue.
      </Alert>
  )
  
    /* --------This section houses global code for cognito --------- */

    var poolData = {
      UserPoolId: authCtx.authData.userPoolId,
      ClientId: authCtx.authData.userPoolClientId
    }
  
    var userPool = new CognitoUserPool(poolData);
  
    /* ----------------- End Global Cognito ------------------- */
  
    /* --------This section houses the code for cognito --------- */

  function handleVerify(enteredEmail, enteredVerificationCode) {
    verify(
      enteredEmail,
      enteredVerificationCode,
      userPool,
      function verifySuccess(result) {
        setIsVerified(true)
        // history.replace("/auth");
      },
      function verifyError(err) {
        alert(err);
      }
    );
  }

  /* ----------------- End of Cognito Code -------------------- */

  const handleSubmit = (event) => {
        
    event.preventDefault();
    let enteredUsername = userNameProps.value
    let enteredVerificationCode = verificationCodeProps.value
    handleVerify(enteredUsername, enteredVerificationCode);
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
            User Verification
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {isVerified && verificationAlert}
            {!isVerified && <TextField
              margin="normal"
              required
              fullWidth
              name="emailAddress"
              label="Email Address or Username"
              type="email"
              id="email"
              autoComplete="email"
              {...userNameProps}
            />}
            {!isVerified && <TextField
                margin="normal"
                required
                fullWidth
                name="verificationCode"
                label="Verification Code"
                type="text"
                id="verificationCode"
              autoComplete="verificationCode"
              {...verificationCodeProps}
                />}
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {!isVerified && <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, }}
              disabled={
                userNameProps.value &&
                verificationCodeProps.value ?
                  false :
                  true
              }
            >
              Verify Account
            </Button>}
            {isVerified && <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, }}
              onClick={() => {
                history.replace('/auth')
              }}
            >
              Login Here
            </Button>}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}