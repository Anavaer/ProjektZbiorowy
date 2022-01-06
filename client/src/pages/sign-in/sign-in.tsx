//@ts-nocheck
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import * as ApiService from '../../services/api-service';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Snackbar, Alert } from '@mui/material';
import { CustomSnackbarOptions } from 'utils/CustomSnackbarOptions';

const TOKEN_LIFE = 7;

export function SignIn() {
  const [_, setCookie] = useCookies();
  const [customSnackbarOptions, setCustomSnackbarOptions] = React.useState<CustomSnackbarOptions>({ message: "", opened: false, severity: "success" });
  const [errorData, setErrorData] = React.useState<any>({});

  const navigate = useNavigate();


  
  React.useEffect(() => {
    document.title = "Zaloguj się | Cleanny";
  }, []);



  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const signInData = {
      username: data.get('username'),
      password: data.get('password')
    }

    ApiService.signIn(signInData)
      .then(({ data }) => {
        const date = new Date()
        date.setTime(date.getTime() + (TOKEN_LIFE * 24 * 60 * 60 * 1000))

        let parsedToken: any = JSON.parse(atob(data.token.split('.')[1]));

        setCookie('username', data.username, { expires: date })
        setCookie('token', data.token, { expires: date })
        setCookie('role', parsedToken.role);
        setCookie('id', parsedToken.nameid);
        navigate('/')
      })
      .catch(err => {
        switch(err.response.status) {
          case 401:
            setCustomSnackbarOptions({ message: err.response.data, opened: true, severity: "error" });
            setErrorData({});
            break;
          case 400:
            setErrorData(err.response.data.errors);
            break;
          default:
            setCustomSnackbarOptions({ message: "Nastąpił nieoczekiwany błąd", opened: true, severity: "error" });
            setErrorData({});
            break;
        }
      });
  };

  return (
    <div>
      <Snackbar
        open={customSnackbarOptions.opened}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setCustomSnackbarOptions({ ...customSnackbarOptions, opened: false })}
      >
        <Alert severity={customSnackbarOptions.severity}>{customSnackbarOptions.message}</Alert>
      </Snackbar>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component='h1' variant='h5'>
            Logowanie
          </Typography>
          <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Login'
              name='username'
              autoFocus
              error={errorData.Username != null}
              helperText={errorData.Username && errorData.Username[0]}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Hasło'
              type='password'
              id='password'
              error={errorData.Password != null}
              helperText={errorData.Password && errorData.Password[0]}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Wyślij
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}