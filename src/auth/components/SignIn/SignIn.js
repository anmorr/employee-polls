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
import classes from './SignIn.module.css';
import { useHistory } from 'react-router-dom';
import Copyright from '../../../shared/components/Copyright';
import { useTextFieldWithErrorHandling} from '../../../shared/hooks/hooks';
import AuthContext from '../../../context/auth-context';
import { useContext } from 'react';
import { signin } from '../../../shared/cognito_auth/authFlowCognito';
import { useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';



const theme = createTheme();

export default function SignIn({ switchAuthModeHandler }) {

  const history = useHistory();
  
  const [
    emailProps,
    setEmailAddress,
    setEmailError,
    setEmailHelperText] = useTextFieldWithErrorHandling('');
  const [
    passwordProps,
    setPassword,
    setPasswordError,
    setPasswordHelperText
  ] = useTextFieldWithErrorHandling('');
  const [userData, setUserData] = useState({ isFirstLogin: false })
  
  const [networkConnected, setNetworkConnected] = useState(true)
  

   /* --------- Context Code ------------------*/

   const authCtx = useContext(AuthContext);

   /* --------This section houses global code for cognito --------- */

   const userPool = authCtx.userPool;

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
                // console.log('Successfully Logged In') //: Token: ', accessToken);
                history.replace('/');
            },
            function signinError(error) {
              console.log(error.message)
              if (error.message === 'Incorrect username or password.') {
                setEmailError(true);
                setEmailHelperText('');
                setPasswordError(true);
                setPasswordHelperText(error.message)
              } else if (error.message === 'Network error') {
                setNetworkConnected(false)
              }
            },
            function newPasswordRequired(userAttr){
              delete userAttr.email_verified;
              
              setUserData({
                isFirstLogin: true,
                user: enteredEmail,
                userAttr: userAttr,
              });
              console.log(userData)
            }
            
        );
  }
  /* ------------------------- End Sign-In Code ---------------------------- */

  

    const handleSubmit = (event) => {
      event.preventDefault();
      handleSignin(emailProps.value, passwordProps.value)
      setEmailAddress('')
      setPassword('')
    };

    const handleNewAccount = () => {
        switchAuthModeHandler()
    }

    const handlePasswordReset = () => {
        history.replace('/password-reset')
    }
  
    const successAlert = (
      <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Check your email for a reset code to create a new password on the reset page.
        </Alert>
    )
  
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
          <h1>Employee Polls</h1>
          <Avatar sx={{ m: 1, bgcolor: '#1465C0' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {!networkConnected && networkInfoAlert}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address or Username"
              name="email"
              autoComplete="email"
              autoFocus
              // onChange={event => setEmailAddress(event.target.value)}
              {...emailProps}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...passwordProps}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              className={classes.Button}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, }}
              disabled={emailProps.value && passwordProps.value ? false : true}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={handlePasswordReset}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleNewAccount}>
                  {"Don't have an account? Sign Up"}
                </Link>
                {/* <Button >Don't have an account? Sign Up</Button> */}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}