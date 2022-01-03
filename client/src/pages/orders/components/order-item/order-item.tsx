import EventNoteIcon from '@mui/icons-material/EventNote';
import InfoIcon from '@mui/icons-material/Info';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import moment from "moment";
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { OrderService } from 'services/order/order-service';
import { Order, User } from 'types';
import { OrderUtils } from 'utils/order-utils';
import { OrderEmployee } from '../order-employee/order-employee';
import { OrderItemProps } from "./order-item-props";

export function OrderItem(props : OrderItemProps) {

  const [orderStateColors, setOrderStateColors] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["token"]);
  const [order, setOrder] = React.useState<Order>(props.order);

  const navigate = useNavigate();

  const orderService: OrderService = new OrderService(cookies);



  React.useEffect(() => {
    let colors = OrderUtils.getOrderStatusColor(order.orderStatus.description);

    setOrderStateColors({
      padding: '5px 10px',
      fontWeight: 'bold',
      background: colors.background,
      color: colors.color
    });
  }, []);
  



  const assignOrder = (worker?: User): void => {
    setLoading(true);

    orderService.assignOrder(order.orderId, worker?.id)
      .then(() => {
        orderService.getOrder(order.orderId)
          .then(res => {
            setOrder(res);
            let colors = OrderUtils.getOrderStatusColor(res.orderStatus.description);
            setOrderStateColors({ ...orderStateColors, ...colors });
          });
        props.onChangeAssignment(true);
      })
      .catch(err => props.onChangeAssignment(false, err.response.data))
      .finally(() => setLoading(false));
  }
  


  return (
    <Grid item xl={3} md={4} sm={6} xs={12} sx={{ position: 'relative' }} role="order-item">
      <Card sx={{ minWidth: 200 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
          }}>
            <Paper sx={orderStateColors} role="order-item-status">
              {order.orderStatus.description}
            </Paper>
            <Typography 
              component="h5"
              variant="h5"
              sx={{ 
                color: red[500],
                fontWeight: 'bold'
              }}
              role="order-item-price">
              {order.totalPrice.toFixed(2)}zł
            </Typography>
          </Box>
          <Box>
            <List sx={{ bgcolor: "background.paper" }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="order-item-person-details"
                  primary={order.client.firstName + " " + order.client.lastName}
                  secondary="Imię i nazwisko klienta"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EventNoteIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="order-item-service-date"
                  primary={moment(order.serviceDate).locale("pl").format("DD MMMM yyyy")}
                  secondary="Data ralizacji zamówienia"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <MapIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  role="order-item-area"
                  primary={<span>{order.area}m<sup>2</sup></span>}
                  secondary="Powierzchnia"
                />
              </ListItem>
            </List>
          </Box>
        </CardContent>
        <CardActions disableSpacing sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button
            variant="contained"
            disableElevation
            aria-controls={"order-menu-" + order.orderId}
            aria-haspopup="true"
            startIcon={<InfoIcon />}
            role="order-item-details-button"
            onClick={() => navigate(`/orders/${order.orderId}`)}>
            Szczegóły
          </Button>

          <OrderEmployee employee={order?.employee} client={order.client} onChangeAssignment={assignOrder} />
        </CardActions>
      </Card>
      {loading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.4)'
        }}>
          <CircularProgress
            size={48}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%'
            }}
          />
        </Box>
      )}
    </Grid>
  )
}