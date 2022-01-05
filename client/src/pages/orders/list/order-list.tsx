import AddIcon from '@mui/icons-material/Add';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import CloseIcon from '@mui/icons-material/Close';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { DateTimePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import { Alert, Avatar, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import { blue, red } from '@mui/material/colors';
import moment from 'moment';
import 'moment/locale/pl';
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { AdminService } from 'services/admin/admin-service';
import { OrderService } from 'services/order/order-service';
import { Order, ServicePrice } from 'types';
import { OrderDTO } from 'types/order/OrderDTO';
import { CustomSnackbarOptions } from '../../../utils/CustomSnackbarOptions';
import { OrderItem } from '../components/order-item/order-item';
import { OrderListAddNewOrderValidatorFactory } from './validation/OrderListAddNewOrderValidatorFactory';
import { RequiredOrderListAddNewOrderValidator } from './validation/RequiredOrderListAddNewOrderValidator';



export function OrderList() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [createOrderModalOpened, setCreateOrderModalOpened] = React.useState(false);
  const [selectedServiceDate, setSelectedServiceDate] = React.useState(moment(new Date()).add(1, 'minutes').toDate());
  const [selectedServiceMinDate, setSelectedServiceMinDate] = React.useState(moment(new Date()).add(1, 'minutes'));
  const [customSnackbarOptions, setCustomSnackbarOptions] = React.useState<CustomSnackbarOptions>({ message: "", opened: false, severity: "success" });
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [servicePrices, setServicePrices] = React.useState<ServicePrice[]>([]);
  const [createdOrder, setCreatedOrder] = React.useState<OrderDTO>({serviceDates: [], city: "", address: "", area: 0, servicePriceIds: []});
  const [addServiceDateDisabled, setAddServiceDateDisabled] = React.useState(false);
  const [orderListAddNewOrderValidatorFactory, setOrderListAddNewOrderValidatorFactory] = React.useState(new OrderListAddNewOrderValidatorFactory()
    .addValidator(new RequiredOrderListAddNewOrderValidator("city"))
    .addValidator(new RequiredOrderListAddNewOrderValidator("address"))
    .addValidator(new RequiredOrderListAddNewOrderValidator("area"))
    .addValidator({
      fieldName: "area",
      errorMessage: "Wartość musi być większa od zera",
      validatorFn: (value: any) => parseFloat(value) > 0
    })
    .addValidator(new RequiredOrderListAddNewOrderValidator("serviceDate"))
    .addValidator({
      fieldName: "serviceDate",
      errorMessage: "Wprowadzona data jest nieprawidłowa",
      validatorFn: (value: any) => moment(value).isValid()
    })
    .addValidator({
      fieldName: "serviceDate",
      errorMessage: "Data i godzina musi być późniejsza niż aktualna",
      validatorFn: (value: any) => moment(value).diff(new Date(), 'minutes') >= 0
    })
    .addValidator({
      fieldName: "serviceDates",
      errorMessage: "Musisz dodać conajmniej jedną datę do zamówienia",
      validatorFn: (value: any) => value.length > 0
    })
    .addValidator({
      fieldName: "servicePrices",
      errorMessage: "Musisz zaznaczyć przynajmniej jedną usługę",
      validatorFn: (value: any) => value.length > 0
    })
  );

  const navigate = useNavigate();

  const orderService: OrderService = new OrderService(cookies);
  const adminService: AdminService = new AdminService(cookies);



  React.useEffect(() => {
    document.title = "Lista zamówień | Cleanny";

    if (cookies.token) {
      orderService.getOrders().then(res => setOrders(res));
    }
    else {
      navigate("/sign-in");
    }
  }, []);

  
  React.useEffect(() => {
    let interval: any;
    
    if (createOrderModalOpened) {
      interval = setInterval(() => {
        setSelectedServiceMinDate(moment(new Date()).add(1, 'seconds'));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [createOrderModalOpened]);





  const openCreateOrderModal = (): void => {
    setCreateOrderModalOpened(true);
    setSelectedServiceDate(moment(new Date()).add(1, 'minutes').toDate());
    setCreatedOrder({ serviceDates: [], city: "", address: "", area: 0, servicePriceIds: [] });
    setAddServiceDateDisabled(false);
    
    if (servicePrices.length == 0) {
      adminService.getServices()
        .then(res => setServicePrices(res))
        .catch(err => {
          if (err.response.status == 401) {
            setCustomSnackbarOptions({
              opened: true,
              severity: "error",
              message: "Twoja sesja wygasła. Zaloguj się ponownie"
            });
          }
        });
    }
  }

  const closeCreateOrderModal = (approved: boolean = false): void => {
    if (!approved) {
      setCreateOrderModalOpened(false);
    }
    else {
      [
        { fieldName: "city", value: createdOrder.city },
        { fieldName: "address", value: createdOrder.address },
        { fieldName: "area", value: createdOrder.area },
        { fieldName: "serviceDate", value: selectedServiceDate },
        { fieldName: "serviceDates", value: createdOrder.serviceDates },
        { fieldName: "servicePrices", value: createdOrder.servicePriceIds }
      ]
        .forEach(x => {
          orderListAddNewOrderValidatorFactory.run(x.fieldName, x.value);
          let newOrderListAddNewOrderValidatorFactory = Object.assign({}, orderListAddNewOrderValidatorFactory);
          setOrderListAddNewOrderValidatorFactory(newOrderListAddNewOrderValidatorFactory);
        });

      if (!orderListAddNewOrderValidatorFactory.hasAnyError()) {
        orderService.createOrder(createdOrder)
          .then(() => {
            orderService.getOrders().then(res => {
              setOrders([]);
              setOrders(res);
            });
          })
          .then(() => setCreateOrderModalOpened(false))
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
  }


  const handleInputChange = (fieldName: string, value: any): void => {
    setCreatedOrder({ ...createdOrder, [fieldName]: value });

    orderListAddNewOrderValidatorFactory.run(fieldName, value);
    setOrderListAddNewOrderValidatorFactory(orderListAddNewOrderValidatorFactory);
  }


  const handleDateTimePickerChange = (evt: any): void => {
    let selectedValue = evt?.toDate() ?? new Date();
    setSelectedServiceDate(selectedValue);
    setAddServiceDateDisabled(createdOrder.serviceDates.includes(moment(selectedValue).toISOString()));

    orderListAddNewOrderValidatorFactory.run("serviceDate", selectedValue);
    orderListAddNewOrderValidatorFactory.run("serviceDates", createdOrder.serviceDates);
    setOrderListAddNewOrderValidatorFactory(orderListAddNewOrderValidatorFactory);
  }


  const addServiceDateToOrder = (): void => {
    let newCreatedOrder = { ...createdOrder, serviceDates: [...createdOrder.serviceDates, moment(selectedServiceDate).toISOString()] };
    setCreatedOrder(newCreatedOrder);
    setAddServiceDateDisabled(newCreatedOrder.serviceDates.includes(moment(selectedServiceDate).toISOString()));

    orderListAddNewOrderValidatorFactory.run("serviceDate", selectedServiceDate);
    orderListAddNewOrderValidatorFactory.run("serviceDates", newCreatedOrder.serviceDates);
    setOrderListAddNewOrderValidatorFactory(orderListAddNewOrderValidatorFactory);
  }

  const removeServiceDateFromOrder = (date: string): void => {
    let newCreatedOrder = { ...createdOrder, serviceDates: createdOrder.serviceDates.filter(x => x != date) }
    setCreatedOrder(newCreatedOrder);
    setAddServiceDateDisabled(false);
  }

  const selectService = (servicePrice: ServicePrice): void => {
    let newCreatedOrder;
    if (!createdOrder.servicePriceIds.includes(servicePrice.id))
      newCreatedOrder = { ...createdOrder, servicePriceIds: [...createdOrder.servicePriceIds, servicePrice.id]};
    else
      newCreatedOrder = { ...createdOrder, servicePriceIds: createdOrder.servicePriceIds.filter(x => x != servicePrice.id) };
    
    setCreatedOrder(newCreatedOrder);

    orderListAddNewOrderValidatorFactory.run("servicePrices", newCreatedOrder.servicePriceIds);
    setOrderListAddNewOrderValidatorFactory(orderListAddNewOrderValidatorFactory);
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
        role="order-list-snackbar"
        open={customSnackbarOptions.opened}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setCustomSnackbarOptions({ ...customSnackbarOptions, opened: false })}
      >
        <Alert severity={customSnackbarOptions.severity}>{customSnackbarOptions.message}</Alert>
      </Snackbar>
      <Container component="main" maxWidth="xl">
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100px'
          }}
          role="order-list-header"
        >
          <Box>
            <Typography component="h1" variant="h5">Zamówienia</Typography>
            <Typography component="p" variant="subtitle1" color="text.secondary">
              Łączna liczba zamówień: <b>{orders.length}</b>
            </Typography>
          </Box>
          <Button
            role="order-list-open-dialog-button"
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={openCreateOrderModal}>Nowe zamówienie</Button>
        </Box>

        <Grid container spacing={2}>
          {orders.map(order => (
            <OrderItem 
              key={"order-list-item" + order.orderId} 
              order={order} 
              onChangeAssignment={assignOrder} 
            />
          ))}
        </Grid>
      </Container>

      <Dialog
        role="order-list-dialog"
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
                            role="order-list-form-field-city"
                            error={orderListAddNewOrderValidatorFactory.hasError("city")}
                            helperText={orderListAddNewOrderValidatorFactory.getErrorMessage("city")}
                            margin='normal'
                            required
                            fullWidth
                            id='city'
                            label='Miasto'
                            name='city'
                            onChange={evt => handleInputChange("city", evt.currentTarget.value)}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            role="order-list-form-field-address"
                            error={orderListAddNewOrderValidatorFactory.hasError("address")}
                            helperText={orderListAddNewOrderValidatorFactory.getErrorMessage("address")}
                            margin='normal'
                            required
                            fullWidth
                            id='address'
                            label='Adres'
                            name='address'
                            onChange={evt => handleInputChange("address", evt.currentTarget.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            role="order-list-form-field-area"
                            error={orderListAddNewOrderValidatorFactory.hasError("area")}
                            helperText={orderListAddNewOrderValidatorFactory.getErrorMessage("area")}
                            margin='normal'
                            required
                            fullWidth
                            id='area'
                            label='Powierzchnia'
                            name='area'
                            type="number"
                            onChange={evt => handleInputChange("area", evt.currentTarget.value)}
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
                          <FormControl variant="standard" fullWidth={true} role="order-list-form-field-service-date">
                            <LocalizationProvider dateAdapter={DateAdapter}>
                              <DateTimePicker
                                label="Data zamówienia"
                                value={selectedServiceDate}
                                inputFormat="DD MMM yyyy, HH:mm"
                                onChange={handleDateTimePickerChange}
                                renderInput={(params) => (
                                  <TextField 
                                    {...params}
                                    name="serviceDate"
                                    id="serviceDate"
                                    helperText={
                                      orderListAddNewOrderValidatorFactory.getErrorMessage("serviceDate") ??
                                      orderListAddNewOrderValidatorFactory.getErrorMessage("serviceDates")
                                    }
                                    error={
                                      orderListAddNewOrderValidatorFactory.hasError("serviceDate") ||
                                      orderListAddNewOrderValidatorFactory.hasError("serviceDates")
                                    }
                                  />
                                )}
                                minDate={selectedServiceMinDate}
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
                                role="order-list-service-date-add-button"
                                variant="contained"
                                size="large"
                                startIcon={<AddIcon />}
                                fullWidth={true}
                                disabled={addServiceDateDisabled || orderListAddNewOrderValidatorFactory.hasError("serviceDate")}
                                style={addServiceDateDisabled ? { pointerEvents: 'none' } : {}}
                                onClick={addServiceDateToOrder}>Dodaj</Button>
                            </span>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          {createdOrder.serviceDates.map(serviceDate => (
                            <Card
                              role="order-list-service-date"
                              key={"order-list-service-date-" + serviceDate}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                bgcolor: blue[700],
                                color: 'white',
                                marginBottom: '5px',
                                ":last-child": {
                                  marginBottom: 0
                                }
                              }}
                            >
                              <Box sx={{ padding: "8px" }}>
                                <Typography>{moment(serviceDate).locale("pl").format("DD MMM yyyy, HH:mm")}</Typography>
                              </Box>
                              <IconButton
                                role="order-list-service-date-delete-button"
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
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  borderColor: orderListAddNewOrderValidatorFactory.hasError("servicePrices") ? red[500] : "card.borderColor"
                }}
              >
                <CardHeader 
                  title="Wybierz usługi"
                  avatar={
                    <Avatar sx={{ background: red[500] }}>
                      <CleaningServicesIcon />
                    </Avatar>
                  }
                />
                <CardContent>
                  <List>
                    {servicePrices.map(servicePrice => (
                      <ListItemButton
                        role="order-list-service-price"
                        key={"order-list-service-price-" + servicePrice.id}
                        onClick={() => selectService(servicePrice)}
                        selected={createdOrder.servicePriceIds.includes(servicePrice.id)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {servicePrice.id}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={servicePrice.description} 
                          secondary={"Cena: " + (createdOrder.area * servicePrice.priceRatio).toFixed(2) + "zł"}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </CardContent>
                {orderListAddNewOrderValidatorFactory.hasError("servicePrices") && (
                  <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography color="error" component="p" variant="subtitle2">Musisz zaznaczyć jedną z usług</Typography>
                  </CardActions>
                )}
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ padding: '20px', color: red[500] }}>
                <Typography component="h5" variant="h5" align="right" role="order-list-total-price">
                  Łączna kwota: <b>{(servicePrices.filter(x => createdOrder.servicePriceIds.includes(x.id)).map(x => x.priceRatio).reduce((a, b) => a + b, 0) * createdOrder.area).toFixed(2)}zł</b>
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button
              role="order-item-create-order-approve"
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