//@ts-nocheck
import { Snackbar, Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { CustomSnackbarOptions } from 'utils/CustomSnackbarOptions';
import * as ApiService from "../../services/api-service";

export function SignUp() {
  const [errorData, setErrorData] = React.useState<any>({});
  const [customSnackbarOptions, setCustomSnackbarOptions] = React.useState<CustomSnackbarOptions>({ message: "", opened: false, severity: "success" });


  React.useEffect(() => {
    document.title = "Zarejestruj się | Cleanny";
  }, []);



  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const signUpData = {
      username: data.get('username'),
      password: data.get('password')
    }

    if (data.get('firstName')) signUpData.firstName = data.get('firstName');
    if (data.get('lastName')) signUpData.lastName = data.get('lastName');
    if (data.get('city')) signUpData.city = data.get('city');
    if (data.get('address')) signUpData.address = data.get('address');
    if (data.get('companyName')) signUpData.companyName = data.get('companyName');
    if (data.get('nip')) signUpData.nip = data.get('nip');

    await ApiService.signUp(signUpData)
      .then(() => setCustomSnackbarOptions({ opened: true, message: "Użytkownik został zarejestrowany pomyślnie", severity: "success" }))
      .catch(err => {
        if (err.response.data.errors)
          setErrorData(err.response.data.errors);
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Rejestracja
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Login"
                  name="username"
                  error={errorData.Username != null}
                  helperText={errorData.Username && errorData.Username[0]}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Hasło"
                  type="password"
                  id="password"
                  error={errorData.Password != null}
                  helperText={errorData.Password && errorData.Password[0]}
                  autoComplete="new-password"
                />
              </Grid>
              <Typography component="h4" variant="subtitle1" width="100%" pl="16px" pt="16px">
                Dane Osobiste
              </Typography>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  autoComplete="given-name"
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="Imię"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nazwisko"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  autoComplete="city"
                  name="city"
                  fullWidth
                  id="city"
                  label="Miasto"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Adres"
                  name="address"
                  autoComplete="address"
                />
              </Grid>
              <Typography component="h4" variant="subtitle1" width="100%" pl="16px" pt="16px">
                Dane Firmy
              </Typography>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="companyName"
                  fullWidth
                  id="companyName"
                  label="Nazwa Firmy"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="nip"
                  label="NIP"
                  name="nip"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
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