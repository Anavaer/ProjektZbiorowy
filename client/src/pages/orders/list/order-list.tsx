import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import { Alert, Box, Button, ButtonGroup, Card, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, Input, InputLabel, Snackbar, TextField, Typography } from '@mui/material';
import moment from 'moment';
import 'moment/locale/pl';
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { OrderService } from 'services/order-service';
import { Order } from 'types';
import { CustomSnackbarOptions } from '../../../utils/CustomSnackbarOptions';
import { OrderItem } from '../components/order-item/order-item';



export function OrderList() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const orderService: OrderService = new OrderService(cookies);
  const [createOrderModalOpened, setCreateOrderModalOpened] = React.useState(false);
  const [selectedServiceDate, setSelectedServiceDate] = React.useState(new Date());
  const [customSnackbarOptions, setCustomSnackbarOptions] = React.useState<CustomSnackbarOptions>({ message: "", opened: false, severity: "success" });
  const [orders, setOrders] = React.useState([] as Order[]);




  React.useEffect(() => {
    document.title = "Lista zamówień | Cleanny";

    if (cookies.token) {
      orderService.getOrders().then(res => setOrders(res));
    }
    else {
      navigate("/");
    }
  }, []);





  const openCreateOrderModal = (): void => {
    setCreateOrderModalOpened(true);
    setSelectedServiceDate(new Date());
  }

  const closeCreateOrderModal = (approved: boolean = false): void => {
    setCreateOrderModalOpened(false);

    if (approved) {
      console.log("Można tworzyć");
    }
  }

  
  const assignOrder = (success: boolean, errorMessage?: string): void => {
    setCustomSnackbarOptions({ 
      opened: true, 
      severity: success ? "success" : "error", 
      message: success ? "Zamówienie zostało przypisane pomyslnie" : (errorMessage ?? "")
    });
  }


  return (
    <div>
      <Snackbar
        open={customSnackbarOptions.opened}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setCustomSnackbarOptions({ ...customSnackbarOptions, opened: false })}
      >
        <Alert severity={customSnackbarOptions.severity}>{customSnackbarOptions.message}</Alert>
      </Snackbar>
      <Container component="main" maxWidth="xl">
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100px'
        }}>
          <Box>
            <Typography component="h1" variant="h5">Zamówienia</Typography>
            <Typography component="p" variant="subtitle1" color="text.secondary">
              Łączna liczba zamówień: <b>{orders.length}</b>
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={openCreateOrderModal}>Nowe zamówienie</Button>
        </Box>

        <Grid container spacing={2}>
          {orders.map(order => (<OrderItem order={order} onChangeAssignment={assignOrder} />))}
        </Grid>
      </Container>

    {/* TODO: To finish order creating */}
      <Dialog
        maxWidth="lg"
        fullWidth={true}
        open={createOrderModalOpened}
        onClose={() => closeCreateOrderModal()}
      >
        <DialogTitle>Nowe zamówienie</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography component="h6" variant="subtitle1">Podstawowe dane</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl variant="standard" fullWidth={true}>
                    <InputLabel htmlFor="city">Miasto</InputLabel>
                    <Input id="city" />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" fullWidth={true}>
                    <InputLabel htmlFor="address">Adres</InputLabel>
                    <Input id="address" />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="standard" fullWidth={true}>
                    <InputLabel htmlFor="area">Powierzchnia</InputLabel>
                    <Input id="area" type="number" />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" component="h6">Daty</Typography>

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={9}>
                      <FormControl variant="standard" fullWidth={true}>
                        <LocalizationProvider dateAdapter={DateAdapter}>
                          <DateTimePicker
                            label="Data zamówienia"
                            value={selectedServiceDate}
                            onChange={() => console.log("asd")}
                            renderInput={(params) => <TextField {...params} />}
                            minDate={moment(new Date())}
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <Button variant="contained" size="large" startIcon={<AddIcon />} fullWidth={true}>Dodaj</Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined">item xs=4</Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button
              color="success"
              startIcon={<DoneIcon />}
              onClick={() => closeCreateOrderModal(true)}>Utwórz</Button>
            <Button
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => closeCreateOrderModal()}>Anuluj</Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </div>
  );
}