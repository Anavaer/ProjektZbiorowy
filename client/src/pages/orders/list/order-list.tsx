import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import { Alert, Avatar, Box, Button, ButtonGroup, Card, CardContent, CardHeader, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, Input, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import 'moment/locale/pl';
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { OrderService } from 'services/order-service';
import { ServicePriceService } from 'services/service-price-service';
import { Order, ServicePrice } from 'types';
import { OrderDTO } from 'types/order/OrderDTO';
import { CustomSnackbarOptions } from '../../../utils/CustomSnackbarOptions';
import { OrderItem } from '../components/order-item/order-item';
import { blue, red } from '@mui/material/colors';



export function OrderList() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [createOrderModalOpened, setCreateOrderModalOpened] = React.useState(false);
  const [selectedServiceDate, setSelectedServiceDate] = React.useState(moment(new Date()).add(1, 'minutes').toDate());
  const [customSnackbarOptions, setCustomSnackbarOptions] = React.useState<CustomSnackbarOptions>({ message: "", opened: false, severity: "success" });
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [servicePrices, setServicePrices] = React.useState<ServicePrice[]>([]);
  const [createdOrder, setCreatedOrder] = React.useState<OrderDTO>({serviceDates: [], city: "", address: "", area: 0, servicePriceIds: []});
  const [addServiceDateDisabled, setAddServiceDateDisabled] = React.useState(false);

  const navigate = useNavigate();
  const createOrderValid: boolean = Boolean(
    createdOrder.city.length > 0 && 
    createdOrder.address.length > 0 && 
    createdOrder.area > 0 &&
    createdOrder.serviceDates.length > 0 &&
    createdOrder.servicePriceIds.length > 0
  );

  const orderService: OrderService = new OrderService(cookies);
  const servicePriceService: ServicePriceService = new ServicePriceService(cookies);




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
    setSelectedServiceDate(moment(new Date()).add(1, 'minutes').toDate());
    setCreatedOrder({ serviceDates: [], city: "", address: "", area: 0, servicePriceIds: [] });
    setAddServiceDateDisabled(false);
    
    if (servicePrices.length == 0) {
      servicePriceService.getServicePriceList()
        .then(res => setServicePrices(res));
    }
  }

  const closeCreateOrderModal = (approved: boolean = false): void => {
    setCreateOrderModalOpened(false);

    if (approved) {
      orderService.createOrder(createdOrder)
        .then(() => {
          orderService.getOrders().then(res => {
            setOrders([]);
            setOrders(res);
          });
        })
        .then(() => {
          setCustomSnackbarOptions({
            opened: true,
            severity: "success",
            message: "Zamówienie zostało utworzone pomyslnie"
          });
        })
        .catch(err => {
          console.log(err.response.data);
          setCustomSnackbarOptions({
            opened: true,
            severity: "error",
            message: "Nastąpił problem podczas tworzenia zamówienia"
          });
        })
    }
  }

  
  const assignOrder = (success: boolean, errorMessage?: string): void => {
    setCustomSnackbarOptions({ 
      opened: true, 
      severity: success ? "success" : "error", 
      message: success ? "Zamówienie zostało przypisane pomyslnie" : (errorMessage ?? "")
    });
  }


  const handleDateTimePickerChange = (evt: any): void => {
    let selectedValue = evt?.toDate() ?? new Date();
    setSelectedServiceDate(selectedValue);
  }


  const addServiceDateToOrder = (): void => {
    let newCreatedOrder = { ...createdOrder, serviceDates: [...createdOrder.serviceDates, moment(selectedServiceDate).toISOString()] };
    setCreatedOrder(newCreatedOrder);
    setAddServiceDateDisabled(newCreatedOrder.serviceDates.includes(moment(selectedServiceDate).toISOString()));
  }

  const removeServiceDateFromOrder = (date: string): void => {
    let newCreatedOrder = { ...createdOrder, serviceDates: createdOrder.serviceDates.filter(x => x != date) }
    setCreatedOrder(newCreatedOrder);
    setAddServiceDateDisabled(false);
  }

  const selectService = (servicePrice: ServicePrice): void => {
    if (!createdOrder.servicePriceIds.includes(servicePrice.id))
      setCreatedOrder({ ...createdOrder, servicePriceIds: [...createdOrder.servicePriceIds, servicePrice.id]});
    else
      setCreatedOrder({ ...createdOrder, servicePriceIds: createdOrder.servicePriceIds.filter(x => x != servicePrice.id) });
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardHeader title="Podstawowe dane" avatar={<Avatar sx={{ background: red[500] }} />} />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            margin='normal'
                            required
                            fullWidth
                            id='city'
                            label='Miasto'
                            name='city'
                            onChange={evt => setCreatedOrder({ ...createdOrder, city: evt.currentTarget.value })}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            margin='normal'
                            required
                            fullWidth
                            id='address'
                            label='Adres'
                            name='address'
                            onChange={evt => setCreatedOrder({ ...createdOrder, address: evt.currentTarget.value })}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            margin='normal'
                            required
                            fullWidth
                            id='area'
                            label='Powierzchnia'
                            name='area'
                            type="number"
                            onChange={evt => setCreatedOrder({ ...createdOrder, area: parseInt(evt.currentTarget.value) })}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardHeader 
                      title="Daty" 
                      avatar={
                        <Avatar sx={{ background: red[500] }}>
                          <DateRangeIcon />
                        </Avatar>
                      } 
                    />
                    <CardContent>
                      <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Grid item xs={9}>
                          <FormControl variant="standard" fullWidth={true}>
                            <LocalizationProvider dateAdapter={DateAdapter}>
                              <DateTimePicker
                                label="Data zamówienia"
                                value={selectedServiceDate}
                                onChange={handleDateTimePickerChange}
                                renderInput={(params) => <TextField {...params} />}
                                minDate={moment(new Date()).add(1, 'minutes')}
                              />
                            </LocalizationProvider>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                          <Tooltip 
                            title={addServiceDateDisabled ? (<Typography component="span" variant="subtitle2">Ta data już została dodana</Typography>) : ""} 
                            placement="top"
                            arrow
                          >
                            <span>
                              <Button
                                variant="contained"
                                size="large"
                                startIcon={<AddIcon />}
                                fullWidth={true}
                                disabled={addServiceDateDisabled}
                                style={addServiceDateDisabled ? { pointerEvents: 'none' } : {}}
                                onClick={addServiceDateToOrder}>Dodaj</Button>
                            </span>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          {createdOrder.serviceDates.map(serviceDate => (
                            <Card sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              bgcolor: blue[700],
                              color: 'white'
                            }}>
                              <Box sx={{ padding: "8px" }}>
                                <Typography>{moment(serviceDate).locale("pl").format("DD MMM yyyy, HH:mm:ss")}</Typography>
                              </Box>
                              <IconButton 
                                aria-label="delete" 
                                color="error" 
                                onClick={() => removeServiceDateFromOrder(serviceDate)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Card>
                          ))}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardHeader 
                  title="Wybierz usługi"
                  avatar={
                    <Avatar sx={{ background: red[500] }}>
                      <CleaningServicesIcon />
                    </Avatar>
                  }
                />
                <CardContent>
                  {/* TODO: return the list of services */}
                  <List>
                    {servicePrices.map(servicePrice => (
                      <ListItemButton 
                        onClick={() => selectService(servicePrice)}
                        selected={createdOrder.servicePriceIds.includes(servicePrice.id)}>
                        <ListItemAvatar>
                          <Avatar>
                            {servicePrice.id}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={servicePrice.description} 
                          secondary={"Price ratio: " + servicePrice.priceRatio.toFixed(2)}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ padding: '20px', color: red[500] }}>
                <Typography component="h5" variant="h5" align="right">
                  Łączna kwota: <b>{((createdOrder.area && createdOrder.servicePriceIds.length > 0) ? servicePrices.filter(x => createdOrder.servicePriceIds.includes(x.id)).map(x => x.priceRatio).reduce((a, b) => a + b, 0) * createdOrder.area : 0).toFixed(2)}zł</b>
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button
              color="success"
              startIcon={<DoneIcon />}
              disabled={!createOrderValid}
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