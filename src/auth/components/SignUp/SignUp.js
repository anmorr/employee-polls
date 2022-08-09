import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from '../../../shared/components/Copyright';
import { useTextFieldWithErrorHandling } from '../../../shared/hooks/hooks';

import { useHistory } from 'react-router-dom';
import AuthContext from '../../../context/auth-context';
import { useContext, useState } from 'react';

import { register } from '../../../shared/cognito_auth/authFlowCognito';
import { Alert, AlertTitle } from '@mui/material';



const theme = createTheme();

export default function SignUp({ switchAuthModeHandler }) {

  // const [emailProps, setEmailAddress] = useTextField('');
  const [emailProps, setEmailAddress, setEmailError, setEmailHelperText] = useTextFieldWithErrorHandling('')
  const [currentPasswordProps, setPassword, setPasswordError, setPasswordHelperText] = useTextFieldWithErrorHandling('');
  const [
    currentConfirmPasswordProps,
    setConfirmPassword,
    setConfirmPasswordError,
    setConfirmPasswordHelperText
  ] = useTextFieldWithErrorHandling('')
  const [networkConnected, setNetworkConnected] = useState(true)

  // const [emailHelperText, setEmailHelperText] = useState('')
  // const [isEmailError, setEmailError] = useState(true)

  const history = useHistory();

  /* --------- Context Code ------------------*/

  const authCtx = useContext(AuthContext);

   /* --------This section houses global code for cognito --------- */

   const userPool = authCtx.userPool;

  /* ----------------- End Global Cognito ------------------- */

  /* ----------------- Start Cognito Registration ----------------- */

  function handleRegister(
    enteredEmail, 
    enteredPassword,
    enteredPasswordConfirmation
  ) {
    var email = enteredEmail;
    var password = enteredPassword;
    var password2 = enteredPasswordConfirmation;
    
    var onSuccess = function registerSuccess(result) {
        
        var cognitoUser = result.user;
        console.log('user name in registration: ' + cognitoUser.getUsername());
        var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
        if (confirmation) {
            history.replace('/verify');
        }
    };
    var onFailure = function registerFailure(error) {
      if (error.message === 'User already exists') {
        setEmailError(true)
        setEmailHelperText(error.message)
        setEmailAddress('')
        setPassword('')
        setConfirmPassword('')

        console.log(emailProps)
      } else if (error.message === 'Network error') {
        setNetworkConnected(false)
      }
    };

    if (password === password2) {
        register(email, password, userPool, onSuccess, onFailure);
    } else {
      setPasswordError(true)
      setPasswordHelperText('Passwords do not match.')
      setConfirmPasswordError(true)
      setPassword('')
      setConfirmPasswordHelperText('Passwords do not match.')
      setConfirmPassword('')
    }
  }

  /* ----------------- End of Cognito Registration Code -------------------- */
  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const email = emailProps.value
    const password = currentPasswordProps.value
    const confirmPassword = currentConfirmPasswordProps.value
    handleRegister(
        email,
        password,
        confirmPassword,
    )

    
  };

  const handleAlreadyRegisterd = () => {
      switchAuthModeHandler()
  }


  const networkInfoAlert = (
    <Alert severity="info" onClose={() => {setNetworkConnected(true)}}>
        <AlertTitle>Info</AlertTitle>
        Network Error. Please check your connection.
      </Alert>
  )
  

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
          <Avatar sx={{ m: 1, bgcolor: '#1465C0' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {!networkConnected && networkInfoAlert}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  id='email'
                  label="Email Address"
                  autoComplete="email"
                  {...emailProps}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...currentPasswordProps}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="ConfirmPassword"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  {...currentConfirmPasswordProps}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={emailProps.value &&
                        currentPasswordProps.value &&
                        currentConfirmPasswordProps.value ? false : true}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={handleAlreadyRegisterd}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />

      </Container>
    </ThemeProvider>
  );
}