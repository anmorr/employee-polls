import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext } from 'react';
import AuthContext from '../../../context/auth-context';
import { useHistory } from 'react-router-dom';
import {
	CognitoUser
} from 'amazon-cognito-identity-js';

import { useTextField } from '../../../shared/hooks/hooks';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function PassResetVerificationForm ( { handleSignin, switchAuthModeHandler }) {

    const authCtx = useContext(AuthContext);
    const userPool = authCtx.userPool;
  const history = useHistory();
  
  const [userNameProps, setUserName] = useTextField('');
  const [verificationCodeProps, setVerificationCode] = useTextField('');
  const [newPasswordProps, setNewPassword] = useTextField('');
  const [confirmNewPasswordProps, setConfirmNewPassword] = useTextField('');

    function toUsername(email) {
        return email.replace('@', '-at-');
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let username = toUsername(data.get('username'));
        let verificationCode = data.get('verificationCode');
        let newPassword = data.get('newPassword');
        let newPassword2 = data.get('newPassword2');
        // console.log({
        //     username: data.get('username'),
        //     resetCode: data.get('verificationCode'),
        //     newPassword: data.get('newPassword'),
        //     newPassword2: data.get('newPassword2'),
        // });

        if (userPool) {

            const userData = {
                Username: username,
                Pool: userPool
            };
            const cognitoUser = new CognitoUser(userData);
            // console.log(cognitoUser);

            if (newPassword === newPassword2) {
                cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess() {
                    // console.log('Password confirmed!');
                    alert("Password confirmed!")
                    history.replace('/auth')
                },
                onFailure(err) {
                    // console.log('Password not confirmed!');
                },
                });
            } else {
                alert('Passwords do not match');
            }
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
            <TextField
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                type="text"
                id="username"
              autoComplete="username"
              {...userNameProps}
                />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="verificationCode"
              label="Code"
              type="text"
              id="verificationCode"
              autoComplete="email-code"
              {...verificationCodeProps}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
              autoComplete="new-password"
              {...newPasswordProps}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword2"
                label="Confirm Password"
                type="password"
                id="newPassword2"
              autoComplete="new-password"
              {...confirmNewPasswordProps}
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
                userNameProps.value &&
                verificationCodeProps.value &&
                newPasswordProps.value &&
                confirmNewPasswordProps.value ?
                  false :
                  true
              }
            >
              Reset Password
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}