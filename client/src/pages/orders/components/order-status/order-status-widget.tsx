import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, CircularProgress, Menu, MenuItem, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { OrderStatusService } from 'services/order/status/order-status-service';
import { OrderStatus } from "types";
import { OrderUtils } from "utils/order-utils";
import { OrderStatusWidgetColorsOptions } from "./order-status-widget-colors-props";
import { OrderStatusWidgetProps } from "./order-status-widget-props";

export function OrderStatusWidget(props: OrderStatusWidgetProps) {
  const [loading, setLoading] = React.useState(false);
  const [menuOpened, setMenuOpened] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>();
  const [statusColors, setStatusColors] = React.useState<OrderStatusWidgetColorsOptions>();
  const [statusList, setStatusList] = React.useState<OrderStatus[]>([]);

  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const orderStatusService: OrderStatusService = new OrderStatusService(cookies);



  React.useEffect(() => {
    if (props.value) {
      orderStatusService.getAllOrderStatuses().then(res => setStatusList(res));
      setStatusColors(OrderUtils.getOrderStatusColor(props.value.description));
    }
  }, [props.value]);




  const openOrderStatusMenu = (evt: React.MouseEvent<HTMLElement>): void => {
    if (!props.completed) {
      setMenuOpened(true);
      setLoading(false);
      setAnchorEl(evt.currentTarget);
    }
  }

  
  const handleMenuClosed = (): void => {
    setLoading(false);
    setMenuOpened(false);
  }


  const handleMenuItemSelect = (status: OrderStatus): void => {
    setMenuOpened(false);
    props.callbackBuilder.run(status, { setLoading });
    setLoading(false);
  }
  

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography component="p" variant="subtitle1">Status zamówienia</Typography>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ExpandMoreIcon />}
            onClick={openOrderStatusMenu}
            disableRipple={props.completed}
            disabled={loading}
            sx={{
              ...statusColors,
              fontWeight: 'bold',
              ':hover': {
                'bgcolor': !props.completed ? statusColors?.backgroundDark : statusColors?.background
              }
            }}
          >
            {props.value?.description}
          </Button>
          {loading && (
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
        anchorEl={anchorEl}
        open={menuOpened}
        onClose={handleMenuClosed}
        sx={{
          'ul': {
            padding: '0'
          }
        }}
      >
        {statusList.filter(x => x.description == "CANCELED" || x.orderStatusId == (props.value?.orderStatusId ?? 1) + 1)
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
                onClick={() => handleMenuItemSelect(status)}>{status.description}</MenuItem>
            )
          })}
      </Menu>
    </div>
  );

}