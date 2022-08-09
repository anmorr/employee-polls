import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	CognitoUser
} from 'amazon-cognito-identity-js';
import AuthContext from '../../../context/auth-context';
import Copyright from '../../../shared/components/Copyright';
import { useTextFieldWithErrorHandling } from '../../../shared/hooks/hooks';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';



const theme = createTheme();

export default function PasswordResetForm() {

    /* --------- Context Code ------------------*/
  const authCtx = useContext(AuthContext);
  const authData = authCtx.authData;

    /* --------- End Context Code ------------------*/
  const history = useHistory();
  
  const [
    userNameProps,
    setUsername,
    setUsernameError,
    setUsernameHelperText] = useTextFieldWithErrorHandling('');
  
  const [resetSuccess, setResetSuccess] = useState(false);

    // console.log(authData)

    function toUsername(email) {
        return email.replace('@', '-at-');
    }
  
  const successAlert = (
    <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Check your email for a reset code to create a new password on the reset page.
      </Alert>
  )


  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let username = toUsername(data.get('username'));

      if (authData.userPoolId) {

        const userPool = authCtx.userPool

        const userData = {
          Username: username,
          Pool: userPool
        };
        const cognitoUser = new CognitoUser(userData);

        cognitoUser.forgotPassword({
          onSuccess: function(data) {
            // successfully initiated reset password request
            setResetSuccess(true);
            console.log('resetSuccess: ', resetSuccess)
            // alert('Check your email and use the received code to create a new password.')
            // console.log('CodeDeliveryData from forgotPassword: ' +  JSON.stringify(data));
            // history.replace('/password-reset-verify')
          },
          onFailure: function(err) {
            setUsernameError(true);
            setUsernameHelperText(err.message)
          }
        });
      }
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
            Reset Your Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {resetSuccess && successAlert}
            {!resetSuccess && <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Email Address"
              type="text"
              id="username"
              autoComplete="username"
              {...userNameProps}
            />}
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {!resetSuccess && <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, }}
              disabled={userNameProps.value ? false : true}
            >
              Reset Password
            </Button>}
            {resetSuccess && <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, }}
              onClick={() => {
                history.replace('/password-reset-verify')
              }}
            >
              Reset Page
            </Button>}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}