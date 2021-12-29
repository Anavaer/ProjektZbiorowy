import EventNoteIcon from '@mui/icons-material/EventNote';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Avatar, Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Paper, Typography } from "@mui/material";
import { green, red } from "@mui/material/colors";
import moment from "moment";
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { OrderService } from 'services/order-service';
import { Order } from 'types';
import { OrderUtils } from 'utils/order-utils';
import { OrderEmployee } from '../order-employee/order-employee';
import { OrderItemProps } from "./order-item-props";

export function OrderItem(props : OrderItemProps) {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [orderStateColors, setOrderStateColors] = React.useState<any>();
  const [loading, setLoading] = React.useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["token"]);
  const [order, setOrder] = React.useState<Order>(props.order);

  const navigate = useNavigate();
  const optionsOpened: boolean = Boolean(anchorEl);

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
  


  const handleOpenMoreOptionsClick = (event: React.MouseEvent<HTMLElement>): void => setAnchorEl(event.currentTarget);
  const handleCloseMoreOptionsClick = (): void => setAnchorEl(null);

  const assignOrder = (): void => {
    setAnchorEl(null);
    setLoading(true);

    orderService.assignOrder(order.orderId)
      .then(() => {
        orderService.getOrder(order.orderId).then(res => setOrder(res));
        props.onChangeAssignment(true);
      })
      .catch(err => props.onChangeAssignment(false, err.response.data))
      .finally(() => setLoading(false));
  }
  const openOrderDetailsPage = (): void => navigate(`/orders/${order.orderId}`);
  


  return (
    <Grid item xl={3} md={4} sm={6} xs={12} sx={{ position: 'relative' }}>
      <Card sx={{ minWidth: 200 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
          }}>
            <Paper sx={orderStateColors}>
              {order.orderStatus.description}
            </Paper>
            <Typography 
              component="h5"
              variant="h5"
              sx={{ 
                color: red[500],
                fontWeight: 'bold'
              }}>
              {order.totalPrice}zł
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
                <ListItemText primary={order.client.firstName + " " + order.client.lastName} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EventNoteIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={moment(order.serviceDate).locale("pl").format("DD MMMM yyyy")} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <MapIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<span>{order.area} m<sup>2</sup></span>} />
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
            endIcon={<ExpandMoreIcon />}
            onClick={handleOpenMoreOptionsClick}>
            Opcje
          </Button>
          <Menu
            id={"order-menu-" + order.orderId}
            MenuListProps={{ 'aria-labelledby': "order-menu-" + order.orderId }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            anchorEl={anchorEl}
            open={optionsOpened}
            onClose={handleCloseMoreOptionsClick}
          >
            {order.employee == null ? (
              <MenuItem onClick={assignOrder} disableRipple>
                <PersonAddAltIcon sx={{ marginRight: '10px' }} />
                Przypisz do mnie
              </MenuItem>
            ) : null}
            <MenuItem onClick={openOrderDetailsPage} disableRipple>
              <InfoIcon sx={{ marginRight: '10px' }} />
              Wyświetl szczegóły
            </MenuItem>
          </Menu>

          <OrderEmployee employee={order?.employee} />
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