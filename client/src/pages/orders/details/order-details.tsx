import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import EventNoteIcon from '@mui/icons-material/EventNote';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import PhoneIcon from '@mui/icons-material/Phone';
import { Alert, Avatar, Box, Button, ButtonGroup, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Link, List, ListItem, ListItemAvatar, ListItemText, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import moment from "moment";
import "moment/locale/pl";
import * as React from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { OrderService } from "services/order/order-service";
import { Order } from "types";
import { OrderUtils } from "utils/order-utils";
import { CustomSnackbarOptions } from '../../../utils/CustomSnackbarOptions';
import { OrderEmployee } from '../components/order-employee/order-employee';
import { OrderStatusWidget } from '../components/order-status/order-status-widget';
import { OrderStatusStateChangeCallbackBuilder } from '../components/order-status/OrderStatusStateChangeCallbackBuilder';
import { OrderDetailsDialogBoxOptions } from './OrderDetailsDialogBoxOptions';

export function OrderDetails() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [orderFound, setOrderFound] = React.useState(true);
  const [order, setOrder] = React.useState<Order>();
  const [customSnackbarOptions, setCustomSnackbarOptions] = React.useState<CustomSnackbarOptions>({message: "", opened: false, severity: "success"});
  const [orderDetailsDialogBoxOptions, setOrderDetailsDialogBoxOptions] = React.useState<OrderDetailsDialogBoxOptions>({ opened: false });
  
  const params: any = useParams();
  const navigate = useNavigate();

  const orderService: OrderService = new OrderService(cookies);
  const orderStatusStateChangeCallbackBuilder: OrderStatusStateChangeCallbackBuilder = new OrderStatusStateChangeCallbackBuilder()
    .addMethod("CONFIRMED", data => {
      data.setLoading(true);
      assignOrder();
    })
    .addMethod("ONGOING", data => {
      data.setLoading(true);
      orderService.startOrder(parseInt(params.id))
        .then(() => loadOrderDetails())
        .then(() => setCustomSnackbarOptions({ severity: "success", opened: true, message: "Status zamówienia został zmieniony pomyślnie" }));
    })
    .addMethod("CANCELED", data => {
      setOrderDetailsDialogBoxOptions({
        opened: true,
        title: "Ostrzeżenie",
        content: "Czy na pewno chcesz anulować zamówienie?",
        approveFunction: (): void => {
          data.setLoading(true);
          orderService.cancelOrder(parseInt(params.id))
            .then(() => setCustomSnackbarOptions({ severity: "success", opened: true, message: "Zamówienie zostało anulowane" }))
            .then(() => loadOrderDetails())
            .then(() => data.setLoading(false));
        }
      });
    })
    .addMethod("COMPLETED", data => {
      setOrderDetailsDialogBoxOptions({
        opened: true,
        title: "Informacja",
        content: "Czy na pewno chcesz zakończyć zamówienie (nie będzie możliwe jego ponowne otworzenie)?",
        approveFunction: (): void => {
          data.setLoading(true);
          orderService.completeOrder(parseInt(params.id))
            .then(() => setCustomSnackbarOptions({ severity: "success", opened: true, message: "Zamówienie zostało zakończone" }))
            .then(() => loadOrderDetails())
            .then(() => data.setLoading(false));
        }
      })
    });





  React.useEffect(() => {
    document.title = "Szczegóły zamówienia | Cleanny";

    if (cookies.token)
      loadOrderDetails();
    else
      navigate("/sign-in");
  }, []);







  const closeDialogBox = (approved: boolean = false): void => {
    setOrderDetailsDialogBoxOptions({ ...orderDetailsDialogBoxOptions, opened: false });

    if (approved && orderDetailsDialogBoxOptions.approveFunction != undefined)
      orderDetailsDialogBoxOptions.approveFunction();
  }

  
  const assignOrder = (): void => {
    orderService.assignOrder(parseInt(params.id))
      .then(() => loadOrderDetails())
      .then(() => setCustomSnackbarOptions({ severity: "success", opened: true, message: "Zamówienie zostało przypisane pomyślnie" }))
      .catch(err => setCustomSnackbarOptions({ severity: "error", opened: true, message: err.response.data }));
  }



  const loadOrderDetails = (): void => {
    orderService.getOrder(parseInt(params.id))
      .then(res => setOrder(res))
      .catch(() => setOrderFound(false));
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
      <Container component="main" maxWidth="xl" sx={{ padding: '20px 0' }} role="order-details-container">
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12}>
            <Card>
              <Box 
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px'
                }}
              >
                <Typography component="h5" variant="h5">Szczegóły zamówienia</Typography>
                <OrderEmployee
                  employee={order?.employee}
                  client={order?.client}
                  onChangeAssignment={assignOrder}
                />
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
                      role="order-details-service-date"
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
                      role="order-details-area"
                      primary={<span>{order?.area}m<sup>2</sup></span>}
                      secondary="Powierzchnia apartamentu" />
                  </ListItem>
                </List>
              </Box>
              <OrderStatusWidget 
                order={order!}
                callbackBuilder={orderStatusStateChangeCallbackBuilder} 
              />
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
                        <TableCell sx={{ fontWeight: 'bold' }}  align="right">Cena za usługę</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order?.services.map(servicePrice => (
                        <TableRow key={"order-details-service-price" + servicePrice.id} role="order-details-service-price">
                          <TableCell>{servicePrice.id}</TableCell>
                          <TableCell>{servicePrice.description}</TableCell>
                          <TableCell align="right">{(servicePrice.priceRatio * order?.area).toFixed(2)}zł</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Łączna cena</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: red[500] }} align="right" role="order-details-total-price">{order?.totalPrice.toFixed(2)}zł</TableCell>
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
                      role="order-details-client-name"
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
                      role="order-details-client-address"
                      primary={order?.client.city + ", " + order?.client.address}
                      secondary="Adres zamieszkania"/>
                  </ListItem>
                  {order?.client.companyName && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <ApartmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        role="order-details-client-company-name"
                        primary={order?.client.companyName}
                        secondary="Nazwa firmy" />
                    </ListItem>
                  )}
                  {order?.client.email && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <AlternateEmailIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        role="order-details-client-email"
                        primary={order?.client.email}
                        secondary="Adres e-mail" />
                    </ListItem>
                  )}
                  {order?.client.phoneNumber && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <PhoneIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        role="order-details-client-phone"
                        primary={order?.client.phoneNumber}
                        secondary="Numer telefonu" />
                    </ListItem>
                  )}
                  {order?.client.nip && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <Grid3x3Icon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        role="order-details-client-nip"
                        primary={order?.client.nip}
                        secondary="NIP" />
                    </ListItem>
                  )}
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
    <Box 
      sx={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
      role="order-details-not-found"
    >
      <Typography component="h1" variant="h5" color="text.secondary" textAlign="center">
        Nie udało się znaleźć zamówienia o wprowadzonych parametrach
      </Typography>
      <Link href="" onClick={() => navigate('/')} role="order-details-not-found-link">Powrót na stronę główną</Link>
    </Box>
  );
}