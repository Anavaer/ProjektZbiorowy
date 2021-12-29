import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import EventNoteIcon from '@mui/icons-material/EventNote';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import { Alert, Avatar, Box, Button, ButtonGroup, Card, CardContent, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import moment from "moment";
import "moment/locale/pl";
import * as React from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { OrderService } from "services/order-service";
import { OrderStatusService } from "services/order-status-service";
import { Order, OrderStatus } from "types";
import { OrderUtils } from "utils/order-utils";
import { CustomSnackbarOptions } from '../../../utils/CustomSnackbarOptions';
import { OrderEmployee } from '../components/order-employee/order-employee';
import { OrderDetailsStateChangeCallbackBuilder } from './OrderDetailsChangeCallbackFactory';
import { OrderDetailsDialogBoxOptions } from './OrderDetailsDialogBoxOptions';
import { OrderDetailsStatusOptions } from './OrderDetailsStatusOptions';

export function OrderDetails() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [orderFound, setOrderFound] = React.useState(true);
  const [order, setOrder] = React.useState<Order>();
  const [orderDetailsStatusOptions, setOrderDetailsStatusOptions] = React.useState<OrderDetailsStatusOptions>({ menuOpened: false, completed: false, loading: true });
  const [customSnackbarOptions, setCustomSnackbarOptions] = React.useState<CustomSnackbarOptions>({message: "", opened: false, severity: "success"});
  const [orderDetailsDialogBoxOptions, setOrderDetailsDialogBoxOptions] = React.useState<OrderDetailsDialogBoxOptions>({ opened: false });
  
  const params: any = useParams();
  const navigate = useNavigate();

  const orderService: OrderService = new OrderService(cookies);
  const orderStatusService: OrderStatusService = new OrderStatusService(cookies);
  const orderDetailsStateChangeCallbackBuilder: OrderDetailsStateChangeCallbackBuilder = new OrderDetailsStateChangeCallbackBuilder()
    .addMethod("CONFIRMED", orderStatus => {
      setOrderDetailsStatusOptions({ ...orderDetailsStatusOptions, loading: true });
      assignOrder();
      updateOrderDetailsStatus(orderStatus);
    })
    .addMethod("ONGOING", orderStatus => {
      setOrderDetailsStatusOptions({ ...orderDetailsStatusOptions, loading: true });
      orderService.startOrder(parseInt(params.id))
        .then(() => loadOrderDetails())
        .then(() => setCustomSnackbarOptions({ severity: "success", opened: true, message: "Status zamówienia został zmieniony pomyślnie" }))
        .then(() => updateOrderDetailsStatus(orderStatus));
    })
    .addMethod("CANCELED", orderStatus => {
      setOrderDetailsDialogBoxOptions({
        opened: true,
        title: "Ostrzeżenie",
        content: "Czy na pewno chcesz anulować zamówienie?",
        approveFunction: (): void => {
          setOrderDetailsStatusOptions({ ...orderDetailsStatusOptions, loading: true, menuOpened: false });
          orderService.cancelOrder(parseInt(params.id))
            .then(() => setCustomSnackbarOptions({ severity: "success", opened: true, message: "Zamówienie zostało anulowane" }))
            .then(() => updateOrderDetailsStatus(orderStatus));
        },
        rejectFunction: (): void => setOrderDetailsStatusOptions({ ...orderDetailsStatusOptions, loading: false, menuOpened: false })
      });
    })
    .addMethod("COMPLETED", orderStatus => {
      setOrderDetailsDialogBoxOptions({
        opened: true,
        title: "Informacja",
        content: "Czy na pewno chcesz zakończyć zamówienie (nie będzie możliwe jego ponowne otworzenie)?",
        approveFunction: (): void => {
          setOrderDetailsStatusOptions({ ...orderDetailsStatusOptions, loading: true, menuOpened: false });
          orderService.completeOrder(parseInt(params.id))
            .then(() => setCustomSnackbarOptions({ severity: "success", opened: true, message: "Zamówienie zostało zakończone" }))
            .then(() => updateOrderDetailsStatus(orderStatus));
        },
        rejectFunction: (): void => setOrderDetailsStatusOptions({ ...orderDetailsStatusOptions, loading: false, menuOpened: false })
      })
    });





  React.useEffect(() => {
    document.title = "Szczegóły zamówienia | Cleanny";

    if (cookies.token)
      loadOrderDetails();
    else
      navigate("/");
  }, []);







  const openOrderStatusMenu = (evt: React.MouseEvent<HTMLElement>): void => {
    if (!orderDetailsStatusOptions.completed)
      setOrderDetailsStatusOptions({
        ...orderDetailsStatusOptions,
        menuOpened: true,
        anchorEl: evt.currentTarget,
        loading: false
      });
  }


  const closeDialogBox = (approved: boolean = false): void => {
    setOrderDetailsDialogBoxOptions({ ...orderDetailsDialogBoxOptions, opened: false });

    if (approved && orderDetailsDialogBoxOptions.approveFunction != undefined) {
      orderDetailsDialogBoxOptions.approveFunction();
    }
    else if (orderDetailsDialogBoxOptions.rejectFunction != undefined) {
      orderDetailsDialogBoxOptions.rejectFunction();
    }
  }

  
  const assignOrder = (): void => {
    orderService.assignOrder(parseInt(params.id))
      .then(() => loadOrderDetails())
      .then(() => setCustomSnackbarOptions({ severity: "success", opened: true, message: "Zamówienie zostało przypisane pomyślnie" }))
      .catch(err => setCustomSnackbarOptions({ severity: "error", opened: true, message: err.response.data }));
  }



  const loadOrderDetails = (): void => {
    orderService.getOrder(parseInt(params.id))
      .then(res => {
        setOrder(res);

        let newOrderDetailsStatusOptions: OrderDetailsStatusOptions = {
          ...orderDetailsStatusOptions,
          loading: false,
          completed: OrderUtils.isCompleted(res),
          menuOpened: false,
          colors: OrderUtils.getOrderStatusColor(res.orderStatus.description)
        };

        setOrderDetailsStatusOptions(newOrderDetailsStatusOptions);
        return newOrderDetailsStatusOptions;
      })
      .then(options => {
        orderStatusService.getAllOrderStatuses()
          .then(res => setOrderDetailsStatusOptions({ ...options, list: res, loading: false }));
      })
      .catch(() => setOrderFound(false));
  }

  const updateOrderDetailsStatus = (orderStatus: OrderStatus): void => {
    let newOrder: Order = Object.assign({}, order);
    newOrder.orderStatus.orderStatusId = orderStatus.orderStatusId;
    newOrder.orderStatus.description = orderStatus.description;
    setOrder(newOrder);

    setOrderDetailsStatusOptions({
      ...orderDetailsStatusOptions,
      anchorEl: undefined,
      list: [...(orderDetailsStatusOptions.list ?? [])].filter(x => x.orderStatusId >= orderStatus.orderStatusId),
      colors: OrderUtils.getOrderStatusColor(orderStatus.description),
      menuOpened: false,
      completed: OrderUtils.isCompleted(order)
    });
  }


  return orderFound ? (
    <div>
      <Snackbar 
        open={customSnackbarOptions.opened} 
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
        onClose={() => setCustomSnackbarOptions({ ...customSnackbarOptions, opened: false})}
      >
        <Alert severity={customSnackbarOptions.severity}>{customSnackbarOptions.message}</Alert>
      </Snackbar>
      <Container component="main" maxWidth="xl" sx={{ padding: '20px 0' }}>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12}>
            <Card>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px'
              }}>
                <Typography component="h5" variant="h5">Szczegóły zamówienia</Typography>
                <OrderEmployee employee={order?.employee} onChangeAssignment={assignOrder} />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '16px'
            }}>
              <Box>
                <Typography component="h6" variant="h6">Podstawowe informacje</Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <EventNoteIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={moment(order?.serviceDate).locale("pl").format("DD MMMM yyyy, HH:mm:ss")}
                      secondary="Data złożenia zamówienia" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <MapIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<span>{order?.area} m<sup>2</sup></span>}
                      secondary="Powierzchnia apartamentu" />
                  </ListItem>
                </List>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography component="p" variant="subtitle1">Status zamówienia</Typography>
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ExpandMoreIcon />}
                    onClick={openOrderStatusMenu}
                    disableRipple={orderDetailsStatusOptions.completed}
                    disabled={orderDetailsStatusOptions.loading}
                    sx={{
                      ...orderDetailsStatusOptions.colors,
                      fontWeight: 'bold',
                      ':hover': {
                        'bgcolor': !orderDetailsStatusOptions.completed ? orderDetailsStatusOptions.colors?.backgroundDark : orderDetailsStatusOptions.colors?.background
                      }
                    }}
                  >
                    {order?.orderStatus.description}
                  </Button>
                  {orderDetailsStatusOptions.loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Menu
                id="order-status-menu"
                MenuListProps={{ 'aria-labelledby': "order-status-menu" }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                anchorEl={orderDetailsStatusOptions.anchorEl}
                open={orderDetailsStatusOptions.menuOpened}
                onClose={() => setOrderDetailsStatusOptions({ ...orderDetailsStatusOptions, menuOpened: false, loading: false }) }
                sx={{
                  'ul': {
                    padding: '0'
                  }
                }}
              >
                {orderDetailsStatusOptions.list?.filter(x => x.description == "CANCELED" || x.orderStatusId == (order?.orderStatus.orderStatusId ?? 1) + 1)
                .map(status => {
                  let colors = OrderUtils.getOrderStatusColor(status.description);
                  return (
                    <MenuItem
                      sx={{
                        ...colors,
                        fontWeight: 'bold',
                        ':hover': {
                          'bgcolor': colors?.backgroundDark
                        }
                      }}
                      onClick={() => orderDetailsStateChangeCallbackBuilder.run(status)}>{status.description}</MenuItem>
                  )
                })}
              </Menu>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card>
              <CardContent>
                <Typography component="h5" variant="h5">Lista usług</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }} >Numer usługi</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} >Nazwa usługi</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}  align="right">Cena zausługę</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order?.servicePrices.map(servicePrice => (
                        <TableRow>
                          <TableCell>{servicePrice.id}</TableCell>
                          <TableCell>{servicePrice.description}</TableCell>
                          <TableCell align="right">{(servicePrice.priceRatio * order?.totalPrice).toFixed(2)}zł</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Łączna cena</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: red[500] }} align="right">{order?.totalPrice.toFixed(2)}zł</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography component="h5" variant="h5">Dane klienta</Typography>
                <List>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText
                      primary={order?.client.firstName + " " + order?.client.lastName}
                      secondary="Imię i nazwisko" />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <HomeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={order?.client.city + ", " + order?.client.address}
                      secondary="Adres zamieszkania"/>
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <ApartmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={order?.client.city + ", " + order?.client.address}
                      secondary="Adres zamieszkania" />
                  </ListItem>
                  {order?.client.email != null ? (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <AlternateEmailIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={order?.client.email}
                        secondary="Adres e-mail" />
                    </ListItem>
                  ) : null}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <Grid3x3Icon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={order?.client.nip}
                      secondary="NIP" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={orderDetailsDialogBoxOptions.opened} onClose={() => closeDialogBox()}>
        <DialogTitle>
          {orderDetailsDialogBoxOptions.title}
        </DialogTitle>
        <DialogContent>
          {orderDetailsDialogBoxOptions.content}
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button 
              color="success" 
              startIcon={<DoneIcon />} 
              onClick={() => closeDialogBox(true)}>Tak</Button>
            <Button 
              color="error"
              startIcon={<CloseIcon />}
              onClick={() => closeDialogBox()}>Nie</Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </div>
  ) : (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <Typography component="h1" variant="h5" color="text.secondary" textAlign="center">
        Nie udało się znaleźć zamówienia o wprowadzonych parametrach
      </Typography>
      <Link href="" onClick={() => navigate('/')}>Powrót na stronę główną</Link>
    </Box>
  );
}