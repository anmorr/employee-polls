import { Box, Container } from "@mui/system";
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import Copyright from "../../shared/components/Copyright";
import { createTheme, ThemeProvider } from '@mui/material/styles';


export default function QuestionCard({ optionOneProps, optionTwoProps, submitHandler }) {
    
    const theme = createTheme();

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
                width: 500,
                maxWidth: '100%',
            }}
            >
          <h1>Would You Rather</h1>
          <Typography component="h5" variant="h5">
            Create Your Own Poll
          </Typography>
                    <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
                        <Typography component="h5" variant="h5" sx={{
                        textAlign: 'center'
                    }}>
            First Option
          </Typography>            
            <TextField
                margin="normal"
                required
                fullWidth
                name="optionOne"
                label="Option One"
                type="text"
                id="optionOne"
                {...optionOneProps}
                multiline
                rows={4}
                inputProps={{"data-testid": "option-one"}}
                        />
            <Typography component="h5" variant="h5" sx={{
                        textAlign: 'center'
                    }}>
            Second Option
          </Typography>         
            <TextField
                margin="normal"
                required
                fullWidth
                name="optionTwo"
                label="Option Two"
                type="text"
                id="optionTwo"
                {...optionTwoProps}
                multiline
                rows={4}
                inputProps={{"data-testid": "option-two"}}
                            
                />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, }}
              disabled={
                optionOneProps.value &&
                optionTwoProps.value ?
                  false :
                  true
              }
                            data-testid="submit-button"
                            
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    )
}