import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext, useState } from 'react';
import AuthContext from '../../../context/auth-context';
import { useHistory } from 'react-router-dom';
import Copyright from '../../../shared/components/Copyright';
import { useTextField } from '../../../shared/hooks/hooks';
import { Alert } from '@mui/material';
import { useTextFieldWithErrorHandling } from '../../../shared/hooks/hooks';

const theme = createTheme();

export default function ChangePasswordForm( { handleSignin, switchAuthModeHandler }) {

    const authCtx = useContext(AuthContext);
    const cognitioUser = authCtx.cognitoUser;
    const history = useHistory();
    // console.log(cognitioUser)

  const [currentPasswordProps, setCurrentPassword, setPasswordError, setPasswordHelperText] = useTextFieldWithErrorHandling('');
  const [
    newPasswordProps,
    setNewPassword,
    setNewPasswordError,
    setNewPasswordHelperText] = useTextFieldWithErrorHandling('')
  const [
    newPasswordConfirmProps,
    setNewPasswordConfirm,
    setConfirmPasswordError,
    setConfirmPasswordHelperText
  ] = useTextFieldWithErrorHandling('')
  

  const [passwordChanged, setPasswordChanged] = useState(false)
  const [limitExceeded, setLimitExceeded] = useState(false)


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let currentPassword = currentPasswordProps.value
        let newPassword = newPasswordProps.value
        let newConfirmPassword = newPasswordConfirmProps.value
        

      if (cognitioUser) {

        if (newPassword === newConfirmPassword) {
          cognitioUser.changePassword(currentPassword, newPassword, function(err, result) {
            if (err) {
                // alert(err.message || JSON.stringify(err));
              // console.log(err.message)
              if (err.message === 'Incorrect username or password.') {
                setPasswordError(true)
                setPasswordHelperText(err.message)
                return
              } else if (err.message === 'Attempt limit exceeded, please try after some time.') {
                setLimitExceeded(true)
                setCurrentPassword('')
                setNewPassword('')
                setNewPasswordConfirm('')
                return
              } else {
                console.error(err.message)
                return
              }
                
            }
            // alert("Password Changed!")
            setPasswordChanged(true)
            setCurrentPassword('')
            setNewPassword('')
            setNewPasswordConfirm('')
            // history.replace('/')
          });
        } else {
          setNewPasswordError(true)
          setNewPasswordHelperText('Passwords do not match.')
          setConfirmPasswordError(true)
          setNewPassword('')
          setConfirmPasswordHelperText('Passwords do not match.')
          setNewPasswordConfirm('')
        }

        
      }
    }
        // handleSignin(email, password)
  
  
  const passwordSuccessAlert = (
    <Alert severity="success" onClose={() => {setPasswordChanged(false)}}>
        {/* <AlertTitle>Success</AlertTitle> */}
        Password Successfully Changed!
      </Alert>
  )

  const limitExceededAlert = (
    <Alert severity="warning" onClose={() => {setLimitExceeded(false)}}>
        {/* <AlertTitle>Success</AlertTitle> */}
        Attempt limit exceeded, please try after some time.
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
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h5" variant="h5">
            Change Your Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {limitExceeded && limitExceededAlert}
            {passwordChanged && passwordSuccessAlert}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Current Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...currentPasswordProps}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
              autoComplete="password"
              {...newPasswordProps}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="newPasswordConfirm"
                label="Confirm New Password"
                type="password"
                id="confirmNewPassword"
              autoComplete="password"
              {...newPasswordConfirmProps}
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
              disabled={currentPasswordProps.value &&
                newPasswordProps.value ? false : true}
            >
              Change Password
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}